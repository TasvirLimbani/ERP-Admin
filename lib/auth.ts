// lib/auth.ts

export interface User {
  id: number
  email: string
  name: string
  role: string
}

const STORAGE_KEY = "auth_user"

// ✅ Save user
export function setUser(user: User): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(user))
}

export function getUserFromStorage() {
  if (typeof window === "undefined") return null

  const user = localStorage.getItem(STORAGE_KEY) // ✅ FIXED
  return user ? JSON.parse(user) : null
}
// ✅ Get user
export function getUser(): User | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : null
  } catch {
    return null
  }
}

// ✅ Check login
export function isAuthenticated(): boolean {
  const user = getUser()
  return !!user && user.role === "admin"
}

// ✅ Logout
export function logout(): void {
  localStorage.removeItem(STORAGE_KEY)
}

// ✅ REAL LOGIN (API)
export async function login(email: string, password: string): Promise<User> {
  const res = await fetch("/api/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  })

  const data = await res.json()

  if (!res.ok || data.status === false) {
    throw new Error(data.message || "Login failed")
  }

  const user: User = {
    id: data.user.id,
    email: data.user.email,
    name: data.user.name,
    role: data.role,
  }

  setUser(user)

  return user
}