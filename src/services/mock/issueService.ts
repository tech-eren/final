import type { Issue } from '../../types';

const STORAGE_KEY = 'civic_resolve_mock_issues';

// Default mock data
const defaultIssues: Issue[] = [
  {
    id: 'iss_1',
    category: 'Road Damage',
    description: 'Deep pothole causing traffic slowdowns and potential vehicle damage.',
    imageUrl: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&q=80&w=400',
    location: {
      address: 'Central Road, Silchar',
      latitude: 24.8333,
      longitude: 92.7789,
    },
    severity: 'Medium',
    status: 'Submitted',
    upvotes: 45,
    isPetition: false,
    hashtags: ['#pothole', '#traffic', '#roadRepair'],
    reportedBy: 'usr_1',
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'iss_2',
    category: 'Broken Streetlight',
    description: 'Streetlight is flickering and sometimes completely off, making the intersection dangerous at night.',
    imageUrl: 'https://images.unsplash.com/photo-1494522855154-9297ac14b55f?auto=format&fit=crop&q=80&w=400',
    location: {
      address: 'Park Road, Silchar',
      latitude: 24.8350,
      longitude: 92.7800,
    },
    severity: 'High',
    status: 'In Progress',
    upvotes: 152,
    isPetition: true,
    hashtags: ['#lighting', '#safety', '#urgent'],
    reportedBy: 'usr_1',
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'iss_3',
    category: 'Other',
    description: 'Offensive graffiti sprayed on the north wall of the community park.',
    imageUrl: 'https://images.unsplash.com/photo-1550684376-efcbd6e3f031?auto=format&fit=crop&q=80&w=400',
    location: {
      address: 'Sonai Road, Silchar',
      latitude: 24.8310,
      longitude: 92.7750,
    },
    severity: 'Low',
    status: 'Resolved',
    upvotes: 12,
    isPetition: false,
    hashtags: ['#graffiti', '#park'],
    reportedBy: 'usr_1',
    createdAt: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
  },
];

// Initialize from localStorage or use defaults
const initializeIssues = (): Issue[] => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.error('Failed to load issues from localStorage', e);
  }
  return defaultIssues;
};

let mockIssues: Issue[] = initializeIssues();

const saveIssues = () => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(mockIssues));
  } catch (e) {
    console.error('Failed to save issues to localStorage', e);
  }
};

export const issueService = {
  getAllIssues: async (): Promise<Issue[]> => {
    await new Promise((resolve) => setTimeout(resolve, 800));
    return [...mockIssues].sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  },

  getIssuesByReporter: async (reporterId: string): Promise<Issue[]> => {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 800));
    return mockIssues.filter(issue => issue.reportedBy === reporterId).sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  },

  submitIssue: async (data: Partial<Issue> & { title?: string }): Promise<Issue> => {
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    const newIssue: Issue = {
      id: `iss_${Date.now()}`,
      category: data.category || 'Other',
      description: data.description || '',
      imageUrl: data.imageUrl || '',
      location: data.location || { address: 'Unknown', latitude: 0, longitude: 0 },
      severity: data.severity || 'Low',
      status: 'Submitted',
      upvotes: 0,
      isPetition: false,
      hashtags: [],
      reportedBy: 'usr_1', // Hardcoded mock user ID
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    mockIssues = [newIssue, ...mockIssues];
    saveIssues();
    return newIssue;
  },
  
  getDashboardStats: async (reporterId: string) => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const userIssues = mockIssues.filter(issue => issue.reportedBy === reporterId);
    
    return {
      totalReported: userIssues.length,
      inProgress: userIssues.filter(i => i.status === 'In Progress').length,
      resolved: userIssues.filter(i => i.status === 'Resolved').length,
      impactScore: userIssues.length * 10 + userIssues.filter(i => i.status === 'Resolved').length * 20
    };
  },

  getIssuesByDepartment: async (_departmentId: string): Promise<Issue[]> => {
    // In this mock, we just return all issues since we don't have department routing yet
    await new Promise((resolve) => setTimeout(resolve, 800));
    return [...mockIssues].sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  },

  updateIssueStatus: async (issueId: string, newStatus: string): Promise<Issue> => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const issueIndex = mockIssues.findIndex(i => i.id === issueId);
    if (issueIndex === -1) throw new Error('Issue not found');
    
    const updatedIssue = { 
      ...mockIssues[issueIndex], 
      status: newStatus as any,
      updatedAt: new Date().toISOString()
    };
    
    mockIssues[issueIndex] = updatedIssue;
    saveIssues();
    return updatedIssue;
  },

  getCivicInsights: async (): Promise<any[]> => {
    await new Promise((resolve) => setTimeout(resolve, 800));
    return [
      {
        id: 'ins_1',
        type: 'anomaly',
        title: 'Spike in Road Damage Reports',
        description: 'A 24% increase in pothole reports detected along the 4th Avenue corridor over the last 48 hours.',
        severity: 'High',
        actionSuggested: 'Deploy emergency patch crew to 4th Avenue.',
        timestamp: new Date().toISOString()
      },
      {
        id: 'ins_2',
        type: 'cluster',
        title: 'Streetlight Outage Cluster',
        description: '3 independent reports of broken streetlights in the Downtown zone suggest a systemic grid issue rather than isolated bulb failures.',
        severity: 'Medium',
        actionSuggested: 'Dispatch electrical team to inspect Downtown sector substation.',
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 'ins_3',
        type: 'prediction',
        title: 'Flood Risk: Centennial Park',
        description: 'Based on weather forecasts and historical drainage failure data, there is an 85% probability of localized flooding near Centennial Park this weekend.',
        severity: 'Critical',
        actionSuggested: 'Preemptively clear storm drains in Sector 7.',
        timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString()
      }
    ];
  },

  getSystemAnalytics: async () => {
    await new Promise((resolve) => setTimeout(resolve, 600));

    const totalReports = mockIssues.length;
    const pendingReview = mockIssues.filter(i => i.status === 'Submitted').length;
    const inProgress = mockIssues.filter(i => i.status === 'In Progress').length;
    const resolved = mockIssues.filter(i => i.status === 'Resolved').length;

    const resolutionRate = totalReports > 0 ? Number(((resolved / totalReports) * 100).toFixed(1)) : 0;

    let avgResolutionTime = 0;
    const resolvedIssues = mockIssues.filter(i => i.status === 'Resolved');
    if (resolvedIssues.length > 0) {
      const totalTimeMs = resolvedIssues.reduce((sum, issue) => {
        return sum + (new Date(issue.updatedAt).getTime() - new Date(issue.createdAt).getTime());
      }, 0);
      avgResolutionTime = Number((totalTimeMs / resolvedIssues.length / (1000 * 60 * 60)).toFixed(1));
    }

    const issuesByCategory: Record<string, number> = {};
    const issuesBySeverity: Record<string, number> = {
      'Low': 0, 'Medium': 0, 'High': 0, 'Critical': 0
    };

    const reportsOverTime: { date: string; count: number }[] = [];
    const now = Date.now();
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now - i * 24 * 60 * 60 * 1000);
      const dateStr = d.toLocaleDateString('en-US', { weekday: 'short' });
      reportsOverTime.push({ date: dateStr, count: 0 });
    }

    mockIssues.forEach(issue => {
      issuesByCategory[issue.category] = (issuesByCategory[issue.category] || 0) + 1;
      
      if (issuesBySeverity[issue.severity] !== undefined) {
        issuesBySeverity[issue.severity]++;
      } else {
        issuesBySeverity[issue.severity] = 1;
      }

      const issueTime = new Date(issue.createdAt).getTime();
      const diffDays = Math.floor((now - issueTime) / (1000 * 60 * 60 * 24));
      
      if (diffDays >= 0 && diffDays < 7) {
        const targetIndex = 6 - diffDays;
        if (targetIndex >= 0 && targetIndex < 7) {
          reportsOverTime[targetIndex].count++;
        }
      }
    });

    return {
      totalReports,
      pendingReview,
      inProgress,
      resolved,
      resolutionRate,
      averageResolutionTimeHours: avgResolutionTime,
      issuesByCategory,
      issuesBySeverity,
      reportsOverTime
    };
  }
};
