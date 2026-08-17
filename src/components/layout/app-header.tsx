import { Menu, Search } from "lucide-react";

type AppHeaderProps = { onOpenNavigation: () => void };

export function AppHeader({ onOpenNavigation }: AppHeaderProps) {
  return (
    <header className="sticky top-0 z-20 flex h-16 items-center gap-4 border-b bg-[#080b10]/75 px-4 backdrop-blur-xl sm:px-7">
      <button className="p-2 lg:hidden" onClick={onOpenNavigation} aria-label="Open navigation">
        <Menu size={21} />
      </button>
      <div className="text-muted ml-auto hidden max-w-xs flex-1 items-center gap-2 rounded-xl border bg-white/[.025] px-3 sm:flex">
        <Search size={16} />
        <span className="py-2 text-sm">Search assets</span>
        <kbd className="ml-auto text-xs">⌘K</kbd>
      </div>
      <button className="bg-accent ml-auto rounded-xl px-4 py-2 text-sm font-semibold text-[#07110e] sm:ml-0">
        Connect wallet
      </button>
    </header>
  );
}
