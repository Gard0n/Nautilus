import React, { createContext, useContext, useMemo, useState } from "react";
import { cn } from "@/lib/utils";

const TabsContext = createContext(null);

function Tabs({ defaultValue, value, onValueChange, className, children }) {
  const [internalValue, setInternalValue] = useState(defaultValue);
  const currentValue = value ?? internalValue;

  const contextValue = useMemo(
    () => ({
      value: currentValue,
      setValue: (next) => {
        if (value === undefined) setInternalValue(next);
        if (onValueChange) onValueChange(next);
      },
    }),
    [currentValue, onValueChange, value]
  );

  return (
    <TabsContext.Provider value={contextValue}>
      <div className={cn("space-y-4", className)}>{children}</div>
    </TabsContext.Provider>
  );
}

function TabsList({ className, ...props }) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 rounded-full bg-muted p-1",
        className
      )}
      {...props}
    />
  );
}

function TabsTrigger({ value, className, ...props }) {
  const ctx = useContext(TabsContext);
  if (!ctx) return null;
  const active = ctx.value === value;
  return (
    <button
      className={cn(
        "rounded-full px-4 py-2 text-sm font-medium transition-colors",
        active ? "bg-white text-foreground" : "text-muted-foreground",
        className
      )}
      onClick={() => ctx.setValue(value)}
      {...props}
    />
  );
}

function TabsContent({ value, className, ...props }) {
  const ctx = useContext(TabsContext);
  if (!ctx || ctx.value !== value) return null;
  return <div className={cn("pt-1", className)} {...props} />;
}

export { Tabs, TabsList, TabsTrigger, TabsContent };
