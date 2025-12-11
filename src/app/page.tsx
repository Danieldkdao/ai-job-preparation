import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { PricingTable } from "@/services/clerk/components/PricingTable";
import { SignInButton, UserButton } from "@clerk/nextjs";
import { Suspense } from "react";

const HomePage = () => {
  return (
    <div className="p-4">
      <PricingTable />
    </div>
    
  );
};

export default HomePage;
