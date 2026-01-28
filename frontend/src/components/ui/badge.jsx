import * as React from "react"
import { cn } from "../../lib/utils"

const badgeVariants = {
  default: "bg-white/10 text-white border-white/20",
  success: "bg-green-500/20 text-green-300 border-green-500/30",
  warning: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
  info: "bg-blue-500/20 text-blue-300 border-blue-500/30",
  gradient: "bg-gradient-to-r from-green-500/20 to-blue-500/20 text-white border-white/20",
}

function Badge({ className, variant = "default", ...props }) {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border px-4 py-2 text-xs font-semibold transition-colors",
        "focus:outline-none focus:ring-2 focus:ring-offset-2",
        badgeVariants[variant],
        className
      )}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
