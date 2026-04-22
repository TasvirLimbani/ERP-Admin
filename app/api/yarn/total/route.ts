import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const company_id = searchParams.get("company_id");

    if (!company_id) {
      return NextResponse.json(
        { status: false, message: "company_id is required" },
        { status: 400 }
      );
    }

    // External API URL
    const apiUrl = `http://radheerp.soon.it/api/raw_yarn/totalyarn.php?company_id=${company_id}`;

    const response = await fetch(apiUrl, {
      method: "GET",
      cache: "no-store", // important for fresh data
    });

    if (!response.ok) {
      return NextResponse.json(
        { status: false, message: "Failed to fetch data" },
        { status: response.status }
      );
    }

    const data = await response.json();

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("GET Total Yarn Error:", error);

    return NextResponse.json(
      { status: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}