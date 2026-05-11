import { NextRequest, NextResponse } from "next/server";

// ==========================
// GET: Input Coning List
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

    const apiUrl = `http://radheerp.soon.it/api/input_coning/input_get.php?company_id=${company_id}&current_page=${current_page}`;

    const response = await fetch(apiUrl, {
      method: "GET",
      cache: "no-store",
    });

    if (!response.ok) {
      return NextResponse.json(
        { status: false, message: "Failed to fetch input coning list" },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data, { status: 200 });

  } catch (error) {
    console.error("Input Coning LIST Error:", error);

    return NextResponse.json(
      { status: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// ==========================
// POST: Input Coning Add
// ==========================
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      company_id,
      yarn_type,
      yarn_sub_type,
      color,
      category,
      cone_size,
      cones,
    } = body;

    if (
      !company_id ||
      !yarn_type ||
      !yarn_sub_type ||
      !color ||
      !category ||
      !cone_size ||
      cones === undefined
    ) {
      return NextResponse.json(
        { status: false, message: "All fields are required" },
        { status: 400 }
      );
    }

    const apiUrl = "http://radheerp.soon.it/api/input_coning/input_add.php";

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
        category,
        cone_size,
        cones,
      }),
      cache: "no-store",
    });

    if (!response.ok) {
      return NextResponse.json(
        { status: false, message: "Failed to add input coning" },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data, { status: 200 });

  } catch (error) {
    console.error("Input Coning ADD Error:", error);

    return NextResponse.json(
      { status: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// ==========================
// PUT: Input Coning Update
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
      category,
      cone_size,
      cones,
    } = body;

    if (
      !id ||
      !company_id ||
      !color ||
      !category ||
      !cone_size ||
      cones === undefined
    ) {
      return NextResponse.json(
        { status: false, message: "All fields including id are required" },
        { status: 400 }
      );
    }

    const apiUrl = "http://radheerp.soon.it/api/input_coning/input_update.php";

    const forwardBody: any = {
      id,
      company_id,
      ...(yarn_type ? { yarn_type } : {}),
      ...(yarn_sub_type ? { yarn_sub_type } : {}),
      color,
      category,
      cone_size,
      cones,
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
        { status: false, message: "Failed to update input coning" },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data, { status: 200 });

  } catch (error) {
    console.error("Input Coning UPDATE Error:", error);

    return NextResponse.json(
      { status: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// ==========================
// DELETE: Input Coning Delete
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

    console.log("DELETE ID:", id);

    const apiUrl = `http://radheerp.soon.it/api/input_coning/input_delete.php?id=${id}`;

    const response = await fetch(apiUrl, {
      method: "DELETE", // if backend supports DELETE
      cache: "no-store",
    });

    // ⚠️ If DELETE doesn't work, change method to GET or POST
    // method: "GET"

    if (!response.ok) {
      return NextResponse.json(
        { status: false, message: "Failed to delete input coning" },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data, { status: 200 });

  } catch (error) {
    console.error("Input Coning DELETE Error:", error);

    return NextResponse.json(
      { status: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}