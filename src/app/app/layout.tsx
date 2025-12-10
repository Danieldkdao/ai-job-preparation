import { getCurrentUser } from "@/services/clerk/lib/getCurrentUser";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";

const AppLayout = async ({ children }: { children: ReactNode }) => {
  const { userId, user } = await getCurrentUser({ allData: true });

  if (userId == null) return redirect("/");
  if (user == null) return redirect("/onboarding");

  return;
};

export default AppLayout;
