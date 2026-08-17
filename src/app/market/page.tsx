import type { Metadata } from "next";
import { Card } from "@/components/ui/card";
export const metadata: Metadata = { title: "Market" };
const rows = [
  ["Bitcoin", "BTC", "$67,842.20", "+2.4%"],
  ["Ethereum", "ETH", "$3,007.90", "+3.8%"],
  ["USD Coin", "USDC", "$1.00", "0.0%"],
  ["Arbitrum", "ARB", "$0.90", "+1.7%"],
];
export default function MarketPage() {
  return (
    <div className="space-y-7">
      <div>
        <p className="text-muted text-sm">Price discovery</p>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight">Market</h1>
      </div>
      <Card className="overflow-hidden">
        <div className="text-muted grid grid-cols-[1fr_auto_auto] gap-4 border-b p-5 text-xs tracking-wider uppercase">
          <span>Asset</span>
          <span>Price</span>
          <span>24h</span>
        </div>
        {rows.map(([name, symbol, price, change]) => (
          <div
            key={symbol}
            className="grid grid-cols-[1fr_auto_auto] items-center gap-5 border-b p-5 last:border-0"
          >
            <span>
              <b className="block text-sm">{name}</b>
              <small className="text-muted">{symbol}</small>
            </span>
            <b className="text-sm">{price}</b>
            <span className="text-accent w-14 text-right text-xs">{change}</span>
          </div>
        ))}
      </Card>
      <p className="text-muted text-xs">
        Preview market data. A real price provider will be integrated in a later node.
      </p>
    </div>
  );
}
