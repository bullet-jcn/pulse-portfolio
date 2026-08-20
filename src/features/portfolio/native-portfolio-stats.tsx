"use client";

import { useConnection } from "wagmi";
import { StatCard } from "@/components/dashboard/stat-card";
import { calculateTotalValue, formatUsd, summarizeTokens } from "./portfolio-value";
import { useAssetPrices } from "./use-asset-prices";
import { useNativeBalances } from "./use-native-balances";
import { useTokenPortfolio } from "./use-token-portfolio";

export function NativePortfolioStats() {
  const connection = useConnection();
  const balances = useNativeBalances(connection.address);
  const prices = useAssetPrices(connection.isConnected);
  const nativeValue = calculateTotalValue(balances, prices.data?.prices);
  const tokenPortfolio = useTokenPortfolio(connection.address);
  const tokenSummary = summarizeTokens(tokenPortfolio.data?.tokens);
  const trackedValue =
    nativeValue === undefined || tokenSummary === undefined
      ? undefined
      : nativeValue + tokenSummary.tokenValueUsd;
  const successfulNetworks = balances.filter((result) => result.status === "success").length;
  const hasIncompleteData =
    balances.some((result) => result.status === "error") ||
    prices.isError ||
    tokenPortfolio.isError ||
    Boolean(tokenSummary?.unpricedCount);

  const value = !connection.isConnected
    ? "Connect wallet"
    : trackedValue === undefined
      ? "Loading…"
      : formatUsd(trackedValue);
  const detail = !connection.isConnected
    ? "Load live balances and prices"
    : hasIncompleteData
      ? "Partial estimate · unpriced assets excluded"
      : `Across ${successfulNetworks} supported networks`;

  return (
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard label="Tracked portfolio" value={value} detail={detail} />
      <StatCard
        label="Token assets"
        value={
          tokenSummary
            ? formatUsd(tokenSummary.tokenValueUsd)
            : connection.isConnected
              ? "Loading…"
              : "—"
        }
        detail={
          tokenSummary
            ? `${tokenSummary.tokenCount} ERC-20 · ${tokenSummary.unpricedCount} unpriced`
            : "Connect wallet to index tokens"
        }
      />
      <StatCard label="DeFi positions" value="Preview" detail="Protocol indexing not connected" />
      <StatCard
        label="Stablecoins"
        value={
          tokenSummary
            ? formatUsd(tokenSummary.stablecoinValueUsd)
            : connection.isConnected
              ? "Loading…"
              : "—"
        }
        detail="Recognized stablecoin holdings"
      />
    </section>
  );
}
