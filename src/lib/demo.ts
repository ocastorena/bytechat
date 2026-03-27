/** Whether the app is running in read-only demo mode */
export const isDemoMode = process.env.NEXT_PUBLIC_DEMO_MODE === "true"

/** Demo account credentials for auto-fill on the login page */
export const DEMO_ACCOUNT = {
  email: "dev@bytechat.io",
  password: "password",
} as const

/** Standard message returned when a demo-restricted action is attempted */
export const DEMO_DISABLED_MESSAGE = "Demo mode: this action is disabled"
