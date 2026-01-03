"use client";

import { ActionButton } from "@/components/ui/action-button";
import { generateInterviewFeedback } from "@/features/interviews/actions";
import { useRouter } from "next/navigation";

export const GenerateFeedbackButton = ({ id }: { id: string }) => {
  const router = useRouter();

  const action = async () => {
    const response = await generateInterviewFeedback(id);
    router.refresh();
    return response;
  };

  return (
    <ActionButton action={action} className="cursor-pointer">
      Generate Feedback
    </ActionButton>
  );
};
