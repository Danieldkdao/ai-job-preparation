import {
  getGlobalTag,
  getIdTag,
  getJobInfoTag,
} from "@/lib/dataCache";
import { revalidateTag } from "next/cache";

export const getQuestionGlobalTag = () => {
  return getGlobalTag("questions");
};

export const getQuestionJobInfoTag = (jobInfoId: string) => {
  return getJobInfoTag("questions", jobInfoId);
};

export const getQuestionIdTag = (id: string) => {
  return getIdTag("questions", id);
};

export const revalidateQuestionCache = ({
  id,
  jobInfoId,
}: {
  id: string;
  jobInfoId: string;
}) => {
  revalidateTag(getQuestionGlobalTag(), "max");
  revalidateTag(getQuestionJobInfoTag(jobInfoId), "max");
  revalidateTag(getQuestionIdTag(id), "max");
};
