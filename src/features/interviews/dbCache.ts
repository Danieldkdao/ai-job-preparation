import {
  getGlobalTag,
  getIdTag,
  getJobInfoTag,
} from "@/lib/dataCache";
import { revalidateTag } from "next/cache";

export const getInterviewGlobalTag = () => {
  return getGlobalTag("jobInfos");
};

export const getInterviewJobInfoTag = (jobInfoId: string) => {
  return getJobInfoTag("jobInfos", jobInfoId);
};

export const getInterviewIdTag = (id: string) => {
  return getIdTag("interviews", id);
};

export const revalidateInterviewCache = ({
  id,
  jobInfoId,
}: {
  id: string;
  jobInfoId: string;
}) => {
  revalidateTag(getInterviewGlobalTag(), "max");
  revalidateTag(getInterviewJobInfoTag(jobInfoId), "max");
  revalidateTag(getInterviewIdTag(id), "max");
};
