import React from 'react';
import { Bot, Send } from 'lucide-react';

export function AISummarizerPanel() {
  return (
    <div className="flex flex-col h-full bg-white border-l border-slate-200 w-80 shadow-sm hidden lg:flex">
      <div className="p-4 border-b border-slate-200 flex items-center gap-2 bg-blue-50/50">
        <Bot className="w-5 h-5 text-blue-600" />
        <h2 className="font-semibold text-slate-800">AI Summarizer</h2>
      </div>
      
      <div className="flex-1 p-4 overflow-y-auto">
        <div className="mb-6">
          <h3 className="text-sm font-medium text-slate-500 mb-2 uppercase tracking-wider">Context</h3>
          <p className="text-sm text-slate-700 bg-slate-50 p-3 rounded-lg border border-slate-100">
            Select a trending post or petition to get a quick, bulleted summary of the situation from multiple sources.
          </p>
        </div>
        
        {/* Placeholder for actual summaries */}
        <div className="space-y-4">
          <div className="bg-blue-50/50 p-3 rounded-lg border border-blue-100">
            <h4 className="text-sm font-medium text-blue-900 mb-1">Trending: Potholes in Sector 4</h4>
            <ul className="text-sm text-blue-800 space-y-1 list-disc pl-4">
              <li>Multiple reports within 500m radius.</li>
              <li>Estimated repair cost: ₹45,000.</li>
              <li>Priority: High due to recent accidents.</li>
            </ul>
          </div>
        </div>
      </div>
      
      <div className="p-4 border-t border-slate-200 bg-slate-50">
        <div className="relative">
          <input 
            type="text" 
            placeholder="Search / Ask AI..." 
            className="w-full pl-3 pr-10 py-2 text-sm border border-slate-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-600">
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
