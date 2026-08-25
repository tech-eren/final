import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '../../components/ui/Card';
import { AlertTriangle, TrendingUp, Group, BrainCircuit, CalendarClock, RefreshCw, Wifi } from 'lucide-react';
import { issueService } from '../../services/mock/issueService';
import { runAutoScrape, getLastScrapeTime, clearScrapeThrottle } from '../../services/autoScrapeService';
import type { CivicInsight } from '../../types';

export function Intelligence() {
  const [insights, setInsights] = useState<CivicInsight[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRescanning, setIsRescanning] = useState(false);
  const [lastScrapeTime, setLastScrapeTime] = useState<Date | null>(null);
  const [minutesAgo, setMinutesAgo] = useState<number | null>(null);

  useEffect(() => {
    // Load insights from store
    const fetchInsights = async () => {
      try {
        const data = await issueService.getCivicInsights();
        setInsights(data);
      } catch (error) {
        console.error('Failed to fetch insights', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchInsights();

    // Read last scrape time from localStorage
    const t = getLastScrapeTime();
    setLastScrapeTime(t);
    if (t) setMinutesAgo(Math.floor((Date.now() - t.getTime()) / 60000));

    // Update the "X minutes ago" counter every minute
    const interval = setInterval(() => {
      const lt = getLastScrapeTime();
      if (lt) setMinutesAgo(Math.floor((Date.now() - lt.getTime()) / 60000));
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  const handleForceRescan = async () => {
    setIsRescanning(true);
    try {
      clearScrapeThrottle();
      await runAutoScrape();
      const data = await issueService.getCivicInsights();
      setInsights(data);
      const t = getLastScrapeTime();
      setLastScrapeTime(t);
      if (t) setMinutesAgo(Math.floor((Date.now() - t.getTime()) / 60000));
    } catch (error) {
      console.error('Error rescanning:', error);
    } finally {
      setIsRescanning(false);
    }
  };

  const getIconForType = (type: string) => {
    switch (type) {
      case 'anomaly': return <TrendingUp className="w-5 h-5" />;
      case 'cluster': return <Group className="w-5 h-5" />;
      case 'prediction': return <CalendarClock className="w-5 h-5" />;
      default: return <BrainCircuit className="w-5 h-5" />;
    }
  };

  const getColorForSeverity = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-700 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      default: return 'bg-blue-100 text-blue-700 border-blue-200';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
                <h1 className="text-2xl font-bold text-slate-900 flex items-center">
                <BrainCircuit className="w-6 h-6 mr-2 text-primary-600" />
                Civic Intelligence Feed
                </h1>
                <p className="text-sm text-slate-500 mt-1">
                AI automatically scrapes the web for nearby civic issues and posts them here.
                </p>
            </div>
            
            <div className="mt-4 md:mt-0 flex items-center gap-3">
              {/* Live status indicator */}
              <div className="flex items-center gap-2 text-sm text-slate-500 bg-slate-50 border border-slate-200 px-3 py-2 rounded-md">
                <Wifi className="w-4 h-4 text-green-500" />
                {lastScrapeTime
                  ? <span>AI scanned <strong>{minutesAgo === 0 ? 'just now' : `${minutesAgo}m ago`}</strong></span>
                  : <span className="text-slate-400">Scanning on startup…</span>
                }
              </div>
              {/* Force re-scan (bypasses 30-min throttle) */}
              <button
                onClick={handleForceRescan}
                disabled={isRescanning || isLoading}
                title="Force a fresh web scrape now"
                className={`flex items-center px-3 py-2 rounded-md text-white text-sm font-medium shadow-sm transition-all
                  ${isRescanning || isLoading ? 'bg-slate-400 cursor-not-allowed' : 'bg-primary-600 hover:bg-primary-700 hover:shadow-md'}`}
              >
                <RefreshCw className={`w-4 h-4 mr-1.5 ${isRescanning ? 'animate-spin' : ''}`} />
                {isRescanning ? 'Scanning…' : 'Rescan Now'}
              </button>
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          [1, 2, 3].map(i => (
            <Card key={i} className="animate-pulse">
              <CardContent className="h-48 flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-slate-200 rounded-full border-t-primary-500 animate-spin"></div>
              </CardContent>
            </Card>
          ))
        ) : (
          insights.map((insight) => (
            <Card key={insight.id} className={`border-l-4 ${
              insight.severity === 'critical' ? 'border-l-red-500' :
              insight.severity === 'high' ? 'border-l-orange-500' :
              'border-l-yellow-500'
            }`}>
              <CardHeader className="pb-3 bg-white border-b border-slate-50 flex flex-row items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className={`p-2 rounded-lg border ${getColorForSeverity(insight.severity)}`}>
                    {getIconForType(insight.type)}
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 leading-tight">{insight.title}</h3>
                    <p className="text-xs text-slate-500 capitalize">{insight.type} Detection</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <p className="text-sm text-slate-600 mb-4 line-clamp-3">
                  {insight.description}
                </p>
                <div className="bg-slate-50 rounded-md p-3 border border-slate-100">
                  <p className="text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1 flex items-center">
                    <AlertTriangle className="w-3 h-3 mr-1" /> AI Recommendation
                  </p>
                  <p className="text-sm text-slate-800">
                    {insight.actionSuggested}
                  </p>
                </div>
                <div className="mt-4 flex justify-between items-center text-xs text-slate-400">
                  <span>Detected {new Date(insight.timestamp).toLocaleString()}</span>
                  <span className="font-medium text-slate-500">Confidence: 92%</span>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
