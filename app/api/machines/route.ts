import { NextRequest, NextResponse } from 'next/server'

// ✅ GET: List Machines
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const company_id = searchParams.get('company_id') || '1'

    const API_URL = `http://radheerp.soon.it/api/machines/list.php?company_id=${company_id}`

    const res = await fetch(API_URL, {
      method: 'GET',
      cache: 'no-store',
    })

    if (!res.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch machines' },
        { status: res.status }
      )
    }

    const data = await res.json()

    return NextResponse.json(data)
  } catch (error) {
    console.error('Machines GET Error:', error)

    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}

// ✅ POST: Add Machine
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    const { company_id, machine_number, machine_type, status } = body

    const API_URL = 'http://radheerp.soon.it/api/machines/add.php'

    const res = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        company_id,
        machine_number,
        machine_type,
        status: status || 'active',
      }),
    })

    const data = await res.json()

    return NextResponse.json(data)
  } catch (error) {
    console.error('Machines POST Error:', error)

    return NextResponse.json(
      { status: false, message: 'Internal Server Error' },
      { status: 500 }
    )
  }
}