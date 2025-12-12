import { db } from "@/drizzle/db";
import { JobInfoTable, QuestionTable } from "@/drizzle/schema";
import { getCurrentUser } from "@/services/clerk/lib/getCurrentUser";
import { hasPermission } from "@/services/clerk/lib/hasPermission";
import { count, eq } from "drizzle-orm";

export const canCreateQuestion = async () => {
  return await Promise.any([
    hasPermission("unlimited_questions").then(
      (bool) => bool || Promise.reject()
    ),
    Promise.all([hasPermission("5_questions"), getUserQuestionCount()]).then(
      ([has, c]) => {
        if (has && c < 5) return true;
        return Promise.reject();
      }
    ),
  ]).catch(() => false);
};

const getUserQuestionCount = async () => {
  const { userId } = await getCurrentUser();
  if (userId == null) return 0;

  return getQuestionCount(userId);
};

const getQuestionCount = async (userId: string) => {
  const [{ count: c }] = await db
    .select({ count: count() })
    .from(QuestionTable)
    .innerJoin(JobInfoTable, eq(QuestionTable.jobInfoId, JobInfoTable.id))
    .where(eq(JobInfoTable.userId, userId));

  return c;
};
