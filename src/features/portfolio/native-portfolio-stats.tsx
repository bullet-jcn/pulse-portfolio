"use client";

import { useConnection } from "wagmi";
import { StatCard } from "@/components/dashboard/stat-card";
import { calculateTotalValue, formatUsd } from "./portfolio-value";
import { useAssetPrices } from "./use-asset-prices";
import { useNativeBalances } from "./use-native-balances";

export function NativePortfolioStats() {
  const connection = useConnection();
  const balances = useNativeBalances(connection.address);
  const prices = useAssetPrices(connection.isConnected);
  const totalValue = calculateTotalValue(balances, prices.data?.prices);
  const successfulNetworks = balances.filter((result) => result.status === "success").length;
  const hasIncompleteData = balances.some((result) => result.status === "error") || prices.isError;

  const value = !connection.isConnected
    ? "Connect wallet"
    : totalValue === undefined
      ? "Loading…"
      : formatUsd(totalValue);
  const detail = !connection.isConnected
    ? "Load live balances and prices"
    : hasIncompleteData
      ? `Partial data · ${successfulNetworks} of ${balances.length} networks`
      : `Across ${successfulNetworks} supported networks`;

  return (
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard label="Native asset value" value={value} detail={detail} />
      <StatCard label="Token assets" value="Preview" detail="ERC-20 indexing is next" />
      <StatCard label="DeFi positions" value="Preview" detail="Protocol indexing not connected" />
      <StatCard label="Stablecoins" value="Preview" detail="Included after token indexing" />
    </section>
  );
}
