import { Suspense } from "react";
import OnboardingContent from "./_components/OnboardingContent";

const Onboarding = async () => {
  return (
    <Suspense>
      <OnboardingContent />
    </Suspense>
  );
};

export default Onboarding;
