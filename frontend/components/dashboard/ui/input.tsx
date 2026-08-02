import { InputHTMLAttributes, SelectHTMLAttributes, TextareaHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

type FieldState = "default" | "error" | "success";

const fieldBase =
  "w-full rounded-lg border bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition disabled:opacity-50";

const fieldStateClasses: Record<FieldState, string> = {
  default: "border-slate-200 focus:border-[var(--accent,#4f46e5)]/50 focus:ring-2 focus:ring-[var(--accent,#4f46e5)]/20",
  error: "border-rose-400 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20",
  success: "border-emerald-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20",
};

interface FieldStateProps {
  state?: FieldState;
}

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement> & FieldStateProps>(
  ({ className, state = "default", ...props }, ref) => (
    <input ref={ref} className={cn(fieldBase, fieldStateClasses[state], className)} {...props} />
  )
);
Input.displayName = "Input";

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaHTMLAttributes<HTMLTextAreaElement> & FieldStateProps>(
  ({ className, state = "default", ...props }, ref) => (
    <textarea ref={ref} className={cn(fieldBase, fieldStateClasses[state], "min-h-[90px] resize-y", className)} {...props} />
  )
);
Textarea.displayName = "Textarea";

export const Select = forwardRef<HTMLSelectElement, SelectHTMLAttributes<HTMLSelectElement> & FieldStateProps>(
  ({ className, state = "default", children, ...props }, ref) => (
    <select ref={ref} className={cn(fieldBase, fieldStateClasses[state], "appearance-none bg-[length:16px] bg-[right_10px_center] bg-no-repeat", className)} {...props}>
      {children}
    </select>
  )
);
Select.displayName = "Select";

export function Label({ className, ...props }: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return <label className={cn("mb-1.5 block text-xs font-medium text-slate-500", className)} {...props} />;
}

export function FieldMessage({ state, children }: { state: "error" | "success"; children: React.ReactNode }) {
  return (
    <p className={cn("mt-1.5 text-xs", state === "error" ? "text-rose-600" : "text-emerald-600")}>{children}</p>
  );
}
