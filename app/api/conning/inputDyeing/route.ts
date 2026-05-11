import { NextRequest, NextResponse } from "next/server";

// ==========================
// GET: Input Dyeing List
// ==========================
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

    const apiUrl = `http://radheerp.soon.it/api/input_dyeing/input_get.php?company_id=${company_id}&current_page=${current_page}`;

    const response = await fetch(apiUrl, {
      method: "GET",
      cache: "no-store",
    });

    if (!response.ok) {
      return NextResponse.json(
        { status: false, message: "Failed to fetch input dyeing list" },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data, { status: 200 });

  } catch (error) {
    console.error("Input Dyeing LIST Error:", error);

    return NextResponse.json(
      { status: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// ==========================
// POST: Input Dyeing Add
// ==========================
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      company_id,
      yarn_type,
      yarn_sub_type,
      color,
      weight,
      category,
    } = body;

    if (
      !company_id ||
      !yarn_type ||
      !yarn_sub_type ||
      !color ||
      weight === undefined ||
      !category
    ) {
      return NextResponse.json(
        { status: false, message: "All fields are required" },
        { status: 400 }
      );
    }

    const apiUrl = "http://radheerp.soon.it/api/input_dyeing/input_add.php";

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        company_id,
        yarn_type,
        yarn_sub_type,
        color,
        weight,
        category,
      }),
      cache: "no-store",
    });

    if (!response.ok) {
      return NextResponse.json(
        { status: false, message: "Failed to add input dyeing" },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data, { status: 200 });

  } catch (error) {
    console.error("Input Dyeing ADD Error:", error);

    return NextResponse.json(
      { status: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// ==========================
// PUT: Input Dyeing Update
// ==========================
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      id,
      company_id,
      yarn_type,
      yarn_sub_type,
      color,
      weight,
      category,
    } = body;

    if (
      !id ||
      !company_id ||
      !color ||
      weight === undefined ||
      !category
    ) {
      return NextResponse.json(
        { status: false, message: "All fields including id are required" },
        { status: 400 }
      );
    }

    const apiUrl = "http://radheerp.soon.it/api/input_dyeing/input_update.php";

    const forwardBody: any = {
      id,
      company_id,
      ...(yarn_type ? { yarn_type } : {}),
      ...(yarn_sub_type ? { yarn_sub_type } : {}),
      color,
      weight,
      category,
    };

    const response = await fetch(apiUrl, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(forwardBody),
      cache: "no-store",
    });

    if (!response.ok) {
      return NextResponse.json(
        { status: false, message: "Failed to update input dyeing" },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data, { status: 200 });

  } catch (error) {
    console.error("Input Dyeing UPDATE Error:", error);

    return NextResponse.json(
      { status: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// ==========================
// DELETE: Input Dyeing Delete
// ==========================
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const body = await req.json().catch(() => ({}));
    const id = searchParams.get("id") || body?.id;

    if (!id) {
      return NextResponse.json(
        { status: false, message: "id is required" },
        { status: 400 }
      );
    }

    console.log("DELETE ID:", id);

    // ✅ SEND BODY (not query)
    const response = await fetch(
      "http://radheerp.soon.it/api/input_dyeing/input_delete.php",
      {
        method: "POST", // 🔥 important
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }), // 🔥 THIS is required
        cache: "no-store",
      }
    );

    if (!response.ok) {
      return NextResponse.json(
        { status: false, message: "Failed to delete input dyeing" },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data, { status: 200 });

  } catch (error) {
    console.error("Input Dyeing DELETE Error:", error);

    return NextResponse.json(
      { status: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}