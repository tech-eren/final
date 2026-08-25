import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '../../components/ui/Card';
import { AlertTriangle, Clock, CheckCircle2, ListTodo } from 'lucide-react';
import { MapViewer } from '../../components/map/MapViewer';
import { issueService } from '../../services/issueService';
import type { Issue } from '../../types';

export function Dashboard() {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchIssues = async () => {
      try {
        const data = await issueService.getIssuesByDepartment('dept_1');
        setIssues(data);
      } catch (error) {
        console.error('Failed to fetch authority issues', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchIssues();
  }, []);

  const totalIssues = issues.length;
  const criticalIssues = issues.filter(i => i.severity === 'critical').length;
  const inProgress = issues.filter(i => i.status === 'In Progress').length;
  const resolved = issues.filter(i => i.status === 'Resolved').length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Authority Overview</h1>
        <p className="text-sm text-slate-500">Monitor and manage city infrastructure issues.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-6 flex items-center space-x-4">
            <div className="p-3 bg-slate-100 rounded-full">
              <ListTodo className="w-6 h-6 text-slate-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Total Active</p>
              <p className="text-2xl font-bold text-slate-900">{totalIssues}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 flex items-center space-x-4">
            <div className="p-3 bg-red-100 rounded-full">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Critical Priority</p>
              <p className="text-2xl font-bold text-slate-900">{criticalIssues}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 flex items-center space-x-4">
            <div className="p-3 bg-yellow-100 rounded-full">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">In Progress</p>
              <p className="text-2xl font-bold text-slate-900">{inProgress}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 flex items-center space-x-4">
            <div className="p-3 bg-green-100 rounded-full">
              <CheckCircle2 className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Resolved</p>
              <p className="text-2xl font-bold text-slate-900">{resolved}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <h2 className="text-lg font-medium text-slate-900">Incident Heatmap</h2>
          </CardHeader>
          <CardContent className="p-0 h-96 relative">
            {isLoading ? (
              <div className="absolute inset-0 flex items-center justify-center bg-slate-50 animate-pulse">
                <span className="text-slate-500">Loading Map...</span>
              </div>
            ) : (
              <MapViewer issues={issues} className="h-full w-full rounded-b-xl z-0" />
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h2 className="text-lg font-medium text-slate-900">Recent Reports</h2>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {issues.slice(0, 5).map((issue) => (
                <div key={issue.id} className="flex items-start space-x-3 pb-4 border-b border-slate-100 last:border-0 last:pb-0">
                  <div className={`p-2 rounded-full flex-shrink-0
                    ${issue.severity === 'critical' ? 'bg-red-100 text-red-600' : 
                      issue.severity === 'high' ? 'bg-orange-100 text-orange-600' : 
                      'bg-slate-100 text-slate-600'}`}
                  >
                    <AlertTriangle className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-900">{issue.category}</p>
                    <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">{issue.location.address}</p>
                    <p className="text-xs text-slate-400 mt-1">{new Date(issue.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
              ))}
              {issues.length === 0 && !isLoading && (
                <p className="text-sm text-slate-500 text-center py-4">No recent reports.</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
