const API_BASE = "https://api.xoperr.dev/api"

export async function fetchWithAuth(
  endpoint: string,
  options: RequestInit = {}
) {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: {
      ...headers,
      ...(options.headers || {}),
    },
  })

  if (!response.ok) {
    if (response.status === 401) {
      if (typeof window !== "undefined") {
        localStorage.removeItem("token")
        localStorage.removeItem("username")
        localStorage.removeItem("user_id")
        window.location.href = "/login"
      }
    }

    const errorData = await response.json().catch(() => null)
    const msg = errorData?.detail || errorData?.message || response.statusText
    throw new Error(`API Error: ${msg}`)
  }

  return response.json()
}

