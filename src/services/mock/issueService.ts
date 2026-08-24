import type { Issue } from '../../types';

const STORAGE_KEY = 'civic_resolve_issues_v7';
const STORAGE_KEY_INSIGHTS = 'civic_resolve_insights_v7';

// No seed data — Feed is populated only by real user reports and AI-scraped posts
const defaultIssues: Issue[] = [];

// Initialize from localStorage (starts empty on first load)
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

// No seed data — Intelligence is populated only by real AI scrape results
const defaultInsights: any[] = [];

const initializeInsights = (): any[] => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY_INSIGHTS);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.error('Failed to load insights from localStorage', e);
  }
  return defaultInsights;
};

let mockInsights: any[] = initializeInsights();

const saveInsights = () => {
  try {
    localStorage.setItem(STORAGE_KEY_INSIGHTS, JSON.stringify(mockInsights));
  } catch (e) {
    console.error('Failed to save insights to localStorage', e);
  }
};

export const issueService = {
  getAllIssues: async (): Promise<Issue[]> => {
    await new Promise((resolve) => setTimeout(resolve, 800));
    return [...mockIssues].sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  },

  getFeedIssues: async (feedType: 'nearby' | 'regional' | 'trending', lat?: number, lng?: number, userCity?: string, userDistrict?: string, userState?: string): Promise<{ issues: Issue[], scopeApplied: string }> => {
    await new Promise((resolve) => setTimeout(resolve, 800));
    
    const getDist = (lat1: number, lon1: number, lat2: number, lon2: number) => {
      const R = 6371;
      const dLat = (lat2 - lat1) * Math.PI / 180;
      const dLon = (lon2 - lon1) * Math.PI / 180;
      const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
                Math.sin(dLon/2) * Math.sin(dLon/2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
      return R * c; 
    };

    let filtered = [...mockIssues];
    let scopeApplied = feedType as string;

    const NEARBY_RADIUS_KM = 100;

    const safeMatch = (val1?: string, val2?: string) => {
      if (!val1 || !val2) return false;
      const v1 = val1.trim().toLowerCase();
      const v2 = val2.trim().toLowerCase();
      if (!v1 || !v2) return false;
      return v1.includes(v2) || v2.includes(v1);
    };

    if (feedType === 'nearby') {
      filtered = filtered.filter(i => {
        const hasValidCoords = typeof i.location.latitude === 'number' && typeof i.location.longitude === 'number' && i.location.latitude !== 0 && i.location.longitude !== 0;
        const hasCity = i.location.city || i.location.district;
        
        if (!hasValidCoords && !hasCity) return false;
        
        let isNearby = false;
        if (lat !== undefined && lng !== undefined && hasValidCoords) {
           const dist = getDist(lat, lng, i.location.latitude, i.location.longitude);
           if (dist <= NEARBY_RADIUS_KM) isNearby = true;
        }
        
        if (!isNearby) {
           const cityMatch = safeMatch(i.location.city, userCity);
           const distMatch = safeMatch(i.location.district, userDistrict);
           // Also cross-check because AI might put district in the city field
           const crossMatch1 = safeMatch(i.location.city, userDistrict);
           const crossMatch2 = safeMatch(i.location.district, userCity);
           
           if (cityMatch || distMatch || crossMatch1 || crossMatch2) {
             isNearby = true;
           }
        }
        return isNearby;
      });
    } else if (feedType === 'regional') {
      filtered = filtered.filter(i => {
        if (!i.location.state) return false;
        return safeMatch(i.location.state, userState);
      });
    }

    if (feedType === 'trending') {
      filtered.sort((a, b) => {
        const scoreA = (a.trendingScore || 0) + (a.upvotes || 0);
        const scoreB = (b.trendingScore || 0) + (b.upvotes || 0);
        return scoreB - scoreA;
      });
    } else {
      filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    return { issues: filtered, scopeApplied };
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
      severity: data.severity || 'low',
      status: 'Submitted',
      upvotes: 0,
      isPetition: false,
      hashtags: [],
      reportedBy: 'usr_1', // Hardcoded mock user ID
      sourcePlatform: 'user_report',
      engagementApp: { likes: 0, dislikes: 0, saves: 0 },
      trendingScore: 0,
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

  updateIssue: async (issueId: string, updates: Partial<Issue>): Promise<Issue> => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const issueIndex = mockIssues.findIndex(i => i.id === issueId);
    if (issueIndex === -1) throw new Error('Issue not found');
    
    const updatedIssue = { 
      ...mockIssues[issueIndex], 
      ...updates,
      updatedAt: new Date().toISOString()
    };
    
    mockIssues[issueIndex] = updatedIssue;
    saveIssues();
    return updatedIssue;
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
    return [...mockInsights].sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  },

  addCivicInsights: async (newInsights: any[], userLat?: number, userLng?: number): Promise<any[]> => {
    mockInsights = [...newInsights, ...mockInsights];
    saveInsights();

    // Use the user's real GPS if provided, otherwise fall back to Silchar city centre
    const baseLat = userLat ?? 24.8333;
    const baseLng = userLng ?? 92.7789;

    // Convert AI insights into actionable Issues for the Feed
    const newIssues = newInsights.map((insight, idx) => {
      let category: any = 'Other';
      const text = (insight.title + ' ' + insight.description).toLowerCase();
      if (text.includes('water') || text.includes('pipe')) category = 'Water Leakage';
      else if (text.includes('traffic') || text.includes('signal')) category = 'Traffic Signal';
      else if (text.includes('pothole') || text.includes('crater') || text.includes('road')) category = 'Road Damage';
      else if (text.includes('garbage') || text.includes('trash')) category = 'Garbage Accumulation';
      else if (text.includes('light')) category = 'Broken Streetlight';

      let source: any = 'news_site';
      if (text.includes('reddit')) source = 'reddit';
      else if (text.includes('twitter') || text.includes('tweet') || text.includes(' x ')) source = 'x';

      // Always mark as ai_bot so Feed renders the distinct 🤖 AI Detected badge
      const sourcePlatform: any = 'ai_bot';

      // Small jitter (~0-2km) so pins don't all stack on top of each other on the map
      const jitterLat = (Math.random() - 0.5) * 0.03;
      const jitterLng = (Math.random() - 0.5) * 0.03;

      return {
        id: `iss_ai_${Date.now()}_${idx}`,
        category,
        description: `[AI Detected Insight] ${insight.title}\n\n${insight.description}`,
        location: {
          address: [insight.city, insight.district, insight.state].filter(Boolean).join(', ') || 'Location Unknown',
          latitude: typeof insight.latitude === 'number' ? insight.latitude : 0,
          longitude: typeof insight.longitude === 'number' ? insight.longitude : 0,
          city: insight.city,
          district: insight.district,
          state: insight.state,
          country: insight.country,
        },
        scope: insight.scope,
        severity: insight.severity || 'medium',
        status: 'Submitted',
        upvotes: Math.floor(Math.random() * 150) + 20,
        isPetition: false,
        reportedBy: 'sys_ai',
        sourcePlatform,
        engagementApp: { likes: 0, dislikes: 0, saves: 0 },
        trendingScore: Math.floor(Math.random() * 300) + 100,
        createdAt: insight.timestamp,
        updatedAt: insight.timestamp,
      };
    });

    if (newIssues.length > 0) {
      mockIssues = [...newIssues, ...mockIssues];
      saveIssues();
    }

    return mockInsights;
  },

  /**
   * Removes stale AI-generated issues from the cache (e.g. old Mumbai/Delhi data).
   * Call this once at startup to ensure a clean slate.
   */
  clearStaleAiIssues: () => {
    const before = mockIssues.length;
    // Remove any AI-generated issue whose location address is the old generic string
    // or whose description contains content from cities we no longer target
    mockIssues = mockIssues.filter(issue => {
      if (issue.reportedBy !== 'sys_ai') return true; // keep real user reports
      const desc = (issue.description || '').toLowerCase();
      // Drop if it looks like it's from the old Mumbai/Delhi era
      const isStale = desc.includes('yamuna') || desc.includes('mumbai') || desc.includes('bandra')
        || desc.includes('andheri') || desc.includes('noida') || desc.includes('jvlr')
        || issue.location?.address === 'Local Area (Detected)'; // old address string
      return !isStale;
    });
    if (mockIssues.length !== before) {
      console.log(`[IssueService] Cleared ${before - mockIssues.length} stale AI issues from cache.`);
      saveIssues();
    }
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
      'low': 0, 'medium': 0, 'high': 0, 'critical': 0
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
