import React from "react"

export function BytechatLogo(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="180"
      height="48"
      viewBox="0 0 180 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}>
      <rect
        x="0"
        y="8"
        width="40"
        height="28"
        rx="10"
        className="fill-foreground"
      />
      <rect x="33" y="29" width="7" height="7" rx="2" className="fill-accent" />
      <polygon points="12,36 20,36 16,44" className="fill-zinc-900" />
      <text
        x="52"
        y="31"
        fontFamily="Segoe UI, Arial, sans-serif"
        fontWeight="bold"
        fontSize="28"
        className="fill-foreground">
        Byte
        <tspan className="fill-accent">Chat</tspan>
      </text>
    </svg>
  )
}
