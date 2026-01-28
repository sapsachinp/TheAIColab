import * as React from "react"
import { motion } from "framer-motion"
import { cn } from "../../lib/utils"

const buttonVariants = {
  default:
    "bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700",
  secondary:
    "bg-white/10 hover:bg-white/20 text-white border border-white/20",
  outline:
    "border border-white/20 bg-transparent hover:bg-white/10 text-white",
  ghost: "hover:bg-white/10 text-white",
}

const buttonSizes = {
  default: "h-11 px-6 py-2.5 text-base",
  sm: "h-9 px-4 py-2 text-sm",
  lg: "h-14 px-8 py-4 text-lg",
  xl: "h-16 px-10 py-5 text-xl",
  icon: "h-10 w-10",
}

const Button = React.forwardRef(
  (
    {
      className,
      variant = "default",
      size = "default",
      asChild = false,
      animated = true,
      children,
      ...props
    },
    ref
  ) => {
    const Comp = animated ? motion.button : "button"
    const animationProps = animated
      ? {
          whileHover: { scale: 1.05 },
          whileTap: { scale: 0.95 },
        }
      : {}

    return (
      <Comp
        className={cn(
          "inline-flex items-center justify-center gap-2 rounded-xl font-bold shadow-lg transition-all",
          "focus:outline-none focus:ring-4 focus:ring-green-400/70 focus:ring-offset-4 focus:ring-offset-slate-900",
          "disabled:pointer-events-none disabled:opacity-50",
          "touch-manipulation",
          buttonVariants[variant],
          buttonSizes[size],
          className
        )}
        ref={ref}
        type="button"
        {...animationProps}
        {...props}
      >
        {children}
      </Comp>
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
