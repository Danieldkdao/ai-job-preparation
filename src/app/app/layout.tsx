import { Suspense, type ReactNode } from "react";
import AppLayoutContent from "./_components/AppLayoutContent";

const AppLayout = async ({ children }: { children: ReactNode }) => {
  return (
    <Suspense>
      <AppLayoutContent children={children} />
    </Suspense>
  );
};

export default AppLayout;
