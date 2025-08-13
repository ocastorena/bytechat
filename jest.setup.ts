import "@testing-library/jest-dom"

// Optional: Mock Next.js router if you use useRouter in components
jest.mock("next/navigation", () => ({
  // Router methods used in client components
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
    refresh: jest.fn(),
    prefetch: jest.fn(),
  }),
  // Pathname helper used by Header for active link styling
  usePathname: jest.fn(() => "/"),
}))

jest.mock("next-auth/react", () => ({
  SessionProvider: ({ children }: never) => children,
  useSession: () => ({ data: null, status: "unauthenticated" }),
  signIn: jest.fn(),
  signOut: jest.fn(),
}))

jest.mock("next/server", () => {
  function NextResponse(body?: unknown, init?: { status?: number }) {
    return {
      status: init?.status ?? 200,
      json: async () => body,
    }
  }
  NextResponse.json = function <T>(body: T, init?: { status?: number }) {
    return {
      status: init?.status ?? 200,
      json: async () => body,
    }
  }
  return { NextResponse }
})

jest.mock("@/lib/prisma", () => ({
  __esModule: true,
  default: {
    post: {
      findMany: jest.fn(),
      create: jest.fn(),
      deleteMany: jest.fn(),
    },
    user: {
      findUnique: jest.fn(),
    },
  },
}))

jest.mock("@/lib/auth", () => ({ auth: jest.fn() }))

// (Add any other global mocks/setup here)
