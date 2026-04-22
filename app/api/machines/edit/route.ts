import { NextRequest, NextResponse } from 'next/server'

// ✅ EDIT MACHINE
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    const { id, machine_number, machine_type, status } = body

    if (!id) {
      return NextResponse.json(
        { status: false, message: 'Machine ID is required' },
        { status: 400 }
      )
    }

    const API_URL = 'http://radheerp.soon.it/api/machines/edit.php'

    const res = await fetch(API_URL, {
      method: 'POST', // PHP API
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id,
        machine_number,
        machine_type,
        status,
      }),
    })

    const data = await res.json()

    return NextResponse.json(data)

  } catch (error) {
    console.error('Edit Machine Error:', error)

    return NextResponse.json(
      { status: false, message: 'Internal Server Error' },
      { status: 500 }
    )
  }
}