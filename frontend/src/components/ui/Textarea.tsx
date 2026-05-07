import * as React from "react"
import { cn } from "@/utils/cn"

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string;
  label?: string;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error, label, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1 w-full">
        {label && <label className="text-sm font-medium text-foreground">{label}</label>}
        <textarea
          className={cn(
            "flex min-h-[80px] w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:border-primary disabled:cursor-not-allowed disabled:opacity-50 resize-y",
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
Textarea.displayName = "Textarea"

export { Textarea }
