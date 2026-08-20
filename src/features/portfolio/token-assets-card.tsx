"use client";

import { LoaderCircle, RefreshCw } from "lucide-react";
import { useConnection } from "wagmi";
import { Card } from "@/components/ui/card";
import type { PortfolioToken } from "@/lib/alchemy-portfolio";
import { formatUsd, summarizeTokens } from "./portfolio-value";
import { TokenPortfolioError, useTokenPortfolio } from "./use-token-portfolio";

const networkLabels: Record<PortfolioToken["network"], string> = {
  "eth-mainnet": "Ethereum",
  "base-mainnet": "Base",
  "arb-mainnet": "Arbitrum",
  "polygon-mainnet": "Polygon",
};

export function TokenAssetsCard() {
  const connection = useConnection();
  const portfolio = useTokenPortfolio(connection.address);

  return (
    <Card className="overflow-hidden">
      <div className="border-b p-5">
        <h2 className="font-semibold">Token assets</h2>
        <p className="text-muted mt-1 text-xs">ERC-20 holdings across supported networks</p>
      </div>
      <TokenAssetsContent
        isConnected={connection.isConnected}
        isPending={portfolio.isPending}
        error={portfolio.error}
        tokens={portfolio.data?.tokens}
        onRetry={() => portfolio.refetch()}
      />
    </Card>
  );
}

function TokenAssetsContent({
  isConnected,
  isPending,
  error,
  tokens,
  onRetry,
}: {
  isConnected: boolean;
  isPending: boolean;
  error: Error | null;
  tokens: PortfolioToken[] | undefined;
  onRetry: () => void;
}) {
  if (!isConnected) {
    return <p className="text-muted p-5 text-sm">Connect a wallet to load ERC-20 assets.</p>;
  }

  if (isPending) {
    return (
      <p className="text-muted flex items-center gap-2 p-5 text-sm">
        <LoaderCircle className="animate-spin" size={16} /> Indexing token balances…
      </p>
    );
  }

  if (error instanceof TokenPortfolioError && error.code === "INDEXER_NOT_CONFIGURED") {
    return (
      <p className="m-5 rounded-xl bg-orange-300/[.06] p-4 text-sm text-orange-100">
        Token indexing needs an Alchemy API key. Native balances remain available.
      </p>
    );
  }

  if (error) {
    return (
      <div className="m-5 rounded-xl bg-red-300/[.06] p-4 text-sm text-red-200">
        <p>Token assets are temporarily unavailable.</p>
        <button
          className="mt-3 inline-flex items-center gap-2 text-xs font-semibold"
          onClick={onRetry}
        >
          <RefreshCw size={14} /> Retry
        </button>
      </div>
    );
  }

  if (!tokens?.length) {
    return (
      <p className="text-muted p-5 text-sm">No ERC-20 balances found on supported networks.</p>
    );
  }

  const visibleTokens = tokens.slice(0, 20);
  const summary = summarizeTokens(tokens);

  return (
    <div>
      <div className="text-muted flex flex-wrap items-center justify-between gap-2 border-b px-5 py-3 text-xs">
        <span>
          Showing {visibleTokens.length} of {tokens.length} assets
        </span>
        {summary && summary.unpricedCount > 0 && (
          <span>{summary.unpricedCount} unpriced assets excluded from totals</span>
        )}
      </div>
      <div className="divide-y divide-white/[.06]">
        {visibleTokens.map((token) => (
          <div
            key={`${token.network}:${token.contractAddress}`}
            className="grid grid-cols-[1fr_auto] items-center gap-3 p-4 sm:grid-cols-[1.2fr_1fr_1fr] sm:px-5"
          >
            <div className="flex min-w-0 items-center gap-3">
              <span className="bg-accent/10 text-accent grid size-10 shrink-0 place-items-center rounded-full text-xs font-bold">
                {token.symbol.slice(0, 1)}
              </span>
              <span className="min-w-0">
                <b className="block truncate text-sm">{token.symbol}</b>
                <small className="text-muted block truncate">
                  {token.name} · {networkLabels[token.network]}
                </small>
              </span>
            </div>
            <span className="text-muted hidden truncate text-sm sm:block">
              {formatTokenAmount(token.balance)} {token.symbol}
            </span>
            <span className="text-right text-sm font-medium">
              {token.valueUsd === undefined ? "Price unavailable" : formatUsd(token.valueUsd)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function formatTokenAmount(balance: string) {
  const value = Number(balance);

  if (!Number.isFinite(value)) return balance;

  return value.toLocaleString(undefined, { maximumFractionDigits: 5 });
}
