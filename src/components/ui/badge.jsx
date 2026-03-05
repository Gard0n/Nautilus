import React from "react";
import { cn } from "@/lib/utils";

const variants = {
  default: "bg-foreground text-background",
  secondary: "bg-muted text-foreground",
  outline: "border border-border text-foreground",
};

function Badge({ className, variant = "default", ...props }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium",
        variants[variant],
        className
      )}
      {...props}
    />
  );
}

export { Badge };
