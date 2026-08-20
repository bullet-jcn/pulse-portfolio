import { NextResponse } from "next/server";

const COINGECKO_URL = "https://api.coingecko.com/api/v3/simple/price";
const coinIds = ["ethereum", "polygon-ecosystem-token"] as const;

type CoinGeckoPrice = {
  usd?: unknown;
  usd_24h_change?: unknown;
  last_updated_at?: unknown;
};

type CoinGeckoResponse = Partial<Record<(typeof coinIds)[number], CoinGeckoPrice>>;

export async function GET() {
  const searchParams = new URLSearchParams({
    ids: coinIds.join(","),
    vs_currencies: "usd",
    include_24hr_change: "true",
    include_last_updated_at: "true",
  });
  const headers = new Headers({ accept: "application/json" });
  const apiKey = process.env.COINGECKO_API_KEY;

  if (apiKey) {
    headers.set("x-cg-demo-api-key", apiKey);
  }

  try {
    const response = await fetch(`${COINGECKO_URL}?${searchParams}`, {
      headers,
      next: { revalidate: 60 },
    });

    if (!response.ok) {
      return NextResponse.json({ error: "Price provider unavailable" }, { status: 502 });
    }

    const data = (await response.json()) as CoinGeckoResponse;
    const ethereum = parsePrice(data.ethereum);
    const polygon = parsePrice(data["polygon-ecosystem-token"]);

    if (!ethereum || !polygon) {
      return NextResponse.json({ error: "Invalid price provider response" }, { status: 502 });
    }

    return NextResponse.json(
      {
        prices: { ETH: ethereum, POL: polygon },
        updatedAt: Math.min(ethereum.updatedAt, polygon.updatedAt),
      },
      { headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300" } },
    );
  } catch {
    return NextResponse.json({ error: "Price provider unavailable" }, { status: 502 });
  }
}

function parsePrice(price: CoinGeckoPrice | undefined) {
  if (
    typeof price?.usd !== "number" ||
    typeof price.usd_24h_change !== "number" ||
    typeof price.last_updated_at !== "number"
  ) {
    return undefined;
  }

  return {
    usd: price.usd,
    change24h: price.usd_24h_change,
    updatedAt: price.last_updated_at,
  };
}
