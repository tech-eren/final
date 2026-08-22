import React from 'react';

export function Toggle({ checked, onChange, label, description }: any) {
  return (
    <div 
      className="flex items-start justify-between py-3 cursor-pointer group" 
      onClick={() => onChange(!checked)}
      role="switch"
      aria-checked={checked}
    >
      <div className="flex-1 pr-6">
        <div className="text-white text-base font-medium group-hover:text-accent-hover transition-colors">{label}</div>
        {description && <div className="text-zinc-400 text-sm mt-1 leading-relaxed">{description}</div>}
      </div>
      <div className={`relative inline-flex h-6 w-11 flex-shrink-0 items-center rounded-full transition-colors duration-300 ease-in-out focus:outline-none ${checked ? 'bg-accent' : 'bg-zinc-700 group-hover:bg-zinc-600'}`}>
        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition duration-300 ease-in-out shadow-sm ${checked ? 'translate-x-6' : 'translate-x-1'}`} />
      </div>
    </div>
  );
}
