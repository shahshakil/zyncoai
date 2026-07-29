import { ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost" | "danger" | "outline";
type Size = "sm" | "md" | "lg";

const variantClasses: Record<Variant, string> = {
  primary: "bg-[image:var(--gradient,linear-gradient(135deg,#6366f1,#06b6d4))] text-white font-semibold shadow-[0_1px_2px_rgba(0,0,0,0.1)] hover:opacity-90 hover:-translate-y-px",
  secondary: "bg-slate-100 text-slate-900 font-medium hover:bg-slate-200 border border-slate-200",
  outline: "border border-slate-200 text-slate-700 font-medium hover:bg-slate-50 hover:text-slate-900",
  ghost: "text-slate-600 font-medium hover:text-slate-900 hover:bg-slate-100",
  danger: "bg-rose-600 text-white font-medium hover:bg-rose-500",
};

const sizeClasses: Record<Size, string> = {
  sm: "h-8 px-3 text-xs",
  md: "h-9 px-4 text-sm",
  lg: "h-11 px-6 text-sm",
};

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", disabled, ...props }, ref) => (
    <button
      ref={ref}
      disabled={disabled}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-lg transition-all duration-150 ease-out focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-primary,#4f46e5)]/20 disabled:opacity-50 disabled:pointer-events-none",
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      {...props}
    />
  )
);
Button.displayName = "Button";
