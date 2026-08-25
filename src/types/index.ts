// User Roles and Basic Info
export type UserRole = 'CITIZEN' | 'AUTHORITY' | 'ADMIN' | 'JOURNALIST';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  createdAt: string;
}

// Issue Core Types
export type IssueCategory = 
  | 'Pothole'
  | 'Road Damage'
  | 'Garbage Accumulation'
  | 'Broken Streetlight'
  | 'Water Leakage'
  | 'Drainage Blockage'
  | 'Flooding'
  | 'Fallen Tree'
  | 'Traffic Signal'
  | 'Illegal Dumping'
  | 'Other';

export type IssueStatus = 
  | 'Submitted'
  | 'Under Review'
  | 'Verified'
  | 'Assigned'
  | 'In Progress'
  | 'Resolved'
  | 'Rejected';

export type IssueSeverity = 'low' | 'medium' | 'high' | 'critical';

export type IssueSourcePlatform = 'reddit' | 'x' | 'news_site' | 'municipal_portal' | 'user_report' | 'ai_bot';

export interface Location {
  latitude: number;
  longitude: number;
  address?: string;
  area?: string;
  city?: string;
  district?: string;
  state?: string;
  country?: string;
}

export interface AIAnalysis {
  category: IssueCategory;
  confidence: number; // 0-100
  severity: IssueSeverity;
  authenticityAssessment: 'Likely Authentic' | 'Needs Review' | 'Likely Fake';
  duplicateProbability: number; // 0-100
  reason?: string;
  status: 'Pending' | 'Processing' | 'Completed' | 'Failed';
  processedAt?: string;
}

export interface Issue {
  id: string;
  category: IssueCategory;
  description: string;
  imageUrl?: string;
  location: Location;
  severity: IssueSeverity;
  status: IssueStatus;
  upvotes: number;
  isPetition: boolean;
  hashtags?: string[];
  aiAnalysis?: AIAnalysis;
  department?: string;
  departmentId?: string;
  resolutionPhotoUrl?: string;
  assignedTo?: string; // User ID
  reportedBy: string; // User ID
  
  // Feed enhancements
  sourcePlatform?: IssueSourcePlatform;
  sourceUrl?: string;
  sourceAuthor?: string;
  engagementOrigin?: { upvotes?: number; comments?: number; shares?: number };
  engagementApp?: { likes: number; dislikes: number; saves: number };
  trendingScore?: number;
  scope?: 'local' | 'regional' | 'global';

  createdAt: string;
  updatedAt: string;
  source?: 'user';
}

export interface IssueTimelineEvent {
  id: string;
  issueId: string;
  status: IssueStatus;
  description?: string;
  timestamp: string;
  actorId?: string; // User ID who made the change
}

// Authority & Department Types
export interface Department {
  id: string;
  name: string;
  description?: string;
  activeIssuesCount: number;
}

// Detections from Civic Intelligence
export interface SocialDetection {
  id: string;
  source: 'Public Social Source' | 'News' | 'Other';
  detectedAt: string;
  issueCategory: IssueCategory;
  location: Location;
  confidence: number; // 0-100
  status: 'Needs Review' | 'Verified' | 'Rejected';
  originalUrl?: string;
  imageUrl?: string;
}

export interface CivicInsight {
  id: string;
  type: 'anomaly' | 'cluster' | 'prediction';
  title: string;
  description: string;
  severity: IssueSeverity;
  actionSuggested: string;
  timestamp: string;
  city?: string;
  district?: string;
  state?: string;
  country?: string;
  latitude?: number;
  longitude?: number;
  scope: 'local' | 'regional' | 'global';
  source?: 'live-scrape';
}

// Notifications
export type NotificationType = 'Report Update' | 'Assignment Update' | 'Resolution' | 'System Notification';

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: NotificationType;
  read: boolean;
  createdAt: string;
  link?: string; // URL to navigate to when clicked
}

// Analytics (Mock representation)
export interface AnalyticsData {
  totalReports: number;
  pendingReview: number;
  inProgress: number;
  resolved: number;
  resolutionRate: number; // percentage
  averageResolutionTimeHours: number;
  issuesByCategory: Record<IssueCategory, number>;
  issuesBySeverity: Record<IssueSeverity, number>;
  reportsOverTime: { date: string; count: number }[];
}
