import "@testing-library/jest-dom"

// Optional: Mock Next.js router if you use useRouter in components
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
  }),
}))

// (Add any other global mocks/setup here)
