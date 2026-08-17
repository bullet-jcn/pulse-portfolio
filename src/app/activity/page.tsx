import type { Metadata } from "next";
import { ArrowDownLeft, ArrowLeftRight, ArrowUpRight } from "lucide-react";
import { Card } from "@/components/ui/card";
export const metadata: Metadata = { title: "Activity" };
const events = [
  {
    icon: ArrowDownLeft,
    title: "Received 500 USDC",
    meta: "Ethereum · 0x72f...a913",
    time: "24 min ago",
    value: "+$500.00",
  },
  {
    icon: ArrowLeftRight,
    title: "Swapped 0.5 ETH → USDC",
    meta: "Base · 0xa43...3f10",
    time: "2 hours ago",
    value: "$1,720.00",
  },
  {
    icon: ArrowUpRight,
    title: "Sent 240 ARB",
    meta: "Arbitrum · 0xc32...911b",
    time: "Yesterday",
    value: "-$216.00",
  },
];
export default function ActivityPage() {
  return (
    <div className="space-y-7">
      <div>
        <p className="text-muted text-sm">Onchain history</p>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight">Activity</h1>
      </div>
      <Card className="divide-y divide-white/[.06]">
        {events.map(({ icon: Icon, title, meta, time, value }) => (
          <div key={title} className="flex items-center gap-3 p-4 sm:p-5">
            <span className="text-accent rounded-full bg-white/[.05] p-2.5">
              <Icon size={18} />
            </span>
            <span className="min-w-0">
              <b className="block truncate text-sm">{title}</b>
              <small className="text-muted block truncate">{meta}</small>
            </span>
            <span className="ml-auto text-right">
              <b className="block text-sm">{value}</b>
              <small className="text-muted">{time}</small>
            </span>
          </div>
        ))}
      </Card>
      <p className="text-muted text-xs">
        Preview transaction data. Wallet indexing is intentionally outside Foundation scope.
      </p>
    </div>
  );
}
