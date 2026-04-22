import { NextRequest, NextResponse } from "next/server";

// ==========================
// GET: Output TPM List
// ==========================
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const company_id = searchParams.get("company_id");
    const current_page = searchParams.get("current_page") || "1";

    // Validation
    if (!company_id) {
      return NextResponse.json(
        { status: false, message: "company_id is required" },
        { status: 400 }
      );
    }

    // External API
    const apiUrl = `http://radheerp.soon.it/api/output_tpm/output_list.php?company_id=${company_id}&current_page=${current_page}`;

    const response = await fetch(apiUrl, {
      method: "GET",
      cache: "no-store",
    });

    if (!response.ok) {
      return NextResponse.json(
        { status: false, message: "Failed to fetch output TPM list" },
        { status: response.status }
      );
    }

    const data = await response.json();

    return NextResponse.json(data, { status: 200 });

  } catch (error) {
    console.error("Output TPM LIST Error:", error);

    return NextResponse.json(
      { status: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// ==========================
// POST: Output TPM Add
// ==========================
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      company_id,
      admin_id,
      machine_no,
      batch_id,
      yarn_type,
      yarn_sub_type,
      tpm,
      input_weight,
      output_weight,
    } = body;

    // Validation
    if (
      !company_id ||
      !admin_id ||
      !machine_no ||
      !batch_id ||
      !yarn_type ||
      !yarn_sub_type ||
      !tpm ||
      !input_weight ||
      !output_weight
    ) {
      return NextResponse.json(
        { status: false, message: "All fields are required" },
        { status: 400 }
      );
    }

    // External API
    const apiUrl = "http://radheerp.soon.it/api/output_tpm/output_add.php";

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        company_id,
        admin_id,
        machine_no,
        batch_id,
        yarn_type,
        yarn_sub_type,
        tpm,
        input_weight,
        output_weight,
      }),
      cache: "no-store",
    });

    if (!response.ok) {
      return NextResponse.json(
        { status: false, message: "Failed to add output TPM" },
        { status: response.status }
      );
    }

    const data = await response.json();

    return NextResponse.json(data, { status: 200 });

  } catch (error) {
    console.error("Output TPM ADD Error:", error);

    return NextResponse.json(
      { status: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// ==========================
// PUT: Output TPM Update
// ==========================
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      id,
      company_id,
      admin_id,
      machine_no,
      batch_id,
      yarn_type,
      yarn_sub_type,
      tpm,
      input_weight,
      output_weight,
    } = body;

    // Validation
    if (
      !id ||
      !company_id ||
      !admin_id ||
      !machine_no ||
      !batch_id ||
      !yarn_type ||
      !yarn_sub_type ||
      !tpm ||
      !input_weight ||
      !output_weight
    ) {
      return NextResponse.json(
        { status: false, message: "All fields including id are required" },
        { status: 400 }
      );
    }

    const apiUrl = "http://radheerp.soon.it/api/output_tpm/output_update.php";

    const response = await fetch(apiUrl, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id,
        company_id,
        admin_id,
        machine_no,
        batch_id,
        yarn_type,
        yarn_sub_type,
        tpm,
        input_weight,
        output_weight,
      }),
      cache: "no-store",
    });

    if (!response.ok) {
      return NextResponse.json(
        { status: false, message: "Failed to update output TPM" },
        { status: response.status }
      );
    }

    const data = await response.json();

    return NextResponse.json(data, { status: 200 });

  } catch (error) {
    console.error("Output TPM UPDATE Error:", error);

    return NextResponse.json(
      { status: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// ==========================
// DELETE: Output TPM Delete
// ==========================
export async function DELETE(req: NextRequest) {
  try {
    const body = await req.json();

    const { id } = body;

    // Validation
    if (!id) {
      return NextResponse.json(
        { status: false, message: "id is required" },
        { status: 400 }
      );
    }

    const apiUrl = "http://radheerp.soon.it/api/output_tpm/output_delete.php";

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
        { status: false, message: "Failed to delete output TPM" },
        { status: response.status }
      );
    }

    const data = await response.json();

    return NextResponse.json(data, { status: 200 });

  } catch (error) {
    console.error("Output TPM DELETE Error:", error);

    return NextResponse.json(
      { status: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}