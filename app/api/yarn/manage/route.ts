import { NextRequest, NextResponse } from "next/server";

// ✏️ UPDATE Yarn (POST)
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Validate required fields
    const { id, supplier_name, batch_id, yarn_type, yarn_sub_type, weight } = body;

    if (!id || !supplier_name || !batch_id || !yarn_type || !yarn_sub_type || !weight) {
      return NextResponse.json(
        { status: false, message: "All fields are required (id, supplier_name, batch_id, yarn_type, yarn_sub_type, weight)" },
        { status: 400 }
      );
    }

    const payload = {
      id: String(id),
      supplier_name: String(supplier_name),
      batch_id: String(batch_id),
      yarn_type: String(yarn_type),
      yarn_sub_type: String(yarn_sub_type),
      weight: String(parseFloat(weight)),
    };

    console.log('Sending edit request with payload:', payload);

    const res = await fetch(
      "http://radheerp.soon.it/api/raw_yarn/update.php",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    );

    const contentType = res.headers.get('content-type');
    console.log('Response content-type:', contentType);
    
    let data;
    const textResponse = await res.text();
    console.log('Raw response:', textResponse);
    
    try {
      data = JSON.parse(textResponse);
    } catch (parseError) {
      console.error('Failed to parse response as JSON:', parseError);
      return NextResponse.json(
        { status: false, message: "Backend returned invalid response format", rawResponse: textResponse.substring(0, 200) },
        { status: 500 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Edit error:', error);
    return NextResponse.json(
      { status: false, message: "Failed to update yarn", error: String(error) },
      { status: 500 }
    );
  }
}

// 🗑 DELETE Yarn
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

    console.log('Deleting yarn with id:', id);

    const res = await fetch(
      `http://radheerp.soon.it/api/raw_yarn/delete.php?id=${id}`,
      {
        method: "GET",
      }
    );

    const contentType = res.headers.get('content-type');
    console.log('Delete response content-type:', contentType);
    
    let data;
    const textResponse = await res.text();
    console.log('Delete raw response:', textResponse);
    
    try {
      data = JSON.parse(textResponse);
    } catch (parseError) {
      console.error('Failed to parse delete response as JSON:', parseError);
      return NextResponse.json(
        { status: false, message: "Backend returned invalid response format", rawResponse: textResponse.substring(0, 200) },
        { status: 500 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Delete error:', error);
    return NextResponse.json(
      { status: false, message: "Failed to delete yarn", error: String(error) },
      { status: 500 }
    );
  }
}