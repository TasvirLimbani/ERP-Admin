import { NextRequest, NextResponse } from "next/server";

// ==========================
// GET: Input TPM List
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

    const apiUrl = `http://radheerp.soon.it/api/input_tpm/input_get.php?company_id=${company_id}&current_page=${current_page}`;

    const response = await fetch(apiUrl, {
      method: "GET",
      cache: "no-store",
    });

    if (!response.ok) {
      return NextResponse.json(
        { status: false, message: "Failed to fetch input TPM list" },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data, { status: 200 });

  } catch (error) {
    console.error("Input TPM LIST Error:", error);

    return NextResponse.json(
      { status: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// ==========================
// POST: Input TPM Add
// ==========================
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      company_id,
      admin_id,
      batch_id,
      tpm,
      yarn_type,
      yarn_sub_type,
      weight,
    } = body;

    if (
      !company_id ||
      !admin_id ||
      !batch_id ||
      !tpm ||
      !yarn_type ||
      !yarn_sub_type ||
      !weight
    ) {
      return NextResponse.json(
        { status: false, message: "All fields are required" },
        { status: 400 }
      );
    }

    const apiUrl = "http://radheerp.soon.it/api/input_tpm/input_add.php";

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        company_id,
        admin_id,
        batch_id,
        tpm,
        yarn_type,
        yarn_sub_type,
        weight,
      }),
      cache: "no-store",
    });

    if (!response.ok) {
      return NextResponse.json(
        { status: false, message: "Failed to add input TPM" },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data, { status: 200 });

  } catch (error) {
    console.error("Input TPM ADD Error:", error);

    return NextResponse.json(
      { status: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// ==========================
// PUT: Input TPM Update
// ==========================
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      id,
      company_id,
      admin_id,
      batch_id,
      tpm,
      yarn_type,
      yarn_sub_type,
      weight,
    } = body;

    if (
      !id ||
      !company_id ||
      !admin_id ||
      !batch_id ||
      !tpm ||
      !yarn_type ||
      !yarn_sub_type ||
      !weight
    ) {
      return NextResponse.json(
        { status: false, message: "All fields including id are required" },
        { status: 400 }
      );
    }

    const apiUrl = "http://radheerp.soon.it/api/input_tpm/input_update.php";

    const response = await fetch(apiUrl, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id,
        company_id,
        admin_id,
        batch_id,
        tpm,
        yarn_type,
        yarn_sub_type,
        weight,
      }),
      cache: "no-store",
    });

    if (!response.ok) {
      return NextResponse.json(
        { status: false, message: "Failed to update input TPM" },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data, { status: 200 });

  } catch (error) {
    console.error("Input TPM UPDATE Error:", error);

    return NextResponse.json(
      { status: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// ==========================
// DELETE: Input TPM Delete
// ==========================
export async function DELETE(req: NextRequest) {
  try {
    const body = await req.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json(
        { status: false, message: "id is required" },
        { status: 400 }
      );
    }

    const apiUrl = "http://radheerp.soon.it/api/input_tpm/input_delete.php";

    const response = await fetch(apiUrl, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id }),
      cache: "no-store",
    });

    if (!response.ok) {
      return NextResponse.json(
        { status: false, message: "Failed to delete input TPM" },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data, { status: 200 });

  } catch (error) {
    console.error("Input TPM DELETE Error:", error);

    return NextResponse.json(
      { status: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}