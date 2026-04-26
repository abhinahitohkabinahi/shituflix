'use client';

import React, { useState } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export function Input({ label, error, id, className = '', onFocus, onBlur, ...props }: InputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const inputId = id ?? label.toLowerCase().replace(/\s+/g, '-');
  
  // A field is considered "active" if it's focused OR has a value
  const isActive = isFocused || (props.value && props.value.toString().length > 0);

  return (
    <div className="flex flex-col w-full">
      <div className="relative w-full">
        <input
          id={inputId}
          onFocus={(e) => {
            setIsFocused(true);
            onFocus?.(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            onBlur?.(e);
          }}
          className={`
            peer w-full bg-[#333]/50 rounded px-4 pt-6 pb-2 text-white text-base h-[56px]
            focus:outline-none transition-all duration-200
            ${error 
              ? 'border border-[#EB3942] rounded-[4px]' 
              : isFocused 
                ? 'border-2 border-white rounded-[7px]' 
                : 'border border-[#808080] rounded-[4px]'
            }
            ${className}
          `}
          placeholder=" "
          {...props}
        />
        
        {/* Error icon inside the input field */}
        {error && (
          <img 
            src="/assets/icons/CircleError.svg" 
            alt="Error" 
            className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 pointer-events-none"
          />
        )}
        
        <label
          htmlFor={inputId}
          className={`
            absolute left-4 transition-all duration-200 pointer-events-none
            ${error ? 'text-gray-400' : 'text-gray-400'}
            ${isActive 
              ? 'top-2 text-[11px] font-bold uppercase tracking-wider' 
              : 'top-4 text-base'
            }
          `}
        >
          {label}
        </label>
      </div>

      {error && (
        <div className="flex items-start gap-1.5 mt-1.5 px-1 animate-in fade-in slide-in-from-top-1 duration-200">
          <p className="text-[13px] text-[#EB3942]">
            {error}
          </p>
        </div>
      )}
    </div>
  );
}
