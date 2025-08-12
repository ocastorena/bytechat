import "@testing-library/jest-dom"
import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import type { NextRequest, NextResponse } from "next/server"

// ─────────────────────────────────────────────────────────────────────────────
// UI TESTS (Frontend)
//   - ProtectedLayout (header + logout flow)
//   - Feed component (SWR Infinite mocked)
// ─────────────────────────────────────────────────────────────────────────────

import ProtectedLayout from "@/app/(protected)/layout"
import { signOut } from "next-auth/react"

afterEach(() => {
  jest.clearAllMocks()
  jest.restoreAllMocks()
})

describe("UI / ProtectedLayout", () => {
  const renderWithChild = () =>
    render(
      <ProtectedLayout>
        <div data-testid="child">Children</div>
      </ProtectedLayout>
    )

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("renders the Header", () => {
    renderWithChild()
    expect(screen.getByTestId("app-header")).toBeInTheDocument()
  })

  it("renders its children inside the layout", () => {
    renderWithChild()
    expect(screen.getByTestId("child")).toBeInTheDocument()
  })

  it("shows a Log out button in the header", () => {
    renderWithChild()
    expect(screen.getByRole("button", { name: /log out/i })).toBeInTheDocument()
  })

  it("opens a confirmation dialog when Log out is clicked", async () => {
    const user = userEvent.setup()
    renderWithChild()

    await user.click(screen.getByRole("button", { name: /log out/i }))

    expect(
      await screen.findByText(/are you sure you want to log out/i)
    ).toBeInTheDocument()
  })

  it("calls signOut when the user confirms logout", async () => {
    const user = userEvent.setup()
    renderWithChild()

    await user.click(screen.getByRole("button", { name: /log out/i }))

    const confirmBtn = await screen.findByRole("button", {
      name: /yes, log out/i,
    })
    await user.click(confirmBtn)

    expect(signOut).toHaveBeenCalledTimes(1)
    expect(signOut).toHaveBeenCalledWith(
      expect.objectContaining({ callbackUrl: "/login" })
    )
  })

  it("closes the dialog when Cancel is clicked", async () => {
    const user = userEvent.setup()
    renderWithChild()

    await user.click(screen.getByRole("button", { name: /log out/i }))
    const dialogTitle = await screen.findByText(
      /are you sure you want to log out/i
    )
    expect(dialogTitle).toBeInTheDocument()

    await user.click(screen.getByRole("button", { name: /cancel/i }))

    await waitFor(() => {
      expect(
        screen.queryByText(/are you sure you want to log out/i)
      ).not.toBeInTheDocument()
    })
  })
})

// Feed component — mock SWR Infinite so we can control states
import Feed from "@/components/feed"
jest.mock("swr/infinite", () => ({ __esModule: true, default: jest.fn() }))
import useSWRInfinite from "swr/infinite"

describe("UI / Feed", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("renders loading state", () => {
    ;(useSWRInfinite as jest.Mock).mockReturnValue({
      data: undefined,
      error: undefined,
      isLoading: true,
      isValidating: false,
      size: 0,
      setSize: jest.fn(),
    })

    render(<Feed />)
    expect(screen.getByText(/loading/i)).toBeInTheDocument()
  })

  it("renders posts and a Load more button when there is a next page", () => {
    ;(useSWRInfinite as jest.Mock).mockReturnValue({
      data: [
        {
          data: [
            {
              id: "p1",
              authorName: "Alice",
              content: "Hello world",
              createdAt: new Date().toISOString(),
            },
          ],
          nextCursor: "p2",
        },
      ],
      error: undefined,
      isLoading: false,
      isValidating: false,
      size: 1,
      setSize: jest.fn(),
    })

    render(<Feed />)
    expect(screen.getByText(/hello world/i)).toBeInTheDocument()
    expect(
      screen.getByRole("button", { name: /load more/i })
    ).toBeInTheDocument()
  })

  it("renders 'No posts yet' when list is empty", () => {
    ;(useSWRInfinite as jest.Mock).mockReturnValue({
      data: [{ data: [], nextCursor: null }],
      error: undefined,
      isLoading: false,
      isValidating: false,
      size: 1,
      setSize: jest.fn(),
    })

    render(<Feed />)
    // Match the component's empty state text
    expect(screen.getByText(/No posts to show/i)).toBeInTheDocument()
  })
})

// ─────────────────────────────────────────────────────────────────────────────
// UI TESTS (OverflowMenu delete functionality)
// ─────────────────────────────────────────────────────────────────────────────

import OverflowMenu from "@/components/overflow-menu"

describe("UI / OverflowMenu (delete)", () => {
  it("shows Delete when isOwnPost and calls onDelete after confirm", async () => {
    const onDelete = jest.fn()

    render(<OverflowMenu postId="p1" isOwnPost={true} onDelete={onDelete} />)

    // open menu
    await userEvent.click(screen.getByTestId("overflow-trigger"))

    // click Delete in menu
    await userEvent.click(screen.getByTestId("menu-delete"))

    // confirm in dialog
    const confirm = await screen.findByRole("button", { name: /^delete$/i })
    await userEvent.click(confirm)

    expect(onDelete).toHaveBeenCalledWith("p1")
  })

  it("hides Delete when not own post", async () => {
    render(<OverflowMenu postId="p1" isOwnPost={false} />)

    await userEvent.click(screen.getByTestId("overflow-trigger"))

    expect(screen.queryByTestId("menu-delete")).not.toBeInTheDocument()
  })
})

// ─────────────────────────────────────────────────────────────────────────────
// API TESTS (Backend)
//   - GET /api/posts and POST /api/posts with prisma + auth mocked globally
//   - Minimal "request" helper to avoid bringing in Edge/Web APIs
// ─────────────────────────────────────────────────────────────────────────────

import prisma from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { GET, POST } from "@/app/api/posts/route"

// Minimal NextRequest-like object required by the handlers
const buildReq = (url = "http://localhost/api/posts", body?: unknown) =>
  ({ url, json: async () => body } as unknown as NextRequest)

describe("API /api/posts", () => {
  afterEach(() => jest.clearAllMocks())

  it("GET returns 401 when not authenticated", async () => {
    ;(auth as jest.Mock).mockResolvedValueOnce(null)
    const res: NextResponse = await GET(buildReq())
    expect(res.status).toBe(401)
    expect(await res.json()).toEqual({ error: "Unauthorized" })
  })

  it("GET returns posts and nextCursor when authenticated", async () => {
    ;(auth as jest.Mock).mockResolvedValueOnce({ user: { id: "u1" } })
    ;(prisma.post.findMany as jest.Mock).mockResolvedValueOnce([
      {
        id: "p1",
        content: "hello",
        createdAt: new Date(),
        author: { username: "A" },
      },
      {
        id: "p2",
        content: "world",
        createdAt: new Date(),
        author: { username: "B" },
      },
    ])

    const res: NextResponse = await GET(
      buildReq("http://localhost/api/posts?limit=2")
    )
    expect(res.status).toBe(200)
    const json = await res.json()
    expect(json.data).toHaveLength(2)
    expect(json.data[0]).toMatchObject({ id: "p1", authorName: "A" })
    expect(json.nextCursor).toBe("p2")
  })

  it("POST returns 401 when not authenticated", async () => {
    ;(auth as jest.Mock).mockResolvedValueOnce(null)
    const res: NextResponse = await POST(buildReq(undefined, { content: "hi" }))
    expect(res.status).toBe(401)
    expect(await res.json()).toEqual({ error: "Unauthorized" })
  })

  it("POST validates content and returns 400 on empty", async () => {
    ;(auth as jest.Mock).mockResolvedValueOnce({ user: { id: "u1" } })
    const res: NextResponse = await POST(buildReq(undefined, { content: "" }))
    expect(res.status).toBe(400)
    const data = await res.json()
    expect(String(data.error).toLowerCase()).toContain("empty")
  })

  it("POST creates a post and returns 201", async () => {
    ;(auth as jest.Mock).mockResolvedValueOnce({ user: { id: "u1" } })
    ;(prisma.post.create as jest.Mock).mockResolvedValueOnce({
      id: "p1",
      content: "My first post",
      createdAt: new Date(),
      author: { username: "DemoUser" },
    })

    const res: NextResponse = await POST(
      buildReq(undefined, { content: "My first post" })
    )
    expect(res.status).toBe(201)
    expect(await res.json()).toMatchObject({
      id: "p1",
      content: "My first post",
      authorName: "DemoUser",
    })

    expect(prisma.post.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          content: "My first post",
          authorId: "u1",
        }),
      })
    )
  })
})

// API edge cases — failures and cursor behavior

describe("API /api/posts edge cases", () => {
  afterEach(() => jest.clearAllMocks())

  it("GET returns 500 and logs an error when prisma throws", async () => {
    const spy = jest.spyOn(console, "error").mockImplementation(() => {})
    ;(auth as jest.Mock).mockResolvedValueOnce({ user: { id: "u1" } })
    ;(prisma.post.findMany as jest.Mock).mockRejectedValueOnce(
      new Error("db fail")
    )

    const res: NextResponse = await GET(buildReq())
    expect(res.status).toBe(500)
    expect(spy).toHaveBeenCalled()

    spy.mockRestore()
  })

  it("GET returns nextCursor null when fewer than limit posts are returned", async () => {
    ;(auth as jest.Mock).mockResolvedValueOnce({ user: { id: "u1" } })
    ;(prisma.post.findMany as jest.Mock).mockResolvedValueOnce([
      {
        id: "p1",
        content: "a",
        createdAt: new Date(),
        author: { username: "U" },
      },
    ])

    const res: NextResponse = await GET(
      buildReq("http://localhost/api/posts?limit=2")
    )
    expect(res.status).toBe(200)
    const json = await res.json()
    expect(json.nextCursor).toBeNull()
  })
})

// ─────────────────────────────────────────────────────────────────────────────
// API TESTS (Backend DELETE /api/posts/[id])
// ─────────────────────────────────────────────────────────────────────────────

import { DELETE as DELETE_POST } from "@/app/api/posts/[id]/route"

describe("API /api/posts/[id] DELETE", () => {
  afterEach(() => jest.clearAllMocks())

  const buildReq = (url = "http://localhost/api/posts/p1") =>
    ({ url } as unknown as NextRequest)

  it("401 when unauthenticated", async () => {
    ;(auth as jest.Mock).mockResolvedValueOnce(null)
    const res: NextResponse = await DELETE_POST(buildReq(), {
      params: { id: "p1" },
    } as { params: { id: string } })
    expect(res.status).toBe(401)
  })

  it("400 on invalid id", async () => {
    ;(auth as jest.Mock).mockResolvedValueOnce({ user: { id: "u1" } })
    const res: NextResponse = await DELETE_POST(
      buildReq("http://localhost/api/posts/bad"),
      { params: { id: "bad" } } as { params: { id: string } }
    )
    expect(res.status).toBe(400)
  })

  it("404 when not owned or not found", async () => {
    ;(auth as jest.Mock).mockResolvedValueOnce({ user: { id: "u1" } })
    ;(prisma.post.deleteMany as jest.Mock).mockResolvedValueOnce({ count: 0 })

    const res: NextResponse = await DELETE_POST(buildReq(), {
      params: { id: "507f1f77bcf86cd799439011" },
    } as { params: { id: string } })
    expect(res.status).toBe(404)
  })

  it("204 on success", async () => {
    ;(auth as jest.Mock).mockResolvedValueOnce({ user: { id: "u1" } })
    ;(prisma.post.deleteMany as jest.Mock).mockResolvedValueOnce({ count: 1 })

    const res: NextResponse = await DELETE_POST(buildReq(), {
      params: { id: "507f1f77bcf86cd799439011" },
    } as { params: { id: string } })
    expect(res.status).toBe(204)
  })

  it("500 when prisma throws", async () => {
    const spy = jest.spyOn(console, "error").mockImplementation(() => {})
    ;(auth as jest.Mock).mockResolvedValueOnce({ user: { id: "u1" } })
    ;(prisma.post.findMany as jest.Mock).mockRejectedValueOnce(
      new Error("db fail")
    )

    const res: NextResponse = await DELETE_POST(buildReq(), {
      params: { id: "507f1f77bcf86cd799439011" },
    } as { params: { id: string } })

    expect(res.status).toBe(500)
    expect(spy).toHaveBeenCalled()
    spy.mockRestore()
  })
})
