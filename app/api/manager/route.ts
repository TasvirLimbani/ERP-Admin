import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  try {
    // Get query param (optional dynamic support)
    const { searchParams } = new URL(req.url)
    const company_id = searchParams.get('company_id') || '1'

    const API_URL = `http://radheerp.soon.it/api/admin/listmanager.php?company_id=${company_id}`

    const res = await fetch(API_URL, {
      method: 'GET',
      cache: 'no-store', // important for fresh data
    })

    if (!res.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch manager list' },
        { status: res.status }
      )
    }

    const data = await res.json()

    return NextResponse.json(data)
  } catch (error) {
    console.error('Manager API Error:', error)

    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}

// ✅ CREATE MANAGER
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    const {
      admin_id,
      company_id,
      name,
      email,
      password,
      department,
    } = body

    const API_URL = 'http://radheerp.soon.it/api/admin/create_manager.php'

    const res = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        admin_id,
        company_id,
        name,
        email,
        password,
        // ⚠️ API expects comma-separated string
        department: Array.isArray(department)
          ? department.join(',')
          : department,
      }),
    })

    const data = await res.json()

    return NextResponse.json(data)
  } catch (error) {
    console.error('Create Manager Error:', error)

    return NextResponse.json(
      { status: false, message: 'Internal Server Error' },
      { status: 500 }
    )
  }
}