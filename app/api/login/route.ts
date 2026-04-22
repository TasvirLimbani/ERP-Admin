import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const response = await fetch("http://radheerp.soon.it/api/auth/login.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: body.email,
        password: body.password,
      }),
      cache: "no-store",
    });

    const data = await response.json();

    // Optional: handle error
    if (!response.ok || !data.status) {
      return NextResponse.json(
        { message: "Login failed", error: data },
        { status: 401 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { message: "Something went wrong", error },
      { status: 500 }
    );
  }
}