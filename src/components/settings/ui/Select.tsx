import React from 'react';

export function Select({ label, options, value, onChange, description }: any) {
  return (
    <div className="mb-6">
      {label && <label className="block text-white text-base font-medium mb-1">{label}</label>}
      {description && <p className="text-zinc-400 text-sm mb-3">{description}</p>}
      <div className="relative">
        <select 
          value={value} 
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-black/40 border border-dark-border text-white p-3.5 rounded-xl font-sans text-sm focus:outline-none focus:border-accent focus:shadow-[0_0_0_3px_rgba(139,92,246,0.2)] transition-all appearance-none cursor-pointer hover:border-zinc-600"
        >
          {options.map((opt: any) => (
            <option key={opt.value} value={opt.value} className="bg-zinc-900 text-white py-2">
              {opt.label}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-zinc-400">
          <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
          </svg>
        </div>
      </div>
    </div>
  );
}
