import { useState, useEffect } from 'react';
import { MapPin, AlertTriangle, Clock } from 'lucide-react';
import { Card, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { MapViewer } from '../../components/map/MapViewer';
import { issueService } from '../../services/mock/issueService';
import type { Issue } from '../../types';

export function ExplorePage() {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // In a real app we'd fetch all public issues, here we'll just fetch user 1's issues as mock data
    const fetchIssues = async () => {
      try {
        const data = await issueService.getIssuesByReporter('usr_1');
        setIssues(data);
      } catch (error) {
        console.error('Failed to fetch public issues', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchIssues();
  }, []);

  return (
    <div className="bg-slate-50 min-h-[calc(100vh-130px)] py-8">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Explore Civic Issues</h1>
            <p className="mt-2 text-slate-600">See what's being reported and resolved in your community.</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">Filter by Status</Button>
            <Button variant="outline">Filter by Category</Button>
          </div>
        </div>

        {/* Interactive Map */}
        <div className="mb-8">
          {isLoading ? (
            <div className="w-full h-96 bg-slate-200 rounded-xl flex items-center justify-center animate-pulse">
              <span className="text-slate-500">Loading Map...</span>
            </div>
          ) : (
            <MapViewer issues={issues} className="h-96 w-full rounded-xl z-0" />
          )}
        </div>

        {/* List View */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {isLoading ? (
            <div className="col-span-full py-12 text-center text-slate-500">Loading issues...</div>
          ) : issues.map((issue) => (
            <Card key={issue.id} className="flex flex-col h-full hover:shadow-md transition-shadow cursor-pointer">
              <div className="relative h-48 w-full bg-slate-200">
                <img 
                  src={issue.imageUrl || 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&q=80&w=400'} 
                  alt={issue.description} 
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute top-2 right-2 px-2 py-1 text-xs font-semibold rounded-full bg-white text-slate-800 shadow-sm">
                  {issue.category}
                </div>
              </div>
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
          ))}
        </div>

      </div>
    </div>
  );
}
