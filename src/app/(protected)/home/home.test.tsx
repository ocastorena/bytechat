import "@testing-library/jest-dom"
import { render, screen } from "@testing-library/react"

import ProtectedLayout from "../layout"

// ─── global mocks ──────────────────────────────────────────────────────────
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
  }),
}))

jest.mock("next-auth/react", () => ({
  signIn: jest.fn().mockResolvedValue({ error: "CredentialsSignin" }),
  signOut: jest.fn(),
  useSession: () => ({ data: null, status: "unauthenticated" }),
}))

describe("ProtectedLayout & Header behaviour", () => {
  // ────────────────────────────────────────────── Cleanup between tests
  beforeEach(() => jest.clearAllMocks())

  // ──────────────────────────────────────────────
  it("renders the Header (Log out button) on every protected page", () => {
    render(
      <ProtectedLayout>
        <div>Dummy page content</div>
      </ProtectedLayout>
    )

    expect(screen.getByRole("button", { name: /log out/i })).toBeInTheDocument()
  })
})
