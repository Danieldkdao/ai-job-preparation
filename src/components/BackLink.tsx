import type { ReactNode } from "react";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { ArrowLeftIcon } from "lucide-react";

const BackLink = ({
  href,
  children,
  className,
}: {
  href: string;
  children: ReactNode;
  className?: string;
}) => {
  return (
    <Button
      asChild
      variant="ghost"
      size="sm"
      className={cn("-ml-3", className)}
    >
      <Link
        href={href}
        className="flex items-center gap-2 text-sm text-muted-foreground"
      >
        <ArrowLeftIcon className="size-4"/>
        {children}
      </Link>
    </Button>
  );
};

export default BackLink;
