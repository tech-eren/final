import React from 'react';

export function RadioGroup({ label, options, value, onChange, description }: any) {
  return (
    <div className="mb-6">
      {label && <label className="block text-white text-base font-medium mb-1">{label}</label>}
      {description && <p className="text-zinc-400 text-sm mb-3">{description}</p>}
      <div className="space-y-3 mt-2">
        {options.map((opt: any) => (
          <label key={opt.value} className="flex items-center gap-3 cursor-pointer group">
            <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${value === opt.value ? 'border-accent bg-accent/20' : 'border-zinc-600 group-hover:border-zinc-400'}`}>
              {value === opt.value && <div className="w-2.5 h-2.5 rounded-full bg-accent" />}
            </div>
            <div>
              <span className={`text-sm ${value === opt.value ? 'text-white font-medium' : 'text-zinc-300 group-hover:text-white transition-colors'}`}>{opt.label}</span>
              {opt.description && <p className="text-xs text-zinc-500 m-0 mt-0.5">{opt.description}</p>}
            </div>
          </label>
        ))}
      </div>
    </div>
  );
}
