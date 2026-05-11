import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const company_id = searchParams.get("company_id");

    // ✅ Validation
    if (!company_id) {
      return NextResponse.json(
        { status: false, message: "company_id is required" },
        { status: 400 }
      );
    }

    // ✅ Call your PHP API
    const response = await fetch(
      `http://radheerp.soon.it/api/input_yarn/input_total.php?company_id=${company_id}`,
      {
        method: "GET",
        cache: "no-store",
      }
    );

    const data = await response.json();

    return NextResponse.json(data);
  } catch (error) {
    console.error("API Error:", error);

    return NextResponse.json(
      { status: false, message: "Server error" },
      { status: 500 }
    );
  }
}