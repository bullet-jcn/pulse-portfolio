"use client";

import { useQuery } from "@tanstack/react-query";

export type AssetSymbol = "ETH" | "POL";

export type AssetPrice = {
  usd: number;
  change24h: number;
  updatedAt: number;
};

type AssetPricesResponse = {
  prices: Record<AssetSymbol, AssetPrice>;
  updatedAt: number;
};

export function useAssetPrices(enabled: boolean) {
  return useQuery({
    queryKey: ["asset-prices", "native", "usd"],
    queryFn: async (): Promise<AssetPricesResponse> => {
      const response = await fetch("/api/prices");

      if (!response.ok) {
        throw new Error("Price request failed");
      }

      return response.json() as Promise<AssetPricesResponse>;
    },
    enabled,
    staleTime: 60_000,
  });
}
