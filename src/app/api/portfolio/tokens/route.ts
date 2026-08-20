import { NextRequest, NextResponse } from "next/server";
import { AlchemyPortfolioError, getPortfolioTokens } from "@/lib/alchemy-portfolio";

export async function GET(request: NextRequest) {
  const apiKey = process.env.ALCHEMY_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { code: "INDEXER_NOT_CONFIGURED", error: "Token indexing is not configured" },
      { status: 503 },
    );
  }

  try {
    const address = request.nextUrl.searchParams.get("address") ?? "";
    const tokens = await getPortfolioTokens(address, apiKey);

    return NextResponse.json(
      { tokens },
      { headers: { "Cache-Control": "private, max-age=30, stale-while-revalidate=60" } },
    );
  } catch (error) {
    if (error instanceof AlchemyPortfolioError) {
      return NextResponse.json(
        { code: error.code, error: error.message },
        { status: error.status },
      );
    }

    return NextResponse.json(
      { code: "INDEXER_UNAVAILABLE", error: "Token indexer unavailable" },
      { status: 502 },
    );
  }
}
