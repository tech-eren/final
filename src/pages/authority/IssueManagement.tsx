import { useState, useEffect, useRef } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { useToast } from '../../context/ToastContext';
import { Search, Filter, AlertTriangle, MoreVertical, CheckCircle2, ListTodo, ThumbsUp, Upload, X } from 'lucide-react';
import { issueService } from '../../services/issueService';
import type { Issue } from '../../types';

export function IssueManagement() {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const { addToast } = useToast();

  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [deptSelection, setDeptSelection] = useState<string>('');
  const [statusSelection, setStatusSelection] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchIssues();
  }, []);

  const fetchIssues = async () => {
    setIsLoading(true);
    try {
      const data = await issueService.getIssuesByDepartment('dept_1');
      setIssues(data.sort((a, b) => b.upvotes - a.upvotes));
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

  const handleResetStatus = async (issueId: string) => {
    try {
      await issueService.updateIssueStatus(issueId, 'Submitted');
      addToast({ 
        title: 'Status Reset', 
        message: `Issue reset to Submitted`,
        type: 'success' 
      });
      fetchIssues(); // Refresh the list
    } catch (error) {
      addToast({ title: 'Failed to reset status', type: 'error' });
    }
  };

  const openDetailModal = (issue: Issue) => {
    setSelectedIssue(issue);
    setDeptSelection(issue.department || '');
    setStatusSelection(issue.status);
    setPreviewUrl(issue.resolutionPhotoUrl || '');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleSaveDetails = async () => {
    if (!selectedIssue) return;
    try {
      const updates: Partial<Issue> = {
        department: deptSelection,
        status: statusSelection as any
      };
      if (statusSelection === 'Resolved' && previewUrl) {
        updates.resolutionPhotoUrl = previewUrl;
      }
      await issueService.updateIssue(selectedIssue.id, updates);
      addToast({ title: 'Issue Updated', type: 'success' });
      setSelectedIssue(null);
      setPreviewUrl('');
      fetchIssues();
    } catch (e) {
      addToast({ title: 'Failed to update issue', type: 'error' });
    }
  };

  const [locationFilter, setLocationFilter] = useState<string>('all');

  const filteredIssues = issues.filter(issue => {
    const searchLower = searchTerm.toLowerCase();
    const addressLower = issue.location.address?.toLowerCase() || '';
    
    const matchesSearch = 
      issue.category.toLowerCase().includes(searchLower) ||
      issue.description.toLowerCase().includes(searchLower) ||
      addressLower.includes(searchLower);

    let matchesLocation = true;
    if (locationFilter === 'local') {
      matchesLocation = addressLower.includes('silchar') || addressLower.includes('cachar');
    } else if (locationFilter === 'regional') {
      matchesLocation = addressLower.includes('assam');
    }
    
    return matchesSearch && matchesLocation;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Issue Management</h1>
          <p className="text-sm text-slate-500">Triage, assign, and update reported issues.</p>
        </div>
        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64 min-w-[200px]">
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
          <div className="relative flex-shrink-0 min-w-[160px]">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Filter className="h-4 w-4 text-slate-400" />
            </div>
            <select
              className="block w-full pl-10 pr-8 py-2 border border-slate-300 rounded-md leading-5 bg-white text-slate-900 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm appearance-none cursor-pointer"
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
            >
              <option value="all">All Locations</option>
              <option value="local">Nearby (Silchar)</option>
              <option value="regional">Regional (Assam)</option>
            </select>
          </div>
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
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Upvotes
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
                  <tr key={issue.id} className="hover:bg-slate-50 transition-colors cursor-pointer" onClick={() => openDetailModal(issue)}>
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
                        {issue.severity === 'critical' && <AlertTriangle className="w-4 h-4 text-red-500 mr-1.5" />}
                        <span className="text-sm text-slate-900">{issue.severity}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-slate-700">
                        <ThumbsUp className="w-4 h-4 mr-2" />
                        <span className="text-sm font-medium">{issue.upvotes}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium" onClick={(e) => e.stopPropagation()}>
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
                        <div className="relative">
                          <button 
                            className="text-slate-400 hover:text-slate-600 transition-colors p-1"
                            onClick={() => setOpenDropdownId(openDropdownId === issue.id ? null : issue.id)}
                          >
                            <MoreVertical className="w-5 h-5" />
                          </button>
                          {openDropdownId === issue.id && (
                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-slate-200">
                              <div className="py-1">
                                <button
                                  onClick={() => {
                                    handleResetStatus(issue.id);
                                    setOpenDropdownId(null);
                                  }}
                                  className="block w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-100"
                                >
                                  Reset to Submitted
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Detail Modal */}
      {selectedIssue && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
              <h2 className="text-lg font-bold text-slate-900">Issue Details</h2>
              <button 
                onClick={() => setSelectedIssue(null)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-200 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">Details</h3>
                  <p className="text-slate-900 font-medium">{selectedIssue.category}</p>
                  <p className="text-slate-700 mt-1">{selectedIssue.description}</p>
                  
                  <div className="mt-4">
                    <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">Location</h3>
                    <p className="text-slate-900">{selectedIssue.location.address}</p>
                  </div>

                  <div className="mt-4">
                    <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">Reporter Info</h3>
                    <p className="text-slate-900">User ID: {selectedIssue.reportedBy}</p>
                  </div>
                </div>
                
                <div>
                  {selectedIssue.imageUrl && (
                    <div className="rounded-lg overflow-hidden border border-slate-200">
                      <img src={selectedIssue.imageUrl} alt="Issue" className="w-full h-auto object-cover max-h-48" />
                    </div>
                  )}
                </div>
              </div>

              <div className="border-t border-slate-200 pt-6 space-y-4">
                <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Management Controls</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Assign Department</label>
                    <select 
                      value={deptSelection}
                      onChange={(e) => setDeptSelection(e.target.value)}
                      className="w-full border-slate-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm p-2 border"
                    >
                      <option value="">Unassigned</option>
                      <option value="Public Works">Public Works</option>
                      <option value="Sanitation">Sanitation</option>
                      <option value="Electrical">Electrical</option>
                      <option value="Parks">Parks</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
                    <select 
                      value={statusSelection}
                      onChange={(e) => setStatusSelection(e.target.value)}
                      className="w-full border-slate-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm p-2 border"
                    >
                      <option value="Submitted">Submitted</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Resolved">Resolved</option>
                    </select>
                  </div>
                </div>

                {statusSelection === 'Resolved' && (
                  <div className="mt-4 p-4 bg-slate-50 border border-slate-200 rounded-lg">
                    <label className="block text-sm font-medium text-slate-700 mb-2">Proof of Resolution Photo</label>
                    <input
                      type="file"
                      accept="image/*"
                      ref={fileInputRef}
                      className="hidden"
                      onChange={handleFileChange}
                    />
                    
                    {previewUrl ? (
                      <div className="relative rounded-lg overflow-hidden h-32 w-full border border-slate-200 mb-2">
                        <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                        <button 
                          onClick={() => setPreviewUrl('')}
                          className="absolute top-2 right-2 p-1 bg-black/50 hover:bg-black/70 text-white rounded-full backdrop-blur-sm"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full h-32 border-2 border-dashed border-slate-300 rounded-lg flex flex-col items-center justify-center text-slate-500 hover:text-slate-700 hover:border-slate-400 hover:bg-white transition-colors"
                      >
                        <Upload className="w-6 h-6 mb-2" />
                        <span className="text-sm font-medium">Upload photo</span>
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
            
            <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex justify-end space-x-3">
              <Button variant="outline" onClick={() => setSelectedIssue(null)}>
                Cancel
              </Button>
              <Button onClick={handleSaveDetails}>
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
