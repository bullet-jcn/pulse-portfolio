"use client";

import { useQuery } from "@tanstack/react-query";
import type { Address } from "viem";
import type { PortfolioToken } from "@/lib/alchemy-portfolio";

type TokenPortfolioResponse = { tokens: PortfolioToken[] };

export function useTokenPortfolio(address: Address | undefined) {
  return useQuery({
    queryKey: ["portfolio", "tokens", address],
    queryFn: async (): Promise<TokenPortfolioResponse> => {
      const response = await fetch(`/api/portfolio/tokens?address=${address}`);

      if (!response.ok) {
        const body = (await response.json().catch(() => undefined)) as
          { code?: string; error?: string } | undefined;

        throw new TokenPortfolioError(
          body?.code ?? "TOKEN_REQUEST_FAILED",
          body?.error ?? "Token request failed",
        );
      }

      return response.json() as Promise<TokenPortfolioResponse>;
    },
    enabled: Boolean(address),
    staleTime: 30_000,
    retry: (failureCount, error) =>
      error instanceof TokenPortfolioError && error.code === "INDEXER_NOT_CONFIGURED"
        ? false
        : failureCount < 2,
  });
}

export class TokenPortfolioError extends Error {
  constructor(
    readonly code: string,
    message: string,
  ) {
    super(message);
  }
}
