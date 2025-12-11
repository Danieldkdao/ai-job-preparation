import { getGlobalTag, getIdTag, getUserTag } from "@/lib/dataCache";
import { revalidateTag } from "next/cache";

export const getJobInfoGlobalTag = () => {
  return getGlobalTag("jobInfos");
};

export const getJobInfoUserTag = (userId: string) => {
  return getUserTag("jobInfos", userId);
};

export const getJobInfoIdTag = (id: string) => {
  return getIdTag("jobInfos", id);
};

export const revalidateJobInfosCache = ({
  id,
  userId,
}: {
  id: string;
  userId: string;
}) => {
  revalidateTag(getJobInfoGlobalTag(), "max");
  revalidateTag(getJobInfoUserTag(userId), "max");
  revalidateTag(getJobInfoIdTag(id), "max");
};
