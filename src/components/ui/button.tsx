import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Button({
  className,
  type = "button",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type={type}
      className={cn(
        "focus-visible:outline-accent inline-flex h-10 items-center justify-center rounded-xl border bg-white/5 px-4 text-sm font-medium transition hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-50",
        className,
      )}
      {...props}
    />
  );
}
