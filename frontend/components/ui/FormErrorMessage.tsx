import * as React from "react";
import { AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface FormErrorMessageProps {
  message?: string;
  className?: string;
}

export function FormErrorMessage({ message, className }: FormErrorMessageProps) {
  if (!message) return null;

  return (
    <div
      className={cn(
        "flex items-center gap-1.5 text-xs font-medium text-rose-500 mt-1.5",
        className
      )}
    >
      <AlertCircle className="h-3.5 w-3.5 shrink-0" />
      <span>{message}</span>
    </div>
  );
}

