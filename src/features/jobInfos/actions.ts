"use server";

import { z } from "zod";
import { jobInfoSchema } from "./schemas";
import { getCurrentUser } from "@/services/clerk/lib/getCurrentUser";
import { redirect } from "next/navigation";
import {
  insertJobInfo as insertJobInfoDb,
  updateJobInfo as updateJobInfoDb,
} from "./db";
import { db } from "@/drizzle/db";
import { and, eq } from "drizzle-orm";
import { JobInfoTable } from "@/drizzle/schema";
import { cacheTag } from "next/cache";
import { getJobInfoIdTag } from "./dbCache";

export const createJobInfo = async (
  unsafeData: z.infer<typeof jobInfoSchema>
) => {
  const { userId } = await getCurrentUser();
  if (userId == null) {
    return { error: true, message: "You don't have permission to do this." };
  }

  const { success, data } = jobInfoSchema.safeParse(unsafeData);
  if (!success) {
    return { error: true, message: "Invalid job data" };
  }

  const jobInfo = await insertJobInfoDb({ ...data, userId });

  redirect(`/app/job-infos/${jobInfo.id}`);
};

export const updateJobInfo = async (
  id: string,
  unsafeData: z.infer<typeof jobInfoSchema>
) => {
  const { userId } = await getCurrentUser();
  if (userId == null) {
    return { error: true, message: "You don't have permission to do this." };
  }

  const { success, data } = jobInfoSchema.safeParse(unsafeData);
  if (!success) {
    return { error: true, message: "Invalid job data" };
  }

  const existingJobInfo = await getJobInfo(id, userId);
  if (existingJobInfo == null) {
    return {
      error: true,
      message: "You don't have permission to do this.",
    };
  }

  const jobInfo = await updateJobInfoDb(id, data);

  redirect(`/app/job-infos/${jobInfo.id}`);
};

const getJobInfo = async (id: string, userId: string) => {
  "use cache";
  cacheTag(getJobInfoIdTag(id));
  return db.query.JobInfoTable.findFirst({
    where: and(eq(JobInfoTable.id, id), eq(JobInfoTable.userId, userId)),
  });
};
