import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const company_id = searchParams.get("company_id") || "1";
    const current_page = searchParams.get("current_page") || "1";

    const apiUrl = `http://radheerp.soon.it/api/stock/get.php?company_id=${company_id}&current_page=${current_page}`;

    const res = await fetch(apiUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store", // optional (prevents caching)
    });

    const data = await res.json();

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      {
        status: false,
        message: "Failed to fetch stock data",
        error: (error as Error).message,
      },
      { status: 500 }
    );
  }
}