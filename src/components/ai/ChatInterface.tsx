import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2, MapPin, ChevronRight, AlertTriangle, FileText, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { civicAIService } from '../../services/civicAIService';
import type { CivicAIMessage } from '../../services/civicAIService';

export function ChatInterface({ onAction, role = 'CITIZEN' }: { onAction?: () => void, role?: 'CITIZEN' | 'AUTHORITY' | 'ADMIN' }) {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<CivicAIMessage[]>([civicAIService.getWelcomeMessage(role)]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSendMessage = async (text: string = inputValue) => {
    const trimmed = text.trim();
    if (!trimmed) return;

    // Add user message
    const userMsg: CivicAIMessage = {
      id: `msg_${Date.now()}`,
      role: 'user',
      content: trimmed,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    if (text === inputValue) setInputValue('');
    setIsTyping(true);

    try {
      const aiResponse = await civicAIService.sendMessage(trimmed, 'usr_1', role);
      setMessages(prev => [...prev, aiResponse]);
    } catch (error) {
      setMessages(prev => [...prev, {
        id: `err_${Date.now()}`,
        role: 'assistant',
        content: "I'm having trouble connecting right now. You can still browse reports or submit an issue manually.",
        type: 'text',
        timestamp: new Date()
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  const formatMessageContent = (content: string) => {
    // Basic bolding support for "**text**"
    const parts = content.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i} className="text-white font-semibold">{part.slice(2, -2)}</strong>;
      }
      return <span key={i}>{part}</span>;
    });
  };

  const renderMessageContent = (msg: CivicAIMessage) => {
    switch (msg.type) {
      case 'suggested_prompts':
        return (
          <div className="space-y-3">
            <p className="m-0 leading-relaxed text-sm text-zinc-300">{formatMessageContent(msg.content)}</p>
            <div className="flex flex-col gap-2 mt-2">
              <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1">Suggested Questions</span>
              {msg.data?.prompts.map((prompt: string, idx: number) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(prompt)}
                  className="text-left px-4 py-2 rounded-xl bg-black/40 border border-zinc-700 hover:border-accent hover:bg-accent/10 transition-all text-sm text-zinc-300 hover:text-white cursor-pointer"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        );

      case 'report_preview':
        return (
          <div className="space-y-3">
            <p className="m-0 leading-relaxed text-sm text-zinc-300">{formatMessageContent(msg.content)}</p>
            <div className="bg-black/40 border border-zinc-700 rounded-xl p-4 mt-2">
              <h4 className="text-white text-sm font-semibold m-0 mb-3 border-b border-zinc-800 pb-2">Report Preview</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-zinc-500">Category:</span>
                  <span className="text-zinc-200">{msg.data?.category}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Issue:</span>
                  <span className="text-zinc-200">{msg.data?.issue}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Severity:</span>
                  <span className="text-red-400 font-medium">{msg.data?.severity}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Location:</span>
                  <span className="text-zinc-200">{msg.data?.location}</span>
                </div>
                <div className="mt-3 bg-black/50 p-3 rounded-lg text-zinc-300 italic">
                  "{msg.data?.description}"
                </div>
              </div>
              <div className="flex gap-2 mt-4 pt-3 border-t border-zinc-800">
                <button onClick={() => navigate('/citizen/report')} className="flex-1 bg-accent hover:bg-accent-hover text-white py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer border-none">
                  Submit Report
                </button>
                <button className="flex-1 bg-transparent border border-zinc-600 text-zinc-400 hover:text-white py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer">
                  Edit
                </button>
              </div>
            </div>
          </div>
        );

      case 'issue_list':
        return (
          <div className="space-y-3">
            <p className="m-0 leading-relaxed text-sm text-zinc-300">{formatMessageContent(msg.content)}</p>
            <div className="space-y-3 mt-2">
              {msg.data?.issues?.map((issue: any, idx: number) => (
                <div key={idx} className="bg-black/40 border border-zinc-700 rounded-xl p-3 hover:border-zinc-500 transition-colors cursor-pointer" onClick={() => navigate('/citizen/feed')}>
                  <div className="flex justify-between items-start mb-2">
                    <h5 className="m-0 text-sm font-semibold text-white line-clamp-1">{issue.category}</h5>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${issue.status === 'Resolved' ? 'bg-green-500/20 text-green-400' : issue.status === 'In Progress' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-red-500/20 text-red-400'}`}>
                      {issue.status}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-400 m-0 mb-2 flex items-center gap-1">
                    <MapPin className="w-3 h-3" /> {issue.location?.address || 'Unknown location'}
                  </p>
                  <button className="flex items-center gap-1 text-xs font-medium text-accent hover:text-accent-hover bg-transparent border-none p-0 cursor-pointer w-full justify-end mt-2">
                    View Report <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        );
        
      case 'tracking_timeline':
        return (
          <div className="space-y-3">
            <p className="m-0 leading-relaxed text-sm text-zinc-300">{formatMessageContent(msg.content)}</p>
            <div className="bg-black/40 border border-zinc-700 rounded-xl p-4 mt-2">
               <h4 className="text-white text-sm font-semibold m-0 mb-1">Complaint #{msg.data?.issue?.id?.slice(0, 8)}</h4>
               <p className="text-xs text-zinc-500 m-0 mb-4">{new Date(msg.data?.issue?.createdAt).toLocaleDateString()}</p>
               
               <div className="flex items-center gap-2 mb-4">
                 <span className="text-xs text-zinc-400">Status:</span>
                 <span className={`px-2 py-1 rounded text-xs font-bold uppercase tracking-wider border ${msg.data?.issue?.status === 'Resolved' ? 'bg-green-500/20 text-green-400 border-green-500/30' : msg.data?.issue?.status === 'In Progress' ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' : 'bg-red-500/20 text-red-400 border-red-500/30'}`}>
                   {msg.data?.issue?.status}
                 </span>
               </div>
               
               <button onClick={() => navigate('/citizen/reports')} className="w-full bg-transparent border border-zinc-600 text-zinc-300 hover:text-white py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer">
                  View Full Timeline
                </button>
            </div>
          </div>
        );

      case 'summary':
        return (
          <div className="space-y-3">
            <p className="m-0 leading-relaxed text-sm text-zinc-300">{formatMessageContent(msg.content)}</p>
            <div className="bg-black/40 border border-zinc-700 rounded-xl p-4 mt-2 text-sm">
              <h4 className="text-white font-semibold m-0 mb-2 flex items-center gap-2"><FileText className="w-4 h-4 text-accent"/> Major Issues</h4>
              <ul className="m-0 pl-4 space-y-1 text-zinc-300 mb-4">
                {msg.data?.major?.map((m: string, i: number) => <li key={i}>{m}</li>)}
              </ul>
              
              <h4 className="text-white font-semibold m-0 mb-1 flex items-center gap-2"><AlertTriangle className="w-4 h-4 text-red-400"/> Critical</h4>
              <p className="text-zinc-300 m-0 mb-4 pl-6">{msg.data?.critical}</p>
              
              <h4 className="text-white font-semibold m-0 mb-1 flex items-center gap-2"><MapPin className="w-4 h-4 text-blue-400"/> Most Affected Area</h4>
              <p className="text-zinc-300 m-0 pl-6">{msg.data?.affectedArea}</p>
            </div>
          </div>
        );

      case 'text':
      default:
        return <p className="m-0 leading-relaxed text-sm">{formatMessageContent(msg.content)}</p>;
    }
  };

  return (
    <div className="flex flex-col h-full bg-zinc-900/80">
      <div className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-transparent">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex w-full ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex items-start max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              
              {/* Avatar */}
              <div className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center border shadow-sm
                ${msg.role === 'user' 
                  ? 'bg-zinc-800 border-zinc-700 text-zinc-300 ml-3' 
                  : 'bg-accent/20 border-accent/40 text-accent mr-3'}`}
              >
                {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>
              
              {/* Message Bubble */}
              <div className={`px-4 py-3 rounded-2xl shadow-sm
                ${msg.role === 'user' 
                  ? 'bg-zinc-800 border border-zinc-700 text-white rounded-tr-sm' 
                  : 'bg-zinc-800/60 border border-zinc-700/50 text-zinc-200 rounded-tl-sm backdrop-blur-sm'}`}
              >
                {renderMessageContent(msg)}
              </div>
            </div>
          </div>
        ))}
        
        {/* Typing Indicator */}
        {isTyping && (
          <div className="flex justify-start w-full animate-in fade-in">
            <div className="flex items-start max-w-[85%] flex-row">
              <div className="flex-shrink-0 h-8 w-8 rounded-full bg-accent/20 border border-accent/40 text-accent mr-3 flex items-center justify-center">
                <Bot className="w-4 h-4" />
              </div>
              <div className="px-4 py-3 rounded-2xl bg-zinc-800/60 border border-zinc-700/50 text-zinc-400 rounded-tl-sm flex items-center space-x-1.5">
                <span className="text-xs font-medium mr-2">UbiqAI is thinking</span>
                <div className="w-1.5 h-1.5 bg-accent/60 rounded-full animate-bounce"></div>
                <div className="w-1.5 h-1.5 bg-accent/60 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-1.5 h-1.5 bg-accent/60 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} className="h-1" />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-zinc-900 border-t border-zinc-800/80">
        <div className="relative flex items-center">
          <input
            type="text"
            className="w-full pl-4 pr-12 py-3.5 bg-black/40 border border-zinc-700 rounded-2xl focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent text-sm text-white placeholder:text-zinc-500 transition-all shadow-inner"
            placeholder="Ask about civic issues, report problems..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isTyping}
            autoFocus
          />
          <button 
            className="absolute right-2 rounded-xl w-9 h-9 p-0 flex items-center justify-center flex-shrink-0 bg-accent text-white hover:bg-accent-hover disabled:opacity-50 disabled:cursor-not-allowed transition-all border-none cursor-pointer"
            onClick={() => handleSendMessage()}
            disabled={!inputValue.trim() || isTyping}
            aria-label="Send message"
          >
            {isTyping ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4 -ml-0.5" />}
          </button>
        </div>
      </div>
    </div>
  );
}
