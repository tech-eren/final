import { forwardRef } from 'react';
import type { InputHTMLAttributes } from 'react';
import { AlertCircle } from 'lucide-react';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  helperText?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, className = '', id, ...props }, ref) => {
    const inputId = id || label.toLowerCase().replace(/\s+/g, '-');
    const hasError = !!error;

    return (
      <div className="w-full mb-4">
        <label htmlFor={inputId} className="block text-sm font-medium text-slate-700 mb-1">
          {label}
        </label>
        <div className="relative">
          <input
            id={inputId}
            ref={ref}
            className={`
              block w-full rounded-md shadow-sm sm:text-sm transition-colors
              ${hasError 
                ? 'border-red-300 text-red-900 placeholder-red-300 focus:border-red-500 focus:ring-red-500' 
                : 'border-slate-300 focus:border-primary-500 focus:ring-primary-500'
              }
              ${className}
            `}
            aria-invalid={hasError ? 'true' : 'false'}
            aria-describedby={hasError ? `${inputId}-error` : helperText ? `${inputId}-description` : undefined}
            {...props}
          />
          {hasError && (
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <AlertCircle className="w-5 h-5 text-red-500" aria-hidden="true" />
            </div>
          )}
        </div>
        {hasError ? (
          <p className="mt-2 text-sm text-red-600" id={`${inputId}-error`}>
            {error}
          </p>
        ) : helperText ? (
          <p className="mt-2 text-sm text-slate-500" id={`${inputId}-description`}>
            {helperText}
          </p>
        ) : null}
      </div>
    );
  }
);

Input.displayName = 'Input';
