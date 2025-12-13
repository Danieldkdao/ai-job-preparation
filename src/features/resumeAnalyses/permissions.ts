import { hasPermission } from "@/services/clerk/lib/hasPermission";

export const canRunResumeAnalysis = async () => {
  return hasPermission("unlimited_resume_analysis");
};
