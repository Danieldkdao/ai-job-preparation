import { getCurrentUser } from "@/services/clerk/lib/getCurrentUser";
import { redirect } from "next/navigation";
import { Navbar } from "../_Navbar";
import type { ReactNode } from "react";

const AppLayoutContent = async ({ children }: { children: ReactNode }) => {
  const { userId, user } = await getCurrentUser({ allData: true });

  if (userId == null) return redirect("/");
  if (user == null) return redirect("/onboarding");

  return (
    <>
      <Navbar user={{ name: user?.name ?? "", imageUrl: user?.imageUrl ?? "" }} />
      {children}
    </>
  );
};

export default AppLayoutContent;
