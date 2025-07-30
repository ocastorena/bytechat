import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import SignupForm from "@/components/signup-form"
import "@testing-library/jest-dom"

describe("SignupForm", () => {
  it("shows error when passwords don't match", async () => {
    const user = userEvent.setup()
    render(<SignupForm />)
    await user.type(screen.getByLabelText(/email/i), "me@test.com")
    await user.type(screen.getByLabelText(/^password$/i), "password1")
    await user.type(screen.getByLabelText(/confirm password/i), "password2")
    await user.click(screen.getByRole("button", { name: /^sign up$/i }))

    expect(
      await screen.findByText(/passwords do not match/i)
    ).toBeInTheDocument()
  })
})
