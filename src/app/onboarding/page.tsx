import { getCurrentUser } from "@/services/clerk/lib/getCurrentUser";
import OnboardingContent from "./_components/OnboardingContent";
import { redirect } from "next/navigation";

const Onboarding = async () => {
  const { userId, user } = await getCurrentUser({ allData: true });

  if (userId == null) return redirect("/");
  if (user != null) return redirect("/app");
  return (
    <div className="container flex flex-col items-center justify-center h-screen gap-4">
      <h1 className="text-4xl">Creating your account...</h1>
      <OnboardingContent />
    </div>
  );
};

export default Onboarding;
