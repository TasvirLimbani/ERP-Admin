import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const company_id = searchParams.get('company_id')

    if (!company_id) {
      return NextResponse.json(
        { status: false, message: 'company_id is required' },
        { status: 400 }
      )
    }

    const res = await fetch(
      `http://dyeing.undo.it/api/admin/listmanager.php?company_id=${company_id}`,
      { cache: 'no-store' }
    )

    const data = await res.json()
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json(
      { status: false, message: 'Failed to fetch managers' },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    const isUpdate = !!body.manager_id

    const apiUrl = isUpdate
      ? 'http://dyeing.undo.it/api/admin/edit_manager.php'
      : 'http://dyeing.undo.it/api/admin/create_manager.php'

    const res = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })

    const data = await res.json()
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json(
      { status: false, message: 'Failed to save manager' },
      { status: 500 }
    )
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const manager_id = searchParams.get('manager_id')

    if (!manager_id) {
      return NextResponse.json(
        { status: false, message: 'manager_id is required' },
        { status: 400 }
      )
    }

    const res = await fetch(
      `http://dyeing.undo.it/api/admin/delete_manager.php?manager_id=${manager_id}`,
      { method: 'GET' }
    )

    const data = await res.json()
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json(
      { status: false, message: 'Failed to delete manager' },
      { status: 500 }
    )
  }
}