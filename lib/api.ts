const API_BASE = "https://api.xoperr.dev/api"

export async function fetchWithAuth(
  endpoint: string,
  options: RequestInit = {}
) {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null

  const headersObj: Record<string, string> = {
    "Content-Type": "application/json",
  }

  if (token) {
    headersObj.Authorization = `Bearer ${token}`
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: {
      ...headersObj,
      ...(options.headers || {}),
    },
  })

  if (!response.ok) {
    // For 401 errors, clear auth and redirect to login
    if (response.status === 401) {
      if (typeof window !== "undefined") {
        localStorage.removeItem("token")
        localStorage.removeItem("username")
        localStorage.removeItem("user_id")
        window.location.href = "/login"
      }
    }

    // Try to get detailed error message from response
    const errorData = await response.json().catch(() => null)
    const errorMessage = errorData?.detail || errorData?.message || response.statusText
    throw new Error(`API Error: ${errorMessage}`)
  }

  return response.json()
}

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    LOGOUT: "/auth/logout",
    ME: "/auth/me",
  },
  LESSONS: {
    LIST: "/lessons",
    DETAIL: (id: string) => `/lessons/${id}`,
    TEST: (id: string) => `/lessons/${id}/test`,
  },
  PROFILE: {
    ME: "/profiles/me",
  },
  DEBUG: {
    OVERVIEW: "/debug/overview",
  },
}
