import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { SignInButton, UserButton } from "@clerk/nextjs";

const HomePage = () => {
  return (
    <>
      <SignInButton />
      <UserButton />
      <ThemeToggle />
    </>
  );
};

export default HomePage;
