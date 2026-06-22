import React from "react";
import { Search } from "lucide-react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: boolean;
}

export function Input({ icon = false, className = "", ...props }: InputProps) {
  return (
    <div className="relative">
      {icon && (
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-400">
          <Search className="h-5 w-5" />
        </div>
      )}
      <input
        className={`block w-full rounded-lg border-gray-300 bg-gray-50 border px-4 py-2 text-gray-900 focus:border-brand focus:ring-brand sm:text-sm transition-colors ${
          icon ? "pr-10" : ""
        } ${className}`}
        {...props}
      />
    </div>
  );
}
