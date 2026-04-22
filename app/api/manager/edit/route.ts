export async function POST(req: Request) {
  try {
    const body = await req.json()

    const API_URL =
      'http://radheerp.soon.it/api/admin/edit_manager.php'

    const res = await fetch(API_URL, {
      method: 'POST', // ✅ same as your backend
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        manager_id: body.manager_id,
        admin_id: body.admin_id,
        company_id: body.company_id,
        name: body.name,
        email: body.email,
        password: body.password,
        department: Array.isArray(body.department)
          ? body.department.join(',')
          : body.department,
      }),
    })

    const data = await res.json()

    return Response.json(data)
  } catch (error) {
    console.error(error)

    return Response.json(
      { status: false, message: 'Internal Server Error' },
      { status: 500 }
    )
  }
}