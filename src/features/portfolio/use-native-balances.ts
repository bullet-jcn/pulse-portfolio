"use client";

import { useQueries } from "@tanstack/react-query";
import type { Address } from "viem";
import { getBalanceQueryOptions } from "wagmi/query";
import { supportedChains, wagmiConfig } from "@/config/wagmi";

export type NativeBalanceStatus = "loading" | "success" | "error";

export type NativeBalanceResult = {
  chain: (typeof supportedChains)[number];
  status: NativeBalanceStatus;
  balance?: {
    decimals: number;
    symbol: string;
    value: bigint;
  };
  error?: Error;
};

export function useNativeBalances(address: Address | undefined): NativeBalanceResult[] {
  const queries = useQueries({
    queries: supportedChains.map((chain) => ({
      ...getBalanceQueryOptions(wagmiConfig, {
        address,
        chainId: chain.id,
      }),
      enabled: Boolean(address),
    })),
  });

  return supportedChains.map((chain, index) => {
    const query = queries[index];

    if (query.isPending) {
      return { chain, status: "loading" };
    }

    if (query.isError) {
      return { chain, status: "error", error: query.error };
    }

    return { chain, status: "success", balance: query.data };
  });
}
