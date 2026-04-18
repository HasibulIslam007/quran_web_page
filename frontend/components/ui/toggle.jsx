import * as React from "react";
import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils";

const toggleVariants = cva(
  "inline-flex items-center justify-center rounded-2xl border border-transparent px-3 py-1.5 text-sm font-medium transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring/40 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-slate-200 text-slate-700 hover:bg-slate-300",
        outline:
          "border-slate-300 bg-white text-slate-700 hover:bg-slate-100 data-[state=on]:border-blue-600 data-[state=on]:bg-blue-600 data-[state=on]:text-white",
      },
      size: {
        default: "h-9",
        sm: "h-8 px-2.5 text-xs",
        lg: "h-10 px-4",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

const Toggle = React.forwardRef(function Toggle(
  { className, variant, size, pressed = false, onPressedChange, onClick, ...props },
  ref,
) {
  const handleClick = (event) => {
    onPressedChange?.(!pressed);
    onClick?.(event);
  };

  return (
    <button
      ref={ref}
      type="button"
      aria-pressed={pressed}
      data-state={pressed ? "on" : "off"}
      className={cn(toggleVariants({ variant, size }), className)}
      onClick={handleClick}
      {...props}
    />
  );
});

export { Toggle, toggleVariants };
