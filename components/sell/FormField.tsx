import * as React from "react";
import { cn } from "@/lib/utils";

interface FormFieldProps {
  label: string;
  required?: boolean;
  error?: string;
  helperText?: string;
  children: React.ReactNode;
  className?: string;
}

export function FormField({
  label,
  required = false,
  error,
  helperText,
  children,
  className,
}: FormFieldProps) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <label className="flex items-center gap-1 text-xs font-bold text-neutral-800">
        <span>{label}</span>
        {required && <span className="text-[#ff4000]">*</span>}
      </label>
      {children}
      {error ? (
        <p className="text-xs font-medium text-rose-500">
          {error}
        </p>
      ) : helperText ? (
        <p className="text-[11px] text-neutral-500">{helperText}</p>
      ) : null}
    </div>
  );
}

