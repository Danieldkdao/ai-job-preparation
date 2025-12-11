"use client"

import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { SignInButton, UserButton } from "@clerk/nextjs";
import { Suspense } from "react";

const HomePage = () => {
  return (
    <>
      <SignInButton />
    </>
  );
};

export default HomePage;
