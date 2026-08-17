"use client";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
export default function ErrorPage({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="grid min-h-[60vh] place-items-center text-center">
      <div>
        <AlertTriangle className="mx-auto mb-5 text-orange-300" size={34} />
        <h1 className="text-2xl font-semibold">Something went wrong</h1>
        <p className="text-muted mx-auto mt-2 max-w-md text-sm">
          Pulse could not load this view. Your data is safe; try loading it again.
        </p>
        <Button className="mt-6" onClick={reset}>
          Try again
        </Button>
      </div>
    </div>
  );
}
