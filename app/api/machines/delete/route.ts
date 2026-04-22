import { NextRequest, NextResponse } from 'next/server'

// ✅ DELETE MACHINE
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { id } = body

    if (!id) {
      return NextResponse.json(
        { status: false, message: 'Machine ID is required' },
        { status: 400 }
      )
    }

    const API_URL = `http://radheerp.soon.it/api/machines/delete.php?id=${id}`

    const res = await fetch(API_URL, {
      method: 'POST', // PHP API requires POST
    })

    const data = await res.json()

    return NextResponse.json(data)

  } catch (error) {
    console.error('Delete Machine Error:', error)

    return NextResponse.json(
      { status: false, message: 'Internal Server Error' },
      { status: 500 }
    )
  }
}