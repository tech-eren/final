import React, { createContext, useContext, useState, useEffect } from 'react';

interface UserData {
  displayName: string;
  email: string;
  isAnonymous: boolean;
  likedIssues: string[];
  dislikedIssues: string[];
  savedIssues: string[];
}

interface UserContextType {
  user: UserData;
  updateUser: (data: Partial<UserData>) => void;
  toggleAnonymity: () => void;
  toggleLike: (issueId: string) => void;
  toggleDislike: (issueId: string) => void;
  toggleSave: (issueId: string) => void;
}

const defaultUser: UserData = {
  displayName: 'User Name',
  email: 'user@example.com',
  isAnonymous: false,
  likedIssues: [],
  dislikedIssues: [],
  savedIssues: []
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
        savedIssues: parsed.savedIssues || []
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
