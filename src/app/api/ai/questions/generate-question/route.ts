import { db } from "@/drizzle/db";
import {
  JobInfoTable,
  questionDifficulties,
  QuestionTable,
} from "@/drizzle/schema";
import { getJobInfoIdTag } from "@/features/jobInfos/dbCache";
import { getQuestionJobInfoTag } from "@/features/questions/dbCache";
import { canCreateQuestion } from "@/features/questions/permissions";
import { PLAN_LIMIT_MESSAGE } from "@/lib/errorToast";
import { getCurrentUser } from "@/services/clerk/lib/getCurrentUser";
import { and, asc, eq } from "drizzle-orm";
import { cacheTag } from "next/cache";
import z from "zod";
import { generateAiQuestion } from "@/services/ai/questions";
import {
  createUIMessageStreamResponse,
  createUIMessageStream,
  type UIMessage,
} from "ai";
import { insertQuestion } from "@/features/questions/db";

const schema = z.object({
  prompt: z.enum(questionDifficulties),
  jobInfoId: z.string().min(1),
});

export const POST = async (req: Request) => {
  const body = await req.json();
  const prompt = body.messages
    .filter((msg: UIMessage) => msg.role === "user")
    .slice(-1)[0].parts[0].text;
  const userReq = { prompt, jobInfoId: body.jobInfoId };
  const result = schema.safeParse(userReq);
  if (!result.success) {
    return new Response("Error generating your question", { status: 400 });
  }

  const { prompt: difficulty, jobInfoId } = result.data;
  const { userId } = await getCurrentUser();

  if (userId == null) {
    return new Response("You are not logged in", { status: 401 });
  }

  if (!(await canCreateQuestion())) {
    return new Response(PLAN_LIMIT_MESSAGE, { status: 403 });
  }

  const jobInfo = await getJobInfo(jobInfoId, userId);
  if (jobInfo == null) {
    return new Response("You do not have permission to do this", {
      status: 403,
    });
  }

  const previousQuestions = await getQuestions(jobInfoId);

  const stream = createUIMessageStream({
    execute: async ({ writer }) => {
      const res = generateAiQuestion({
        previousQuestions,
        jobInfo,
        difficulty,
        onFinish: async (question) => {
          const { id } = await insertQuestion({
            text: question,
            jobInfoId,
            difficulty,
          });

          writer.write({ type: "data-questionId", data: id });
        },
      });

      writer.merge(res.toUIMessageStream());
    },
  });

  return createUIMessageStreamResponse({ stream });
};

const getQuestions = async (jobInfoId: string) => {
  "use cache";
  cacheTag(getQuestionJobInfoTag(jobInfoId));

  return db.query.QuestionTable.findMany({
    where: eq(QuestionTable.jobInfoId, jobInfoId),
    orderBy: asc(QuestionTable.createdAt),
  });
};

const getJobInfo = async (id: string, userId: string) => {
  "use cache";
  cacheTag(getJobInfoIdTag(id));

  return db.query.JobInfoTable.findFirst({
    where: and(eq(JobInfoTable.id, id), eq(JobInfoTable.userId, userId)),
  });
};
