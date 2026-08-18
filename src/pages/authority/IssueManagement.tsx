import { useState, useEffect } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { useToast } from '../../context/ToastContext';
import { Search, Filter, AlertTriangle, MoreVertical, CheckCircle2, ListTodo } from 'lucide-react';
import { issueService } from '../../services/mock/issueService';
import type { Issue } from '../../types';

export function IssueManagement() {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { addToast } = useToast();

  useEffect(() => {
    fetchIssues();
  }, []);

  const fetchIssues = async () => {
    setIsLoading(true);
    try {
      const data = await issueService.getIssuesByDepartment('dept_1');
      setIssues(data);
    } catch (error) {
      console.error('Failed to fetch authority issues', error);
      addToast({ title: 'Failed to fetch issues', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateStatus = async (issueId: string, currentStatus: string) => {
    // Simple state machine for the mock: Submitted -> In Progress -> Resolved
    let newStatus: any = 'In Progress';
    if (currentStatus === 'In Progress') newStatus = 'Resolved';
    if (currentStatus === 'Resolved') return; // Cannot progress past resolved in this simple flow

    try {
      await issueService.updateIssueStatus(issueId, newStatus);
      addToast({ 
        title: 'Status Updated', 
        message: `Issue marked as ${newStatus}`,
        type: 'success' 
      });
      fetchIssues(); // Refresh the list
    } catch (error) {
      addToast({ title: 'Failed to update status', type: 'error' });
    }
  };

  const filteredIssues = issues.filter(issue => 
    issue.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    issue.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    issue.location.address?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Issue Management</h1>
          <p className="text-sm text-slate-500">Triage, assign, and update reported issues.</p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-slate-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-slate-300 rounded-md leading-5 bg-white placeholder-slate-500 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              placeholder="Search issues..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant="outline" icon={Filter} className="flex-shrink-0">
            Filter
          </Button>
        </div>
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Issue Details
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Location
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Priority
                </th>
                <th scope="col" className="relative px-6 py-3">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                    <div className="flex justify-center items-center">
                      <div className="w-6 h-6 border-2 border-primary-600 rounded-full border-t-transparent animate-spin mr-2"></div>
                      Loading issues...
                    </div>
                  </td>
                </tr>
              ) : filteredIssues.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                    No issues found matching your criteria.
                  </td>
                </tr>
              ) : (
                filteredIssues.map((issue) => (
                  <tr key={issue.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-slate-100 rounded-md overflow-hidden">
                          {issue.imageUrl ? (
                            <img className="h-10 w-10 object-cover" src={issue.imageUrl} alt="" />
                          ) : (
                            <div className="h-10 w-10 flex items-center justify-center text-slate-400">
                              <AlertTriangle className="h-5 w-5" />
                            </div>
                          )}
                        </div>
                        <div className="ml-4 max-w-xs">
                          <div className="text-sm font-medium text-slate-900 truncate">{issue.category}</div>
                          <div className="text-sm text-slate-500 truncate" title={issue.description}>{issue.description}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-slate-900 max-w-[12rem] truncate" title={issue.location.address}>
                        {issue.location.address || 'Unknown'}
                      </div>
                      <div className="text-sm text-slate-500">{new Date(issue.createdAt).toLocaleDateString()}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
                        ${issue.status === 'Submitted' ? 'bg-red-100 text-red-800' : 
                          issue.status === 'In Progress' ? 'bg-yellow-100 text-yellow-800' : 
                          'bg-green-100 text-green-800'}`
                      }>
                        {issue.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {issue.severity === 'Critical' && <AlertTriangle className="w-4 h-4 text-red-500 mr-1.5" />}
                        <span className="text-sm text-slate-900">{issue.severity}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        {issue.status !== 'Resolved' && (
                          <Button 
                            variant="secondary" 
                            size="sm"
                            onClick={() => handleUpdateStatus(issue.id, issue.status)}
                            icon={issue.status === 'Submitted' ? ListTodo : CheckCircle2}
                          >
                            {issue.status === 'Submitted' ? 'Start Work' : 'Resolve'}
                          </Button>
                        )}
                        <button className="text-slate-400 hover:text-slate-600 transition-colors p-1">
                          <MoreVertical className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
