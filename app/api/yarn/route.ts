import { NextRequest, NextResponse } from "next/server";

// ✅ GET: Fetch Yarn List
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const company_id = searchParams.get("company_id");
    const current_page = searchParams.get("current_page") || "1";

    if (!company_id) {
      return NextResponse.json(
        { status: false, message: "company_id is required" },
        { status: 400 }
      );
    }

    const res = await fetch(
      `http://radheerp.soon.it/api/raw_yarn/list.php?company_id=${company_id}&current_page=${current_page}`,
      {
        method: "GET",
        cache: "no-store",
      }
    );

    const data = await res.json();

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { status: false, message: "Failed to fetch yarn data" },
      { status: 500 }
    );
  }
}

// ✅ POST: Add Yarn
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Validate required fields
    const { company_id, admin_id, supplier_name, batch_id, yarn_type, yarn_sub_type, weight } = body;

    if (!company_id || !admin_id || !supplier_name || !batch_id || !yarn_type || !yarn_sub_type || !weight) {
      return NextResponse.json(
        { status: false, message: "All fields are required" },
        { status: 400 }
      );
    }

    const payload = {
      company_id,
      admin_id,
      supplier_name,
      batch_id,
      yarn_type,
      yarn_sub_type,
      weight,
    };

    const res = await fetch(
      "http://radheerp.soon.it/api/raw_yarn/add.php",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    );

    const data = await res.json();

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { status: false, message: "Failed to add yarn" },
      { status: 500 }
    );
  }
}