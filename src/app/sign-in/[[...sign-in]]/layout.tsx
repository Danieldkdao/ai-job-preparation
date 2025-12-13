import { Loader2Icon } from "lucide-react";
import { connection } from "next/server";
import { Suspense } from "react";

const SignInLayout = async ({
  children,
}: {
  children: React.ReactNode;
}) => {
  await connection();
  return (
    <Suspense
      fallback={
        <div className="flex h-screen w-screen items-center justify-center">
          <Loader2Icon className="size-24 animate-spin" />
        </div>
      }
    >
      {children}
    </Suspense>
  );
}

export default SignInLayout;
