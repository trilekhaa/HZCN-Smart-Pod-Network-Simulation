import * as React from "react";
import { cn } from "@/lib/utils";

export function Select({
  className,
  children,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={cn(
        "h-10 w-full rounded-md border border-border bg-bg px-3 text-sm text-fg",
        "focus-visible:border-accent/50 focus-visible:outline-none",
        className,
      )}
      {...props}
    >
      {children}
    </select>
  );
}
