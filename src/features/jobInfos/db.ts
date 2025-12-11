import { db } from "@/drizzle/db";
import { JobInfoTable } from "@/drizzle/schema";
import { revalidateJobInfosCache } from "./dbCache";
import { eq } from "drizzle-orm";

export const insertJobInfo = async (
  jobInfo: typeof JobInfoTable.$inferInsert
) => {
  const [newJobInfo] = await db.insert(JobInfoTable).values(jobInfo).returning({
    id: JobInfoTable.id,
    userId: JobInfoTable.userId,
  });

  revalidateJobInfosCache(newJobInfo);

  return newJobInfo;
};

export const updateJobInfo = async (
  id: string,
  jobInfo: Partial<typeof JobInfoTable.$inferInsert>
) => {
  const [updatedJobInfo] = await db
    .update(JobInfoTable)
    .set(jobInfo)
    .where(eq(JobInfoTable.id, id))
    .returning({
      id: JobInfoTable.id,
      userId: JobInfoTable.userId,
    });

  revalidateJobInfosCache(updatedJobInfo);

  return updatedJobInfo;
};
