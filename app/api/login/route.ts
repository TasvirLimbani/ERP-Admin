import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const response = await fetch("http://dyeing.undo.it/api/auth/login.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email: body.email,
        password: body.password
      })
    });

    const data = await response.json();

    // If login failed (invalid email/password)
    if (!data.status) {
      return NextResponse.json({
        status: false,
        message: data.message || "Invalid email or password"
      }, { status: 401 });
    }

    // If user is not admin
    if (data.role !== "admin") {
      return NextResponse.json({
        status: false,
        message: "Access denied. Only admin users can login."
      }, { status: 403 });
    }

    // User is admin, allow login
    return NextResponse.json(data);

  } catch (error) {
    return NextResponse.json({
      status: "error",
      message: "Server error"
    });
  }
}