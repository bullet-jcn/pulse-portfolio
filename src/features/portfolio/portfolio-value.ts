import { formatUnits } from "viem";
import type { PortfolioToken } from "@/lib/alchemy-portfolio";
import type { AssetPrice, AssetSymbol } from "./use-asset-prices";
import type { NativeBalanceResult } from "./use-native-balances";

export function calculateTotalValue(
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

export function formatUsd(value: number) {
  return value.toLocaleString(undefined, {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  });
}

const stablecoinSymbols = new Set(["USDC", "USDT", "DAI", "USDS", "FRAX", "LUSD", "GHO"]);

export function summarizeTokens(tokens: PortfolioToken[] | undefined) {
  if (!tokens) return undefined;

  return tokens.reduce(
    (summary, token) => {
      if (token.valueUsd === undefined) {
        summary.unpricedCount += 1;
        return summary;
      }

      summary.tokenValueUsd += token.valueUsd;
      summary.pricedCount += 1;

      if (stablecoinSymbols.has(token.symbol.toUpperCase())) {
        summary.stablecoinValueUsd += token.valueUsd;
      }

      return summary;
    },
    {
      tokenCount: tokens.length,
      pricedCount: 0,
      unpricedCount: 0,
      tokenValueUsd: 0,
      stablecoinValueUsd: 0,
    },
  );
}
