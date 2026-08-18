import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FileText, CheckCircle2, Clock, Trophy, Plus, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardHeader } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { issueService } from '../../services/mock/issueService';
import type { Issue } from '../../types';

export function Dashboard() {
  const [stats, setStats] = useState({ totalReported: 0, inProgress: 0, resolved: 0, impactScore: 0 });
  const [recentIssues, setRecentIssues] = useState<Issue[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [dashboardStats, issues] = await Promise.all([
          issueService.getDashboardStats('usr_1'),
          issueService.getIssuesByReporter('usr_1')
        ]);
        setStats(dashboardStats);
        setRecentIssues(issues.slice(0, 3)); // Just show top 3 recent
      } catch (error) {
        console.error('Failed to fetch dashboard data', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
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
          <h1 className="text-2xl font-bold text-slate-900">Welcome back, Citizen</h1>
          <p className="text-sm text-slate-500">Here is your civic impact summary.</p>
        </div>
        <Link to="/citizen/report">
          <Button icon={Plus}>Report Issue</Button>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-6 flex items-center space-x-4">
            <div className="p-3 bg-blue-100 rounded-full">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Total Reported</p>
              <p className="text-2xl font-bold text-slate-900">{stats.totalReported}</p>
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
              <p className="text-2xl font-bold text-slate-900">{stats.inProgress}</p>
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
              <p className="text-2xl font-bold text-slate-900">{stats.resolved}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 flex items-center space-x-4">
            <div className="p-3 bg-purple-100 rounded-full">
              <Trophy className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Impact Score</p>
              <p className="text-2xl font-bold text-slate-900">{stats.impactScore}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between py-4">
          <h2 className="text-lg font-medium text-slate-900">Recent Activity</h2>
          <Link to="/citizen/reports" className="text-sm font-medium text-primary-600 hover:text-primary-700 flex items-center">
            View all <ArrowRight className="w-4 h-4 ml-1" />
          </Link>
        </CardHeader>
        <div className="divide-y divide-slate-200">
          {recentIssues.length === 0 ? (
            <div className="p-6 text-center text-slate-500">
              No recent activity found. Start by reporting an issue!
            </div>
          ) : (
            recentIssues.map((issue) => (
              <div key={issue.id} className="flex items-center justify-between p-4 sm:p-6 hover:bg-slate-50 transition-colors">
                <div className="flex flex-col sm:flex-row sm:items-center min-w-0 flex-1">
                  <div className="sm:w-3/12 min-w-0 pr-4">
                    <p className="text-sm font-medium text-slate-900 truncate">{issue.category}</p>
                    <p className="text-xs text-slate-500 truncate">{issue.location.address}</p>
                  </div>
                  <div className="mt-2 sm:mt-0 sm:w-2/12">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
                      ${issue.status === 'Submitted' ? 'bg-red-100 text-red-800' : 
                        issue.status === 'In Progress' ? 'bg-yellow-100 text-yellow-800' : 
                        'bg-green-100 text-green-800'}`
                    }>
                      {issue.status}
                    </span>
                  </div>
                  <div className="mt-2 sm:mt-0 sm:w-3/12 hidden md:block">
                    <p className="text-xs text-slate-500">{new Date(issue.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </Card>
    </div>
  );
}
