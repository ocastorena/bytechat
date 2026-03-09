import "@testing-library/jest-dom"
import { LoginForm } from "@/components/login-form"
import userEvent from "@testing-library/user-event"
import { render, screen } from "@testing-library/react"
import { signIn } from "next-auth/react"

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
  }),
  useSearchParams: () => new URLSearchParams(),
}))

jest.mock("next-auth/react", () => ({
  signIn: jest.fn(),
  useSession: () => ({ data: null, status: "unauthenticated" }),
}))

beforeEach(() => {
  jest.clearAllMocks()
})

describe("LoginForm", () => {
  it("shows client-side validation error for invalid email", async () => {
    const user = userEvent.setup()
    render(<LoginForm />)

    await user.type(screen.getByLabelText(/email/i), "invalid@e")
    await user.type(screen.getByLabelText(/^password$/i), "password1")
    await user.click(screen.getByRole("button", { name: /^login$/i }))

    expect(
      await screen.findByText(/Invalid email address./i)
    ).toBeInTheDocument()

    expect(signIn).not.toHaveBeenCalled()
  })

  it("calls signIn with credentials on valid form submission", async () => {
    const user = userEvent.setup()
    render(<LoginForm />)

    await user.type(screen.getByLabelText(/email/i), "me@test.com")
    await user.type(screen.getByLabelText(/^password$/i), "password1")
    await user.click(screen.getByRole("button", { name: /^login$/i }))

    expect(signIn).toHaveBeenCalledWith("credentials", {
      email: "me@test.com",
      password: "password1",
      callbackUrl: "/home",
      redirect: true,
    })
  })
})
