import React from 'react';

export function SettingsCard({ title, subtitle, children, className = '' }: any) {
  return (
    <div className={`bg-dark-card border border-dark-border rounded-2xl p-6 md:p-8 backdrop-blur-md animate-fade-in ${className}`}>
      {(title || subtitle) && (
        <div className="mb-6 border-b border-dark-border pb-4">
          {title && <h3 className="m-0 mb-2 text-2xl font-bold text-white">{title}</h3>}
          {subtitle && <p className="m-0 text-sm text-zinc-400 leading-relaxed">{subtitle}</p>}
        </div>
      )}
      {children}
    </div>
  );
}
