"use client";

import dynamic from "next/dynamic";

const ClerkPricingTable = dynamic(
  () => import("@clerk/nextjs").then((mod) => mod.PricingTable),
  { ssr: false }
);

// import { PricingTable as ClerkPricingTable } from "@clerk/nextjs";

export const PricingTable = () => {
  return <ClerkPricingTable newSubscriptionRedirectUrl="/app" />;
};
