import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const company_id = searchParams.get("company_id");
    const current_page = searchParams.get("current_page") || "1";

    // Validate required param
    if (!company_id) {
      return NextResponse.json(
        { status: false, message: "company_id is required" },
        { status: 400 }
      );
    }

    // External API URL
    const apiUrl = `http://radheerp.soon.it/api/input_yarn/input_get.php?company_id=${company_id}&current_page=${current_page}`;

    const response = await fetch(apiUrl, {
      method: "GET",
      cache: "no-store", // always fresh data
    });

    if (!response.ok) {
      return NextResponse.json(
        { status: false, message: "Failed to fetch input yarn data" },
        { status: response.status }
      );
    }

    const data = await response.json();

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("Input Yarn GET Error:", error);

    return NextResponse.json(
      { status: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const { company_id, batch_id, yarn_type, yarn_sub_type, weight } = body;

    // Basic validation
    if (!company_id || !batch_id || !yarn_type || !yarn_sub_type || !weight) {
      return NextResponse.json(
        { status: false, message: "All fields are required" },
        { status: 400 }
      );
    }

    // External API URL
    const apiUrl = "http://radheerp.soon.it/api/input_yarn/input_add.php";

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        company_id,
        batch_id,
        yarn_type,
        yarn_sub_type,
        weight,
      }),
      cache: "no-store",
    });

    if (!response.ok) {
      return NextResponse.json(
        { status: false, message: "Failed to add input yarn" },
        { status: response.status }
      );
    }

    const data = await response.json();

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("Input Yarn ADD Error:", error);

    return NextResponse.json(
      { status: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}


// ✅ UPDATE (PUT)
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      id,
      company_id,
      batch_id,
      yarn_type,
      yarn_sub_type,
      weight,
    } = body;

    // Validation
    if (!id) {
      return NextResponse.json(
        { status: false, message: "id is required" },
        { status: 400 }
      );
    }

    const apiUrl = "http://radheerp.soon.it/api/input_yarn/input_update.php";

    const response = await fetch(apiUrl, {
      method: "POST", // ⚠️ PHP API uses POST
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id,
        company_id,
        batch_id,
        yarn_type,
        yarn_sub_type,
        weight,
      }),
      cache: "no-store",
    });

    const data = await response.json();

    // Ensure status field is boolean
    const responseData = {
      ...data,
      status: data.status === true || data.status === 1 || (response.ok && data.status !== false)
    };

    return NextResponse.json(responseData, { status: response.ok ? 200 : response.status });
  } catch (error) {
    console.error("UPDATE Error:", error);

    return NextResponse.json(
      { status: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// ❌ DELETE
export async function DELETE(req: NextRequest) {
  try {
    let id: string | null = null;

    // 👉 Query param
    const { searchParams } = new URL(req.url);
    id = searchParams.get("id");

    // 👉 Fallback body
    if (!id) {
      const body = await req.json();
      id = body.id;
    }

    if (!id) {
      return NextResponse.json(
        { status: false, message: "id is required" },
        { status: 400 }
      );
    }

    const apiUrl = `http://radheerp.soon.it/api/input_yarn/input_delete.php?id=${id}`;

    const response = await fetch(apiUrl, {
      method: "DELETE", // ⚠️ if not working, change to "GET"
      cache: "no-store",
    });

    const data = await response.json();

    // Ensure status field is boolean
    const responseData = {
      ...data,
      status: data.status === true || data.status === 1 || (response.ok && data.status !== false)
    };

    return NextResponse.json(responseData, { status: response.ok ? 200 : response.status });
  } catch (error) {
    console.error("DELETE Error:", error);

    return NextResponse.json(
      { status: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}