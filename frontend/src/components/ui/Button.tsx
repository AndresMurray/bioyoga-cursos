import * as React from "react"
import { cn } from "@/utils/cn"

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'danger' | 'ghost' | 'secondary'
  size?: 'default' | 'sm' | 'lg'
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-full font-bold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:pointer-events-none disabled:opacity-50 tracking-wide",
          {
            // Variants
            "bg-primary text-primary-foreground hover:shadow-md hover:scale-[1.02] active:scale-[0.98]": variant === 'default',
            "border-2 border-primary text-primary hover:bg-primary/5 hover:scale-[1.02] active:scale-[0.98]": variant === 'outline',
            "bg-red-100 text-red-600 hover:bg-red-200 hover:scale-[1.02] active:scale-[0.98]": variant === 'danger',
            "hover:bg-muted text-foreground rounded-lg": variant === 'ghost',
            "bg-muted text-foreground hover:bg-muted/70 hover:scale-[1.02] active:scale-[0.98]": variant === 'secondary',
            // Sizes
            "h-10 px-4 py-2": size === 'default',
            "h-9 px-3 text-sm": size === 'sm',
            "h-12 px-8 text-lg": size === 'lg',
          },
          className
        )}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button }
