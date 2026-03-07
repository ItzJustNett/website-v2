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
    throw new Error(`API Error: ${response.statusText}`)
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
