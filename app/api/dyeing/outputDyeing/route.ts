import { NextRequest, NextResponse } from "next/server";

// ==========================
// GET: Output Dyeing List
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

    const apiUrl = `http://radheerp.soon.it/api/output_dyeing/output_get.php?company_id=${company_id}&current_page=${current_page}`;

    const response = await fetch(apiUrl, {
      method: "GET",
      cache: "no-store",
    });

    if (!response.ok) {
      return NextResponse.json(
        { status: false, message: "Failed to fetch output dyeing list" },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data, { status: 200 });

  } catch (error) {
    console.error("Output Dyeing LIST Error:", error);

    return NextResponse.json(
      { status: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// ==========================
// POST: Output Dyeing Add
// ==========================
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      company_id,
      admin_id,
      machine_id,
      batch_id,
      yarn_type,
      yarn_sub_type,
      color,
      input_weight,
      status,
      category,
      output_weight,
    } = body;

    // Required fields for creating an output record
    if (
      !company_id ||
      !admin_id ||
      !machine_id ||
      !batch_id ||
      !yarn_type ||
      !yarn_sub_type ||
      !color ||
      !input_weight ||
      !status
    ) {
      return NextResponse.json(
        { status: false, message: "All fields are required" },
        { status: 400 }
      );
    }

    const apiUrl = "http://radheerp.soon.it/api/output_dyeing/output_add.php";

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      // include optional fields only when provided
      body: JSON.stringify({
        company_id,
        admin_id,
        machine_id,
        batch_id,
        yarn_type,
        yarn_sub_type,
        color,
        input_weight,
        status,
        ...(category ? { category } : {}),
        ...(output_weight ? { output_weight } : {}),
      }),
      cache: "no-store",
    });

    if (!response.ok) {
      return NextResponse.json(
        { status: false, message: "Failed to add output dyeing" },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data, { status: 200 });

  } catch (error) {
    console.error("Output Dyeing ADD Error:", error);

    return NextResponse.json(
      { status: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// ==========================
// PUT: Output Dyeing Update
// ==========================
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      id,
      company_id,
      admin_id,
      machine_id,
      batch_id,
      yarn_type,
      yarn_sub_type,
      color,
      input_weight,
      output_weight,
      status,
      category,
    } = body;

    // Require id, company_id and admin_id plus core editable fields
    if (!id || !company_id || !admin_id || !color || !input_weight || !status) {
      return NextResponse.json(
        { status: false, message: "All fields including id are required" },
        { status: 400 }
      );
    }

    const apiUrl = "http://radheerp.soon.it/api/output_dyeing/output_update.php";

    // Forward id and other fields; include optional ones only when present
    const forwardBody: any = {
      id,
      company_id,
      admin_id,
      ...(machine_id ? { machine_id } : {}),
      ...(batch_id ? { batch_id } : {}),
      ...(yarn_type ? { yarn_type } : {}),
      ...(yarn_sub_type ? { yarn_sub_type } : {}),
      color,
      input_weight,
      status,
      category: category ?? '',
      output_weight: output_weight ?? '',
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
        { status: false, message: "Failed to update output dyeing" },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data, { status: 200 });

  } catch (error) {
    console.error("Output Dyeing UPDATE Error:", error);

    return NextResponse.json(
      { status: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// ==========================
// DELETE: Output Dyeing Delete
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

    const apiUrl = `http://radheerp.soon.it/api/output_dyeing/output_delete.php?id=${encodeURIComponent(String(id))}`;

    const response = await fetch(apiUrl, {
      method: "GET",
      cache: "no-store",
    });

    if (!response.ok) {
      return NextResponse.json(
        { status: false, message: "Failed to delete output dyeing" },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data, { status: 200 });

  } catch (error) {
    console.error("Output Dyeing DELETE Error:", error);

    return NextResponse.json(
      { status: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}