import type { Issue } from '../../types';

// Mock data storage in memory
let mockIssues: Issue[] = [
  {
    id: 'iss_1',
    category: 'Road Damage',
    description: 'Deep pothole causing traffic slowdowns and potential vehicle damage.',
    imageUrl: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&q=80&w=400',
    location: {
      address: '123 Main St, Downtown',
      latitude: 40.7128,
      longitude: -74.0060,
    },
    severity: 'Medium',
    status: 'Submitted',
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
      address: '4th Avenue & Oak St',
      latitude: 40.7138,
      longitude: -74.0070,
    },
    severity: 'High',
    status: 'In Progress',
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
      address: 'Centennial Park',
      latitude: 40.7158,
      longitude: -74.0090,
    },
    severity: 'Low',
    status: 'Resolved',
    reportedBy: 'usr_1',
    createdAt: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
  },
];

export const issueService = {
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
      reportedBy: 'usr_1', // Hardcoded mock user ID
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    mockIssues = [newIssue, ...mockIssues];
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
    return {
      totalReports: 1245,
      pendingReview: 142,
      inProgress: 350,
      resolved: 753,
      resolutionRate: 60.5,
      averageResolutionTimeHours: 48.2,
      issuesByCategory: {
        'Pothole': 350,
        'Road Damage': 120,
        'Garbage Accumulation': 240,
        'Broken Streetlight': 180,
        'Water Leakage': 95,
        'Drainage Blockage': 110,
        'Flooding': 45,
        'Fallen Tree': 30,
        'Traffic Signal': 55,
        'Illegal Dumping': 20,
        'Other': 0
      },
      issuesBySeverity: {
        'Low': 450,
        'Medium': 520,
        'High': 200,
        'Critical': 75
      },
      reportsOverTime: [
        { date: 'Mon', count: 45 },
        { date: 'Tue', count: 52 },
        { date: 'Wed', count: 48 },
        { date: 'Thu', count: 70 },
        { date: 'Fri', count: 85 },
        { date: 'Sat', count: 35 },
        { date: 'Sun', count: 40 },
      ]
    };
  }
};
