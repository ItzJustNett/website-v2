import { fetchWithAuth } from "./api"

/**
 * API client wrapper providing clean methods for HTTP requests
 */
export const api = {
  async get(endpoint: string) {
    return fetchWithAuth(endpoint, {
      method: "GET",
    })
  },

  async post(endpoint: string, data?: any) {
    return fetchWithAuth(endpoint, {
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
    })
  },

  async put(endpoint: string, data?: any) {
    return fetchWithAuth(endpoint, {
      method: "PUT",
      body: data ? JSON.stringify(data) : undefined,
    })
  },

  async patch(endpoint: string, data?: any) {
    return fetchWithAuth(endpoint, {
      method: "PATCH",
      body: data ? JSON.stringify(data) : undefined,
    })
  },

  async delete(endpoint: string) {
    return fetchWithAuth(endpoint, {
      method: "DELETE",
    })
  },
}
