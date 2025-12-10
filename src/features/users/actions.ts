"use server";

import { cacheTag } from "next/cache";
import { getUserIdTag } from "./dbCache";
import { db } from "@/drizzle/db";
import { eq } from "drizzle-orm";
import { UserTable } from "@/drizzle/schema";

export const getUser = async (id: string) => {
  "use cache";
  cacheTag(getUserIdTag(id));

  return db.query.UserTable.findFirst({
    where: eq(UserTable.id, id),
  });
};
