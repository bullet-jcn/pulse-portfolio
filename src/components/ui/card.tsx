import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "bg-card rounded-2xl border shadow-[0_18px_60px_rgba(0,0,0,.16)] backdrop-blur",
        className,
      )}
      {...props}
    />
  );
}
