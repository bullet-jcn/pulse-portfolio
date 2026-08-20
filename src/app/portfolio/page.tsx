import { ArrowDownLeft, ArrowUpRight, MoreHorizontal } from "lucide-react";
import { Card } from "@/components/ui/card";
import { NativeBalancesCard } from "@/features/portfolio/native-balances-card";
import { NativePortfolioStats } from "@/features/portfolio/native-portfolio-stats";

const assets = [
  {
    symbol: "ETH",
    name: "Ethereum",
    amount: "3.42 ETH",
    value: "$10,284.18",
    change: "+3.8%",
    color: "#6687ff",
  },
  {
    symbol: "USDC",
    name: "USD Coin",
    amount: "5,200 USDC",
    value: "$5,200.00",
    change: "+0.0%",
    color: "#4d9fea",
  },
  {
    symbol: "ARB",
    name: "Arbitrum",
    amount: "2,840 ARB",
    value: "$2,556.00",
    change: "+1.7%",
    color: "#56b4e9",
  },
];

export default function PortfolioPage() {
  return (
    <div className="space-y-7">
      <section className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-muted text-sm">Good morning</p>
          <h1 className="mt-1 text-3xl font-semibold tracking-[-.03em] sm:text-4xl">
            Your portfolio
          </h1>
        </div>
        <p className="text-muted text-sm">Live wallet data · Preview modules are labeled</p>
      </section>
      <NativePortfolioStats />
      <NativeBalancesCard />
      <section className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
        <Card className="overflow-hidden">
          <div className="flex items-center justify-between border-b p-5">
            <div>
              <h2 className="font-semibold">Assets</h2>
              <p className="text-muted mt-1 text-xs">Holdings across supported networks</p>
            </div>
            <button aria-label="Asset options" className="text-muted">
              <MoreHorizontal />
            </button>
          </div>
          <div className="divide-y divide-white/[.06]">
            {assets.map((a) => (
              <div
                key={a.symbol}
                className="grid grid-cols-[1fr_auto] items-center gap-3 p-4 sm:grid-cols-[1.2fr_1fr_1fr_auto] sm:px-5"
              >
                <div className="flex items-center gap-3">
                  <span
                    style={{ background: a.color }}
                    className="grid size-10 place-items-center rounded-full text-xs font-bold"
                  >
                    {a.symbol[0]}
                  </span>
                  <span>
                    <b className="block text-sm">{a.symbol}</b>
                    <small className="text-muted">{a.name}</small>
                  </span>
                </div>
                <span className="text-muted hidden text-sm sm:block">{a.amount}</span>
                <span className="text-right text-sm font-medium">{a.value}</span>
                <span className="text-accent hidden text-xs sm:block">{a.change}</span>
              </div>
            ))}
          </div>
        </Card>
        <Card className="p-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-semibold">Allocation</h2>
              <p className="text-muted mt-1 text-xs">By network</p>
            </div>
            <span className="text-muted text-xs">USD</span>
          </div>
          <div
            className="mx-auto my-8 grid size-48 place-items-center rounded-full"
            style={{
              background:
                "conic-gradient(#78f0c8 0 47%, #6687ff 47% 72%, #56b4e9 72% 91%, #2e3644 91%)",
            }}
          >
            <div className="grid size-32 place-items-center rounded-full bg-[#10151d] text-center">
              <span>
                <b className="block text-lg">4</b>
                <small className="text-muted">networks</small>
              </span>
            </div>
          </div>
          <div className="text-muted grid grid-cols-2 gap-3 text-xs">
            <span>● Ethereum 47%</span>
            <span>● Base 25%</span>
            <span>● Arbitrum 19%</span>
            <span>● Others 9%</span>
          </div>
        </Card>
      </section>
      <Card className="p-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-semibold">Recent activity</h2>
            <p className="text-muted mt-1 text-xs">Latest wallet events</p>
          </div>
          <a href="/activity" className="text-accent text-sm">
            View all
          </a>
        </div>
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <div className="flex items-center gap-3 rounded-xl bg-white/[.025] p-4">
            <span className="bg-accent/10 text-accent rounded-full p-2">
              <ArrowDownLeft size={18} />
            </span>
            <span className="text-sm">
              <b className="block">Received 500 USDC</b>
              <small className="text-muted">Ethereum · 24 min ago</small>
            </span>
            <b className="ml-auto text-sm">+$500.00</b>
          </div>
          <div className="flex items-center gap-3 rounded-xl bg-white/[.025] p-4">
            <span className="rounded-full bg-orange-300/10 p-2 text-orange-300">
              <ArrowUpRight size={18} />
            </span>
            <span className="text-sm">
              <b className="block">Swapped ETH → USDC</b>
              <small className="text-muted">Base · 2 hours ago</small>
            </span>
            <b className="ml-auto text-sm">$1,720.00</b>
          </div>
        </div>
      </Card>
    </div>
  );
}
