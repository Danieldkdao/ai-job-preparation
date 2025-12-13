import { JobInfoBackLink } from "@/features/jobInfos/components/JobInfoBackLink";
import { canRunResumeAnalysis } from "@/features/resumeAnalyses/permissions";
import { Loader2Icon } from "lucide-react";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { ResumePageClient } from "./_client";

const ResumePage = async ({
  params,
}: {
  params: Promise<{ jobInfoId: string }>;
}) => {
  const { jobInfoId } = await params;
  return (
    <div className="container py-4 space-y-4 h-screen-header flex flex-col items-start">
      <JobInfoBackLink jobInfoId={jobInfoId} />
      <Suspense
        fallback={<Loader2Icon className="animate-spin size-24 m-auto" />}
      >
        <SuspendedComponent jobInfoId={jobInfoId} />
      </Suspense>
    </div>
  );
};

export default ResumePage;

const SuspendedComponent = async ({ jobInfoId }: { jobInfoId: string }) => {
  if (!(await canRunResumeAnalysis())) return redirect("/app/upgrade");

  return <ResumePageClient jobInfoId={jobInfoId} />;
};
