import { registerSchema } from "@/lib/validations"

describe("registerSchema", () => {
  it("should fail if passwords do not match", () => {
    const result = registerSchema.safeParse({
      email: "test@example.com",
      username: "testuser",
      password: "password1",
      confirmPassword: "password2",
    })
    expect(result.success).toBe(false)
    expect(result.error?.issues[0].message).toMatch(/Passwords do not match/)
  })

  it("should pass with matching passwords", () => {
    const result = registerSchema.safeParse({
      email: "test@example.com",
      username: "testuser",
      password: "password1",
      confirmPassword: "password1",
    })
    expect(result.success).toBe(true)
  })
})
