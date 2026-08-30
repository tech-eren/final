import React, { createContext, useContext, useState, useEffect } from 'react';

export interface UserSettings {
  profile: {
    phoneNumber: string;
    bio: string;
  };
  notifications: {
    reportSubmitted: boolean;
    reportVerified: boolean;
    reportAssigned: boolean;
    reportStatusChanged: boolean;
    reportResolved: boolean;
    commentOnReport: boolean;
    communityReplies: boolean;
    communitySupport: boolean;
    petitionUpdates: boolean;
    nearbyIssues: boolean;
    trendingIssues: boolean;
    platformAnnouncements: boolean;
    productUpdates: boolean;
    securityAlerts: boolean;
    inApp: boolean;
    email: boolean;
    push: boolean;
    quietHoursEnabled: boolean;
    quietHoursStart: string;
    quietHoursEnd: string;
  };
  privacy: {
    profileVisibility: 'public' | 'registered' | 'private';
    showNameOnReports: boolean;
    allowFollowing: boolean;
    showOnDiscussions: boolean;
    locationPrivacy: 'exact' | 'approximate' | 'hidden';
    defaultToAnonymous: boolean;
  };
  reporting: {
    defaultCategory: string;
    defaultVisibility: 'public' | 'anonymous' | 'private';
    autoUseLocation: boolean;
    askLocationEveryTime: boolean;
    allowPhotos: boolean;
    allowVideos: boolean;
    notifyOnSubmit: boolean;
    notifyOnVerify: boolean;
    notifyOnAssign: boolean;
    notifyOnInProgress: boolean;
    notifyOnResolve: boolean;
  };
  location: {
    accessEnabled: boolean;
    defaultCity: string;
    defaultArea: string;
    nearbyRadius: number;
    notifyImportantNearby: boolean;
  };
  feed: {
    issuesCareAbout: string[];
    showNearby: boolean;
    showTrending: boolean;
    showRecent: boolean;
    showVerified: boolean;
    showGovernment: boolean;
    showDiscussions: boolean;
    showPetitions: boolean;
    sortBy: 'trending' | 'recent' | 'nearest' | 'supported';
    hideResolved: boolean;
    hideDuplicates: boolean;
  };
  ai: {
    enabled: boolean;
    helpWrite: boolean;
    improveDescriptions: boolean;
    suggestCategories: boolean;
    detectDuplicates: boolean;
    summarizeIssues: boolean;
    explainResponses: boolean;
    findRelated: boolean;
    useActivityForPersonalization: boolean;
    responseStyle: 'concise' | 'balanced' | 'detailed';
  };
  appearance: {
    theme: 'dark' | 'light' | 'system';
    accentColor: 'purple' | 'blue' | 'green';
    density: 'compact' | 'comfortable';
  };
  accessibility: {
    reduceAnimations: boolean;
    highContrast: boolean;
    largerText: boolean;
    screenReader: boolean;
    keyboardNav: boolean;
    reduceTransparency: boolean;
  };
  language: {
    interfaceLanguage: string;
  };
}

export interface UserData {
  id: string;
  displayName: string;
  email: string;
  isAnonymous: boolean;
  likedIssues: string[];
  dislikedIssues: string[];
  savedIssues: string[];
  settings: UserSettings;
}

interface UserContextType {
  user: UserData;
  updateUser: (data: Partial<UserData>) => void;
  updateSettings: (section: keyof UserSettings, data: any) => void;
  toggleAnonymity: () => void;
  toggleLike: (issueId: string) => void;
  toggleDislike: (issueId: string) => void;
  toggleSave: (issueId: string) => void;
}

const defaultSettings: UserSettings = {
  profile: {
    phoneNumber: '',
    bio: ''
  },
  notifications: {
    reportSubmitted: true,
    reportVerified: true,
    reportAssigned: true,
    reportStatusChanged: true,
    reportResolved: true,
    commentOnReport: true,
    communityReplies: true,
    communitySupport: true,
    petitionUpdates: false,
    nearbyIssues: true,
    trendingIssues: true,
    platformAnnouncements: true,
    productUpdates: false,
    securityAlerts: true,
    inApp: true,
    email: true,
    push: false,
    quietHoursEnabled: false,
    quietHoursStart: '23:00',
    quietHoursEnd: '07:00'
  },
  privacy: {
    profileVisibility: 'public',
    showNameOnReports: true,
    allowFollowing: true,
    showOnDiscussions: true,
    locationPrivacy: 'exact',
    defaultToAnonymous: false
  },
  reporting: {
    defaultCategory: 'Roads',
    defaultVisibility: 'public',
    autoUseLocation: true,
    askLocationEveryTime: false,
    allowPhotos: true,
    allowVideos: true,
    notifyOnSubmit: true,
    notifyOnVerify: true,
    notifyOnAssign: true,
    notifyOnInProgress: true,
    notifyOnResolve: true
  },
  location: {
    accessEnabled: true,
    defaultCity: 'Silchar',
    defaultArea: 'Tarapur',
    nearbyRadius: 5,
    notifyImportantNearby: true
  },
  feed: {
    issuesCareAbout: ['Roads', 'Water', 'Electricity'],
    showNearby: true,
    showTrending: true,
    showRecent: true,
    showVerified: true,
    showGovernment: true,
    showDiscussions: true,
    showPetitions: true,
    sortBy: 'trending',
    hideResolved: false,
    hideDuplicates: true
  },
  ai: {
    enabled: true,
    helpWrite: true,
    improveDescriptions: true,
    suggestCategories: true,
    detectDuplicates: true,
    summarizeIssues: true,
    explainResponses: true,
    findRelated: true,
    useActivityForPersonalization: true,
    responseStyle: 'concise'
  },
  appearance: {
    theme: 'dark',
    accentColor: 'purple',
    density: 'comfortable'
  },
  accessibility: {
    reduceAnimations: false,
    highContrast: false,
    largerText: false,
    screenReader: false,
    keyboardNav: true,
    reduceTransparency: false
  },
  language: {
    interfaceLanguage: 'en'
  }
};

const defaultUser: UserData = {
  id: 'user-1',
  displayName: 'User Name',
  email: 'user@example.com',
  isAnonymous: false,
  likedIssues: [],
  dislikedIssues: [],
  savedIssues: [],
  settings: defaultSettings
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserData>(() => {
    const saved = localStorage.getItem('ubiq_user_profile');
    if (saved) {
      const parsed = JSON.parse(saved);
      // Ensure new arrays exist if loading old data
      return {
        ...defaultUser,
        ...parsed,
        likedIssues: parsed.likedIssues || [],
        dislikedIssues: parsed.dislikedIssues || [],
        savedIssues: parsed.savedIssues || [],
        settings: {
          ...defaultSettings,
          ...parsed.settings
        }
      };
    }
    return defaultUser;
  });

  useEffect(() => {
    localStorage.setItem('ubiq_user_profile', JSON.stringify(user));
  }, [user]);

  const updateUser = (data: Partial<UserData>) => {
    setUser(prev => ({ ...prev, ...data }));
  };

  const updateSettings = (section: keyof UserSettings, data: any) => {
    setUser(prev => ({
      ...prev,
      settings: {
        ...prev.settings,
        [section]: {
          ...prev.settings[section],
          ...data
        }
      }
    }));
  };

  const toggleAnonymity = () => {
    setUser(prev => ({ ...prev, isAnonymous: !prev.isAnonymous }));
  };

  const toggleLike = (issueId: string) => {
    setUser(prev => {
      const isLiked = prev.likedIssues.includes(issueId);
      const newLiked = isLiked 
        ? prev.likedIssues.filter(id => id !== issueId)
        : [...prev.likedIssues, issueId];
      
      // If we like it, remove from dislikes
      const newDisliked = !isLiked 
        ? prev.dislikedIssues.filter(id => id !== issueId)
        : prev.dislikedIssues;
        
      return { ...prev, likedIssues: newLiked, dislikedIssues: newDisliked };
    });
  };

  const toggleDislike = (issueId: string) => {
    setUser(prev => {
      const isDisliked = prev.dislikedIssues.includes(issueId);
      const newDisliked = isDisliked 
        ? prev.dislikedIssues.filter(id => id !== issueId)
        : [...prev.dislikedIssues, issueId];
        
      // If we dislike it, remove from likes
      const newLiked = !isDisliked 
        ? prev.likedIssues.filter(id => id !== issueId)
        : prev.likedIssues;
        
      return { ...prev, dislikedIssues: newDisliked, likedIssues: newLiked };
    });
  };

  const toggleSave = (issueId: string) => {
    setUser(prev => {
      const isSaved = prev.savedIssues.includes(issueId);
      const newSaved = isSaved 
        ? prev.savedIssues.filter(id => id !== issueId)
        : [...prev.savedIssues, issueId];
      return { ...prev, savedIssues: newSaved };
    });
  };

  return (
    <UserContext.Provider value={{ 
      user, 
      updateUser,
      updateSettings,
      toggleAnonymity,
      toggleLike,
      toggleDislike,
      toggleSave
    }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}
