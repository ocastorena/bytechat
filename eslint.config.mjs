import { dirname } from "path"
import { fileURLToPath } from "url"
import { FlatCompat } from "@eslint/eslintrc"

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const compat = new FlatCompat({
  baseDirectory: __dirname,
})

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    ignores: [
      "node_modules/",
      ".next/",
      "out/",
      "generated/",
      "src/generated/",
      "prisma/generated/",
      "**/*.generated.*",
      "**/*.gen.*",
    ],
  },
  {
    rules: {
      "@typescript-eslint/no-this-alias": "off",
      "@typescript-eslint/no-unused-expressions": "warn",
    },
  },
]

export default eslintConfig
