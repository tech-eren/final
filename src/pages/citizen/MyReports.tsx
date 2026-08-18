import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, Clock, MapPin } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card, CardContent } from '../../components/ui/Card';
import { issueService } from '../../services/mock/issueService';
import type { Issue } from '../../types';

export function MyReports() {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchIssues = async () => {
      try {
        const data = await issueService.getIssuesByReporter('usr_1');
        setIssues(data);
      } catch (error) {
        console.error('Failed to fetch issues', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchIssues();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-primary-600 rounded-full border-t-transparent animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">My Reports</h1>
          <p className="text-sm text-slate-500">Track the status of the civic issues you have reported.</p>
        </div>
        <Link to="/citizen/report">
          <Button>Report New Issue</Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {issues.length === 0 ? (
          <div className="col-span-full p-12 text-center bg-white border border-slate-200 rounded-lg border-dashed">
            <h3 className="text-lg font-medium text-slate-900 mb-2">No reports yet</h3>
            <p className="text-slate-500 mb-4">You haven't reported any issues yet. Help improve your community today.</p>
            <Link to="/citizen/report">
              <Button variant="outline">Report an Issue</Button>
            </Link>
          </div>
        ) : (
          issues.map((issue) => (
            <Card key={issue.id} className="flex flex-col h-full">
              {issue.imageUrl ? (
                <div className="relative h-48 w-full bg-slate-200">
                  <img 
                    src={issue.imageUrl} 
                    alt={issue.category} 
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <div className="absolute top-2 right-2 px-2 py-1 text-xs font-semibold rounded-full bg-white text-slate-800 shadow-sm">
                    {issue.category}
                  </div>
                </div>
              ) : (
                <div className="h-48 w-full bg-slate-100 flex items-center justify-center text-slate-400">
                  No Image Available
                </div>
              )}
              <CardContent className="flex flex-col flex-grow">
                <h3 className="text-lg font-bold text-slate-900 line-clamp-1">{issue.category}</h3>
                
                <div className="flex items-center mt-2 text-sm text-slate-500">
                  <MapPin className="w-4 h-4 mr-1 flex-shrink-0" />
                  <span className="truncate">{issue.location.address}</span>
                </div>
                
                <div className="flex items-center mt-1 text-sm text-slate-500">
                  <Clock className="w-4 h-4 mr-1 flex-shrink-0" />
                  <span>{new Date(issue.createdAt).toLocaleDateString()}</span>
                </div>

                <div className="mt-auto pt-4 flex items-center justify-between">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
                    ${issue.status === 'Submitted' ? 'bg-red-100 text-red-800' : 
                      issue.status === 'In Progress' ? 'bg-yellow-100 text-yellow-800' : 
                      'bg-green-100 text-green-800'}`
                  }>
                    {issue.status === 'Submitted' && <AlertTriangle className="w-3 h-3 mr-1" />}
                    {issue.status}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
