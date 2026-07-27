import React from 'react';
import { ChevronDown } from 'lucide-react';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  icon?: React.ReactNode;
  wrapperClassName?: string;
}

export function Select({ icon, className = "", wrapperClassName = "", children, ...props }: SelectProps) {
  return (
    <div className={`relative ${wrapperClassName}`}>
      {icon && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-brand/70 pointer-events-none">
          {icon}
        </div>
      )}
      <select 
        className={`w-full appearance-none bg-white border border-gray-200 text-gray-700 py-2 rounded-lg text-sm
        focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand transition-all shadow-sm hover:border-brand/50 hover:bg-gray-50
        cursor-pointer
        ${icon ? "pr-10 pl-10" : "pr-4 pl-10"} 
        ${className}`}
        {...props}
      >
        {children}
      </select>
      <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
        <ChevronDown className="h-4 w-4" />
      </div>
    </div>
  );
}
