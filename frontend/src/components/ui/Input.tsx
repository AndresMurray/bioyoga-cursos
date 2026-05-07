import * as React from "react"
import { cn } from "@/utils/cn"

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  label?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, label, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1 w-full">
        {label && <label className="text-sm font-medium text-foreground">{label}</label>}
        <input
          type={type}
          className={cn(
            "flex h-10 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:border-primary disabled:cursor-not-allowed disabled:opacity-50",
            error && "border-red-500 focus-visible:border-red-500",
            className
          )}
          ref={ref}
          {...props}
        />
        {error && <span className="text-xs text-red-500 mt-1">{error}</span>}
      </div>
    )
  }
)
Input.displayName = "Input"

export { Input }
