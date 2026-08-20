import { formatUnits, isAddress } from "viem";

const ALCHEMY_NETWORKS = ["eth-mainnet", "base-mainnet", "arb-mainnet", "polygon-mainnet"] as const;
const MAX_PAGES = 5;

type AlchemyToken = {
  network?: unknown;
  tokenAddress?: unknown;
  tokenBalance?: unknown;
  tokenMetadata?: {
    decimals?: unknown;
    logo?: unknown;
    name?: unknown;
    symbol?: unknown;
  };
  tokenPrices?: Array<{
    currency?: unknown;
    value?: unknown;
    lastUpdatedAt?: unknown;
  }>;
};

type AlchemyResponse = {
  data?: {
    tokens?: AlchemyToken[];
    pageKey?: unknown;
  };
};

export type PortfolioToken = {
  network: (typeof ALCHEMY_NETWORKS)[number];
  contractAddress: string;
  name: string;
  symbol: string;
  logoUrl?: string;
  decimals: number;
  rawBalance: string;
  balance: string;
  priceUsd?: number;
  valueUsd?: number;
};

export async function getPortfolioTokens(address: string, apiKey: string) {
  if (!isAddress(address)) {
    throw new AlchemyPortfolioError("INVALID_ADDRESS", "Invalid wallet address", 400);
  }

  const tokens: PortfolioToken[] = [];
  let pageKey: string | undefined;

  for (let page = 0; page < MAX_PAGES; page += 1) {
    const response = await fetchAlchemyPage(address, apiKey, pageKey);
    const pageTokens = response.data?.tokens;

    if (!Array.isArray(pageTokens)) {
      throw new AlchemyPortfolioError("INVALID_RESPONSE", "Invalid indexer response", 502);
    }

    tokens.push(...pageTokens.flatMap(normalizeToken));
    pageKey = typeof response.data?.pageKey === "string" ? response.data.pageKey : undefined;

    if (!pageKey) break;
  }

  return tokens.sort((left, right) => (right.valueUsd ?? -1) - (left.valueUsd ?? -1));
}

async function fetchAlchemyPage(address: string, apiKey: string, pageKey?: string) {
  const url = `https://api.g.alchemy.com/data/v1/${apiKey}/assets/tokens/by-address`;
  const body = {
    addresses: [{ address, networks: ALCHEMY_NETWORKS }],
    withMetadata: true,
    withPrices: true,
    includeNativeTokens: false,
    includeErc20Tokens: true,
    ...(pageKey ? { pageKey } : {}),
  };

  for (let attempt = 0; attempt < 3; attempt += 1) {
    const response = await fetch(url, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
      cache: "no-store",
    });

    if (response.ok) {
      return (await response.json()) as AlchemyResponse;
    }

    if (response.status !== 429 && response.status < 500) {
      throw new AlchemyPortfolioError(
        "INDEXER_REJECTED",
        "Token indexer rejected the request",
        502,
      );
    }

    if (attempt < 2) {
      await wait(300 * 2 ** attempt);
    }
  }

  throw new AlchemyPortfolioError("INDEXER_UNAVAILABLE", "Token indexer unavailable", 502);
}

function normalizeToken(token: AlchemyToken): PortfolioToken[] {
  const metadata = token.tokenMetadata;
  const network = token.network;
  const contractAddress = token.tokenAddress;
  const rawBalance = token.tokenBalance;
  const decimals = metadata?.decimals;
  const symbol = metadata?.symbol;

  if (
    !ALCHEMY_NETWORKS.includes(network as (typeof ALCHEMY_NETWORKS)[number]) ||
    typeof contractAddress !== "string" ||
    typeof rawBalance !== "string" ||
    typeof decimals !== "number" ||
    typeof symbol !== "string"
  ) {
    return [];
  }

  let balanceValue: bigint;

  try {
    balanceValue = BigInt(rawBalance);
  } catch {
    return [];
  }

  if (balanceValue === BigInt(0)) return [];

  const balance = formatUnits(balanceValue, decimals);
  const usdPrice = token.tokenPrices?.find((price) => price.currency === "usd")?.value;
  const priceUsd = typeof usdPrice === "string" ? Number(usdPrice) : undefined;
  const validPrice = priceUsd !== undefined && Number.isFinite(priceUsd) ? priceUsd : undefined;

  return [
    {
      network: network as PortfolioToken["network"],
      contractAddress,
      name: typeof metadata?.name === "string" ? metadata.name : symbol,
      symbol,
      logoUrl: typeof metadata?.logo === "string" ? metadata.logo : undefined,
      decimals,
      rawBalance,
      balance,
      priceUsd: validPrice,
      valueUsd: validPrice === undefined ? undefined : Number(balance) * validPrice,
    },
  ];
}

function wait(milliseconds: number) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

export class AlchemyPortfolioError extends Error {
  constructor(
    readonly code: string,
    message: string,
    readonly status: number,
  ) {
    super(message);
  }
}
