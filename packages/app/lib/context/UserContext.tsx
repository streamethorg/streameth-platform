'use client';

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { IExtendedUserWithOrganizations } from '../types';
import { useRouter, usePathname } from 'next/navigation';

type UserContextType = {
  user: IExtendedUserWithOrganizations | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  clearUserData: () => void;
};

export const useUserContext = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUserContext must be used within a UserContextProvider');
  }
  return context;
};

const UserContext = createContext<UserContextType | null>(null);

export const UserContextProvider = ({
  children,
  user: initialUser,
}: {
  children: React.ReactNode;
  user: IExtendedUserWithOrganizations | null;
}) => {
  // Set initial loading state to true only if initialUser is null
  // This prevents the loader from showing when we already have user data
  const [isLoading, setIsLoading] = useState(initialUser === null); 
  const [user, setUser] = useState<IExtendedUserWithOrganizations | null>(initialUser);
  const router = useRouter();
  const pathname = usePathname();

  // Determine if user is authenticated
  const isAuthenticated = Boolean(user);
  
  // Add a method to clear user data (useful for logout or error states)
  const clearUserData = useCallback(() => {
    setUser(null);
  }, []);

  // Update user when initialUser changes (e.g., after login)
  useEffect(() => {
    // If we receive initialUser data (even if null), we're no longer loading
    setUser(initialUser);
    setIsLoading(false);
  }, [initialUser]);
  
  // Add memory usage monitoring for debugging
  useEffect(() => {
    // Only run in development mode
    if (process.env.NODE_ENV !== 'development') return;
    
    // Check if we have access to performance.memory (Chrome only)
    if (typeof window !== 'undefined' && window.performance && 'memory' in window.performance) {
      const checkMemory = () => {
        const memory = (performance as any).memory;
        if (memory && memory.usedJSHeapSize > 1.5 * 1024 * 1024 * 1024) { // 1.5GB
          console.warn('🚨 [UserContext] High memory usage detected:', 
            (memory.usedJSHeapSize / (1024 * 1024)).toFixed(2) + 'MB',
            'of', (memory.jsHeapSizeLimit / (1024 * 1024)).toFixed(2) + 'MB');
        }
      };
      
      const intervalId = setInterval(checkMemory, 10000);
      return () => clearInterval(intervalId);
    }
  }, []);

  return (
    <UserContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated,
        clearUserData,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default UserContext;
