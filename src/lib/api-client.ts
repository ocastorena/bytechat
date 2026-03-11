/**
 * Thin client for internal API calls.
 * Handles JSON serialization, response parsing, and error extraction.
 */

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public fieldErrors?: Record<string, string[]>
  ) {
    super(message)
    this.name = "ApiError"
  }
}

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, options)
  const data = await res.json()

  if (!res.ok) {
    throw new ApiError(
      data.error || "An unexpected error occurred",
      res.status,
      data.fieldErrors
    )
  }

  return data as T
}

function postJson<T>(url: string, body: unknown): Promise<T> {
  return request<T>(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  })
}

function del<T>(url: string): Promise<T> {
  return request<T>(url, { method: "DELETE" })
}

export const apiClient = {
  posts: {
    create: (content: string) =>
      postJson<{ id: string }>("/api/posts", { content }),
    delete: (postId: string) =>
      del<{ message: string }>(`/api/posts/${postId}`),
  },
  auth: {
    signup: (data: { email: string; username: string; password: string; confirmPassword: string }) =>
      postJson<{ message: string }>("/api/signup", data),
  },
}
