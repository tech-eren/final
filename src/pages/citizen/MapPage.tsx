import { useState, useEffect } from 'react';
import { MapViewer } from '../../components/map/MapViewer';
import { issueService } from '../../services/mock/issueService';
import type { Issue } from '../../types';

export function MapPage() {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchIssues = async () => {
      try {
        const data = await issueService.getIssuesByReporter('usr_1');
        setIssues(data);
      } catch (error) {
        console.error('Failed to fetch issues for map', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchIssues();
  }, []);

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-slate-900">Map View</h1>
        <p className="text-sm text-slate-500">Explore issues reported in your area interactively.</p>
      </div>

      <div className="flex-1 bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden relative">
        {isLoading ? (
          <div className="w-full h-full flex items-center justify-center bg-slate-50 animate-pulse">
            <span className="text-slate-500 font-medium">Loading map data...</span>
          </div>
        ) : (
          <MapViewer 
            issues={issues} 
            className="w-full h-full z-0"
          />
        )}
      </div>
    </div>
  );
}
