import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const collection = searchParams.get("collection")

    if (!collection) {
      return NextResponse.json(
        { error: "Collection parameter is required" },
        { status: 400 }
      )
    }

    // In a real app, this would query a database
    // For now, we're using client-side localStorage
    return NextResponse.json({
      message: "Use client-side storage for this demo",
      collection,
    })
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { collection, data } = body

    if (!collection || !data) {
      return NextResponse.json(
        { error: "Collection and data are required" },
        { status: 400 }
      )
    }

    // In a real app, this would save to a database
    return NextResponse.json({
      success: true,
      message: "Data will be saved to localStorage on client",
      id: `${collection}_${Date.now()}`,
    })
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
