import React from "react";
import { cn } from "@/lib/utils";

const baseStyles =
  "inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/30 disabled:pointer-events-none disabled:opacity-50";

const variants = {
  default: "bg-foreground text-background hover:bg-foreground/90",
  outline: "border border-border bg-transparent hover:bg-muted",
  secondary: "bg-muted text-foreground hover:bg-muted/80",
};

const sizes = {
  default: "h-10 px-4 py-2",
  sm: "h-9 px-3",
};

const Button = React.forwardRef(
  ({ className, variant = "default", size = "default", ...props }, ref) => (
    <button
      ref={ref}
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      {...props}
    />
  )
);

Button.displayName = "Button";

export { Button };
