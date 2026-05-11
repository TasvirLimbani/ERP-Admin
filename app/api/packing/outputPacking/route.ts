import { NextRequest, NextResponse } from "next/server";

// ==========================
// GET: Output Packing List
// ==========================
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const company_id = searchParams.get("company_id");
    const page = searchParams.get("page") || "1";

    if (!company_id) {
      return NextResponse.json(
        { status: false, message: "company_id is required" },
        { status: 400 }
      );
    }

    const apiUrl = `http://radheerp.soon.it/api/output_packing/output_get.php?company_id=${company_id}&page=${page}`;

    const response = await fetch(apiUrl, {
      method: "GET",
      cache: "no-store",
    });

    if (!response.ok) {
      return NextResponse.json(
        { status: false, message: "Failed to fetch output packing list" },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data, { status: 200 });

  } catch (error) {
    console.error("Output Packing LIST Error:", error);

    return NextResponse.json(
      { status: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// ==========================
// POST: Output Packing Add
// ==========================
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      company_id,
      machine_id,
      yarn_type,
      yarn_sub_type,
      color,
      category,
      cone_size,
      box,
    } = body;

    if (
      !company_id ||
      !machine_id ||
      !yarn_type ||
      !yarn_sub_type ||
      !color ||
      !category ||
      !cone_size ||
      box === undefined
    ) {
      return NextResponse.json(
        { status: false, message: "All fields are required" },
        { status: 400 }
      );
    }

    const apiUrl = `http://radheerp.soon.it/api/output_packing/output_add.php`;

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        company_id,
        machine_id,
        yarn_type,
        yarn_sub_type,
        color,
        category,
        cone_size,
        box,
      }),
      cache: "no-store",
    });

    if (!response.ok) {
      return NextResponse.json(
        { status: false, message: "Failed to add output packing" },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data, { status: 200 });

  } catch (error) {
    console.error("Output Packing ADD Error:", error);

    return NextResponse.json(
      { status: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// ==========================
// PUT: Output Packing Update
// ==========================
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      id,
      company_id,
      machine_id,
      yarn_type,
      yarn_sub_type,
      color,
      category,
      cone_size,
      box,
    } = body;

    if (
      !id ||
      !company_id ||
      !color ||
      !category ||
      !cone_size ||
      box === undefined
    ) {
      return NextResponse.json(
        { status: false, message: "All fields including id are required" },
        { status: 400 }
      );
    }

    const apiUrl = `http://radheerp.soon.it/api/output_packing/output_update.php`;

    const forwardBody: any = {
      id,
      company_id,
      ...(machine_id ? { machine_id } : {}),
      ...(yarn_type ? { yarn_type } : {}),
      ...(yarn_sub_type ? { yarn_sub_type } : {}),
      color,
      category,
      cone_size,
      box,
    };

    const response = await fetch(apiUrl, {
      method: "PUT", // change to POST if backend doesn't support PUT
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(forwardBody),
      cache: "no-store",
    });

    if (!response.ok) {
      return NextResponse.json(
        { status: false, message: "Failed to update output packing" },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data, { status: 200 });

  } catch (error) {
    console.error("Output Packing UPDATE Error:", error);

    return NextResponse.json(
      { status: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// ==========================
// DELETE: Output Packing Delete
// ==========================
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { status: false, message: "id is required" },
        { status: 400 }
      );
    }

    const apiUrl = `http://radheerp.soon.it/api/output_packing/output_delete.php?id=${id}`;

    const response = await fetch(apiUrl, {
      method: "DELETE", // change to GET if needed
      cache: "no-store",
    });

    if (!response.ok) {
      return NextResponse.json(
        { status: false, message: "Failed to delete output packing" },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data, { status: 200 });

  } catch (error) {
    console.error("Output Packing DELETE Error:", error);

    return NextResponse.json(
      { status: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}