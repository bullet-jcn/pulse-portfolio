import { formatUnits } from "viem";
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
