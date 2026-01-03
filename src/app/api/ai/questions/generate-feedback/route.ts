import { db } from "@/drizzle/db";
import { QuestionTable } from "@/drizzle/schema";
import { getJobInfoIdTag } from "@/features/jobInfos/dbCache";
import { getQuestionIdTag } from "@/features/questions/dbCache";
import { getCurrentUser } from "@/services/clerk/lib/getCurrentUser";
import { eq } from "drizzle-orm";
import { cacheTag } from "next/cache";
import z from "zod";
import {
  type UIMessage,
} from "ai";
import { generateAiQuestionFeedback } from "@/services/ai/questions";

const schema = z.object({
  prompt: z.string().min(1),
  questionId: z.string().min(1),
});

export const POST = async (req: Request) => {
  const body = await req.json();
  const prompt = body.messages
    .filter((msg: UIMessage) => msg.role === "user")
    .slice(-1)[0].parts[0].text;
  const userReq = { prompt, questionId: body.questionId };
  const result = schema.safeParse(userReq);
  if (!result.success) {
    return new Response("Error generating your feedback", { status: 400 });
  }

  const { prompt: answer, questionId } = result.data;
  const { userId, user } = await getCurrentUser({ allData: true });

  if (userId == null || !user) {
    return new Response("You are not logged in", { status: 401 });
  }

  if (process.env.NODE_ENV === "production" && !user.isAllowed) {
    return new Response("Feature disabled in production", { status: 400 });
  }

  const question = await getQuestion(questionId, userId);
  if (question == null) {
    return new Response("You do not have permission to do this", {
      status: 403,
    });
  }

  const res = generateAiQuestionFeedback({
    question: question.text,
    answer,
  });

  return res.toUIMessageStreamResponse();
};

const getQuestion = async (id: string, userId: string) => {
  "use cache";
  cacheTag(getQuestionIdTag(id));

  const question = await db.query.QuestionTable.findFirst({
    where: eq(QuestionTable.id, id),
    with: { jobInfo: { columns: { id: true, userId: true } } },
  });

  if (question == null) return null;
  cacheTag(getJobInfoIdTag(question.jobInfo.id));

  if (question.jobInfo.userId !== userId) return null;
  return question;
};
