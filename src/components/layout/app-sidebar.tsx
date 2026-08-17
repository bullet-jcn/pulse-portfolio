"use client";

import { Activity, BarChart3, LayoutDashboard, WalletCards, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const navigationItems = [
  { href: "/portfolio", label: "Portfolio", icon: LayoutDashboard },
  { href: "/market", label: "Market", icon: BarChart3 },
  { href: "/activity", label: "Activity", icon: Activity },
];

type AppSidebarProps = {
  isOpen: boolean;
  onClose: () => void;
};

export function AppSidebar({ isOpen, onClose }: AppSidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {isOpen && (
        <button
          className="fixed inset-0 z-30 bg-black/70 lg:hidden"
          aria-label="Close navigation"
          onClick={onClose}
        />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-[280px] border-r bg-[#0b0f16]/95 p-5 backdrop-blur-xl transition-transform lg:sticky lg:top-0 lg:h-screen lg:w-auto lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <SidebarBrand onNavigate={onClose} />
        <SidebarNavigation pathname={pathname} onNavigate={onClose} />
        <NetworkStatus />
      </aside>
    </>
  );
}

function SidebarBrand({ onNavigate }: { onNavigate: () => void }) {
  return (
    <div className="mb-10 flex items-center justify-between">
      <Link href="/portfolio" className="flex items-center gap-3" onClick={onNavigate}>
        <span className="bg-accent grid size-10 place-items-center rounded-xl text-[#07110e]">
          <WalletCards size={21} />
        </span>
        <span>
          <b className="block tracking-tight">Pulse</b>
          <span className="text-muted text-xs">Wallet intelligence</span>
        </span>
      </Link>

      <button className="p-2 lg:hidden" onClick={onNavigate} aria-label="Close navigation">
        <X size={20} />
      </button>
    </div>
  );
}

type SidebarNavigationProps = {
  pathname: string;
  onNavigate: () => void;
};

function SidebarNavigation({ pathname, onNavigate }: SidebarNavigationProps) {
  return (
    <nav className="space-y-2" aria-label="Primary navigation">
      {navigationItems.map(({ href, label, icon: Icon }) => {
        const isActive = pathname === href || pathname.startsWith(`${href}/`);

        return (
          <Link
            key={href}
            href={href}
            onClick={onNavigate}
            aria-current={isActive ? "page" : undefined}
            className={cn(
              "flex items-center gap-3 rounded-xl px-3 py-3 text-sm transition",
              isActive
                ? "bg-white/[.08] text-white"
                : "text-muted hover:bg-white/[.04] hover:text-white",
            )}
          >
            <Icon size={18} />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}

function NetworkStatus() {
  return (
    <div className="absolute inset-x-5 bottom-5 rounded-2xl border bg-white/[.025] p-4">
      <p className="text-muted text-xs tracking-[.18em] uppercase">Network status</p>
      <p className="mt-2 flex items-center gap-2 text-sm">
        <span className="bg-accent size-2 rounded-full shadow-[0_0_14px_var(--accent)]" />
        Foundation mode
      </p>
    </div>
  );
}
