import "@testing-library/jest-dom"
import { LoginForm } from "@/components/login-form"
import userEvent from "@testing-library/user-event"
import { render, screen } from "@testing-library/react"
import { signIn } from "next-auth/react"

// grab the mocked functions so we can assert on them
const pushMock = jest.fn()

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: pushMock,
    replace: jest.fn(),
    prefetch: jest.fn(),
  }),
}))

jest.mock("next-auth/react", () => ({
  signIn: jest.fn().mockResolvedValue({ error: "CredentialsSignin" }),
  useSession: () => ({ data: null, status: "unauthenticated" }),
}))

beforeEach(() => {
  jest.clearAllMocks()
})

describe("LoginForm", () => {
  it("shows error when email or password are incorrect", async () => {
    const user = userEvent.setup()
    render(<LoginForm />)
    await user.type(screen.getByLabelText(/email/i), "me@test.com")
    await user.type(screen.getByLabelText(/^password$/i), "password1")
    await user.click(screen.getByRole("button", { name: /^login$/i }))

    expect(
      await screen.findByText(/invalid email or password/i)
    ).toBeInTheDocument()
  })

  it("shows client‑side validation error for invalid email", async () => {
    const user = userEvent.setup()
    render(<LoginForm />)

    // type invalid email & valid password
    await user.type(screen.getByLabelText(/email/i), "invalid@e")
    await user.type(screen.getByLabelText(/^password$/i), "password1")
    await user.click(screen.getByRole("button", { name: /^login$/i }))

    // zod should catch invalid email
    expect(
      await screen.findByText(/Invalid email address./i)
    ).toBeInTheDocument()

    // signIn should NOT have been called because validation failed
    expect(signIn).not.toHaveBeenCalled()
  })

  it("redirects user on successful login", async () => {
    // make signIn resolve with no error
    ;(signIn as jest.Mock).mockResolvedValueOnce({ error: null })

    const user = userEvent.setup()
    render(<LoginForm />)

    await user.type(screen.getByLabelText(/email/i), "me@test.com")
    await user.type(screen.getByLabelText(/^password$/i), "password1")
    await user.click(screen.getByRole("button", { name: /^login$/i }))

    // push('/') should have been called
    expect(pushMock).toHaveBeenCalledWith("/")
    // no generic error message
    expect(
      screen.queryByText(/invalid email or password/i)
    ).not.toBeInTheDocument()
  })
})
