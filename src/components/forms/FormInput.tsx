import React from "react";

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  required?: boolean;
}

export function FormInput({
  label,
  error,
  required,
  className = "",
  ...props
}: FormInputProps) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-bold text-slate-700 ml-1">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <input
        {...props}
        className={`w-full px-5 py-3.5 rounded-2xl border ${
          error
            ? "border-red-300 focus:border-red-500 focus:ring-red-500/10"
            : "border-slate-200 focus:border-blue-500 focus:ring-blue-500/10"
        } bg-slate-50/50 outline-none focus:ring-4 transition-all font-medium ${className}`}
      />
      {error && (
        <p className="text-red-500 text-sm ml-1 font-medium animate-shake">
          {error}
        </p>
      )}
    </div>
  );
}

interface FormTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
  required?: boolean;
}

export function FormTextarea({
  label,
  error,
  required,
  className = "",
  ...props
}: FormTextareaProps) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-bold text-slate-700 ml-1">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <textarea
        {...props}
        className={`w-full px-5 py-3.5 rounded-2xl border ${
          error
            ? "border-red-300 focus:border-red-500 focus:ring-red-500/10"
            : "border-slate-200 focus:border-blue-500 focus:ring-blue-500/10"
        } bg-slate-50/50 outline-none focus:ring-4 transition-all font-medium resize-none ${className}`}
      />
      {error && (
        <p className="text-red-500 text-sm ml-1 font-medium animate-shake">
          {error}
        </p>
      )}
    </div>
  );
}
