"use client";

import { formatUnits } from "viem";
import { useConnection } from "wagmi";
import { Card } from "@/components/ui/card";
import { useNativeBalances, type NativeBalanceResult } from "./use-native-balances";
import { cn } from "@/lib/utils";

export function NativeBalancesCard() {
  const connection = useConnection();
  const balances = useNativeBalances(connection.address);

  return (
    <Card className="overflow-hidden">
      <div className="border-b p-5">
        <h2 className="font-semibold">Native balances</h2>
        <p className="text-muted mt-1 text-xs">Live balances across Pulse networks</p>
      </div>

      {!connection.isConnected ? (
        <p className="text-muted p-5 text-sm">Connect a wallet to load your balances.</p>
      ) : (
        <div className="grid divide-y divide-white/[.06] sm:grid-cols-2 sm:divide-x sm:divide-y-0 xl:grid-cols-4">
          {balances.map((result) => (
            <div key={result.chain.id} className="p-5">
              <p className="text-muted text-xs">{result.chain.name}</p>
              <p
                className={cn(
                  "mt-2 text-lg font-semibold",
                  result.status === "error" && "text-red-300",
                )}
              >
                {formatNativeBalance(result)}
              </p>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}

function formatNativeBalance(result: NativeBalanceResult) {
  if (result.status === "loading") return "Loading…";
  if (result.status === "error") return "Unavailable";
  if (!result.balance) return "0";

  const amount = Number(formatUnits(result.balance.value, result.balance.decimals)).toLocaleString(
    undefined,
    { maximumFractionDigits: 5 },
  );

  return `${amount} ${result.balance.symbol}`;
}
