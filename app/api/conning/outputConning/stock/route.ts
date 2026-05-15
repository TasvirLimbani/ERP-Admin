import { NextRequest, NextResponse } from "next/server";

// ==========================
// GET: Total Input Dyeing
// ==========================
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

    // 👉 Call your backend API
    const response = await fetch(
      `http://radheerp.soon.it/api/input_dyeing/input_total.php?company_id=${company_id}`,
      {
        method: "GET",
        cache: "no-store", // always fresh data
      }
    );

    const data = await response.json();

    // ✅ Handle backend failure
    if (!response.ok) {
      return NextResponse.json(
        {
          status: false,
          message: data?.message || "Failed to fetch total dyeing data",
        },
        { status: response.status }
      );
    }

    // ✅ Success response (same structure)
    return NextResponse.json({
      status: true,
      message: data.message || "Total dyeing stock",
      data: data.data,
    });
  } catch (error: any) {
    console.error("GET TOTAL ERROR:", error);

    return NextResponse.json(
      {
        status: false,
        message: "Internal server error",
      },
      { status: 500 }
    );
  }
}