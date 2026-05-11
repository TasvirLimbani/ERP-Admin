import { NextRequest, NextResponse } from "next/server";

// Replace this with your actual backend URL
const BASE_URL = "http://radheerp.soon.it/api/admin/dashboard.php";

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
    const response = await fetch(`${BASE_URL}?company_id=${company_id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store", // always fresh data
    });

    const data = await response.json();

    // ✅ Handle API errors
    if (!response.ok) {
      return NextResponse.json(
        { status: false, message: data?.message || "Failed to fetch dashboard" },
        { status: response.status }
      );
    }

    // Pass through backend payload shape directly.
    return NextResponse.json(data, { status: 200 });

  } catch (error: any) {
    console.error("Dashboard API Error:", error);

    return NextResponse.json(
      {
        status: false,
        message: "Internal server error",
        error: error.message,
      },
      { status: 500 }
    );
  }
}