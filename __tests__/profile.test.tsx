import "@testing-library/jest-dom"
import { render, screen } from "@testing-library/react"
import prisma from "@/lib/prisma"

// ─────────────────────────────────────────────────────────────────────────────
// UI TESTS (Frontend) — Profile Page
//   - Render the profile page (Server Component) with mocked fetch + auth
// ─────────────────────────────────────────────────────────────────────────────

// Mock next/headers so the server-side fetch in the page can build a base URL and send cookies
jest.mock("next/headers", () => ({
  headers: () =>
    new Map([
      ["host", "localhost:3000"],
      ["x-forwarded-proto", "http"],
    ]),
  cookies: () => ({ toString: () => "session=abc" }),
}))

// Mock auth() to return a session with a user id
jest.mock("@/lib/auth", () => ({
  __esModule: true,
  auth: jest.fn().mockResolvedValue({ user: { id: "u1", name: "Test User" } }),
}))

// Import after mocks so the page uses them
import ProfilePage from "@/app/(protected)/profile/page"

describe("UI / Profile Page", () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  it("renders user profile info with email and stats", async () => {
    ;(prisma.user.findUnique as jest.Mock).mockResolvedValueOnce({
      id: "u1",
      email: "test@example.com",
      username: "test",
      createdAt: new Date(),
      _count: { posts: 5 },
    })

    // ProfilePage is an async server component
    const ui = await ProfilePage()
    render(ui)

    expect(screen.getByText(/test@example.com/i)).toBeInTheDocument()
    expect(screen.getByText("5")).toBeInTheDocument()
    expect(screen.getByText("Posts")).toBeInTheDocument()
  })
})
