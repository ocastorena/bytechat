import "@testing-library/jest-dom"
import { render, screen } from "@testing-library/react"
import prisma from "@/lib/prisma"

// ─────────────────────────────────────────────────────────────────────────────
// UI TESTS (Frontend) — Profile Page
//   - Render the profile page (Server Component) with mocked fetch + auth
//   - Mock child components to keep the test focused
// ─────────────────────────────────────────────────────────────────────────────

// Mock child components used by the profile page to reduce noise
jest.mock("@/components/create-post-form", () => ({
  __esModule: true,
  default: () => <div data-testid="create-post-form" />,
}))
jest.mock("@/components/feed", () => ({
  __esModule: true,
  default: (props: { userId: string }) => (
    <div data-testid="feed" data-userid={props.userId} />
  ),
}))

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
  auth: jest.fn().mockResolvedValue({ user: { id: "u1" } }),
}))

// Import after mocks so the page uses them
import ProfilePage from "@/app/(protected)/profile/page"

describe("UI / Profile Page", () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  it("renders user profile info and passes userId to Feed", async () => {
    ;(prisma.user.findUnique as jest.Mock).mockResolvedValueOnce({
      id: "u1",
      email: "test@example.com",
      username: "test",
      createdAt: new Date(),
      posts: [],
    })

    // ProfilePage is an async server component
    const ui = await ProfilePage()
    render(ui)

    expect(screen.getByText(/email:/i)).toBeInTheDocument()
    expect(screen.getByText(/test@example.com/i)).toBeInTheDocument()
    // Feed receives the userId from session
    expect(screen.getByTestId("feed")).toHaveAttribute("data-userid", "u1")
  })
})
