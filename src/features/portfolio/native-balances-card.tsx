"use client";

import { formatUnits } from "viem";
import { useConnection } from "wagmi";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useAssetPrices, type AssetPrice, type AssetSymbol } from "./use-asset-prices";
import { useNativeBalances, type NativeBalanceResult } from "./use-native-balances";

export function NativeBalancesCard() {
  const connection = useConnection();
  const balances = useNativeBalances(connection.address);
  const prices = useAssetPrices(connection.isConnected);
  const totalValue = calculateTotalValue(balances, prices.data?.prices);
  const hasIncompleteData = balances.some((result) => result.status === "error") || prices.isError;

  return (
    <Card className="overflow-hidden">
      <div className="flex items-start justify-between gap-4 border-b p-5">
        <div>
          <h2 className="font-semibold">Native balances</h2>
          <p className="text-muted mt-1 text-xs">Live balances across Pulse networks</p>
        </div>
        {connection.isConnected && (
          <div className="text-right">
            <p className="text-muted text-xs">
              {hasIncompleteData ? "Partial estimate" : "Native asset value"}
            </p>
            <p className="mt-1 font-semibold">
              {totalValue === undefined ? "Loading…" : formatUsd(totalValue)}
            </p>
          </div>
        )}
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
              {result.status === "success" && result.balance && (
                <PriceValue
                  balance={result.balance}
                  price={prices.data?.prices[result.balance.symbol as AssetSymbol]}
                  isPriceError={prices.isError}
                />
              )}
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}

function PriceValue({
  balance,
  price,
  isPriceError,
}: {
  balance: NonNullable<NativeBalanceResult["balance"]>;
  price: AssetPrice | undefined;
  isPriceError: boolean;
}) {
  if (isPriceError) {
    return <p className="mt-1 text-xs text-red-300">Price unavailable</p>;
  }

  if (!price) {
    return <p className="text-muted mt-1 text-xs">Loading price…</p>;
  }

  const amount = Number(formatUnits(balance.value, balance.decimals));

  return (
    <p className="text-muted mt-1 text-xs">
      {formatUsd(amount * price.usd)}
      <span className={cn("ml-2", price.change24h >= 0 ? "text-accent" : "text-red-300")}>
        {price.change24h >= 0 ? "+" : ""}
        {price.change24h.toFixed(2)}%
      </span>
    </p>
  );
}

function calculateTotalValue(
  balances: NativeBalanceResult[],
  prices: Partial<Record<AssetSymbol, AssetPrice>> | undefined,
) {
  if (!prices || balances.some((result) => result.status === "loading")) {
    return undefined;
  }

  return balances.reduce((total, result) => {
    if (result.status !== "success" || !result.balance) return total;

    const price = prices[result.balance.symbol as AssetSymbol];
    if (!price) return total;

    const amount = Number(formatUnits(result.balance.value, result.balance.decimals));
    return total + amount * price.usd;
  }, 0);
}

function formatUsd(value: number) {
  return value.toLocaleString(undefined, {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  });
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
