import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const body = await req.json()

    const res = await fetch("http://dyeing.undo.it/api/auth/login.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
      cache: "no-store",
    })

    const data = await res.json()

    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({
      status: false,
      message: "Login failed",
    })
  }
}