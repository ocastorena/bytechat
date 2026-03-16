import React from "react"
import { cn } from "@/lib/utils"

export function BytechatLogo({ className, ...props }: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="180"
      height="48"
      viewBox="0 0 180 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("logo-glow", className)}
      {...props}>
      <defs>
        <filter id="accent-glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <rect
        x="0"
        y="8"
        width="40"
        height="28"
        rx="10"
        className="fill-foreground"
      />
      <rect x="33" y="29" width="7" height="7" rx="2" className="fill-accent logo-glow-target" />
      <polygon points="12,36 20,36 16,44" className="fill-foreground" />
      <text
        x="52"
        y="31"
        fontFamily="Segoe UI, Arial, sans-serif"
        fontWeight="bold"
        fontSize="28"
        className="fill-foreground">
        Byte
        <tspan className="fill-accent logo-glow-target">Chat</tspan>
      </text>
    </svg>
  )
}
