"use client";

import { useState, type ReactNode } from "react";
import { AppHeader } from "@/components/layout/app-header";
import { AppSidebar } from "@/components/layout/app-sidebar";

export function AppShell({ children }: { children: ReactNode }) {
  const [isNavigationOpen, setIsNavigationOpen] = useState(false);

  function openNavigation() {
    setIsNavigationOpen(true);
  }

  function closeNavigation() {
    setIsNavigationOpen(false);
  }

  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[248px_1fr]">
      <AppSidebar isOpen={isNavigationOpen} onClose={closeNavigation} />

      <div className="min-w-0">
        <AppHeader onOpenNavigation={openNavigation} />
        <main className="mx-auto max-w-[1400px] p-4 sm:p-7 lg:p-9">{children}</main>
      </div>
    </div>
  );
}
