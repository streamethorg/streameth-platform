'use client';
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
} from 'react';
import { IExtendedSession } from '@/lib/types';
import { fetchAllSessions } from '@/lib/services/sessionService';
import { SessionType } from 'streameth-new-server/src/interfaces/session.interface';
import { useClipContext } from '../../ClipContext';

interface ClipsSidebarContextType {
  isLoading: boolean;
  sessions: IExtendedSession[];
  filteredSessions: IExtendedSession[];
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedDate: string;
  setSelectedDate: (date: string) => void;
  uniqueDates: string[];
  fetchSessions: () => Promise<void>;
}

const ClipsSidebarContext = createContext<ClipsSidebarContextType | undefined>(
  undefined
);

export function ClipsSidebarProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isLoading, setIsLoading] = useState(true);
  const [sessions, setSessions] = useState<IExtendedSession[]>([]);
  const [filteredSessions, setFilteredSessions] =
    useState<IExtendedSession[]>(sessions);
  const [searchTerm, setSearchTerm] = useState('');
  const { stageId } = useClipContext();

  const uniqueDates = useMemo(() => {
    const dates = Array.from(
      new Set(
        sessions?.map((session) =>
          new Date(session.createdAt as string).toDateString()
        )
      )
    ).sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
    return ['All dates', ...dates];
  }, [sessions]);

  const [selectedDate, setSelectedDate] = useState(uniqueDates[0]);

  const fetchSessions = async () => {
    const sessions = await fetchAllSessions({
      stageId,
      type: SessionType.clip,
    });
    setSessions(sessions.sessions);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchSessions();
  }, [stageId]);

  useEffect(() => {
    const filtered = sessions.filter((session) => {
      const dateMatches =
        selectedDate === 'All dates' ||
        new Date(session.createdAt as string).toDateString() === selectedDate;
      const searchMatches = session.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      return dateMatches && searchMatches;
    });
    setFilteredSessions(filtered);
  }, [sessions, selectedDate, searchTerm]);

  return (
    <ClipsSidebarContext.Provider
      value={{
        isLoading,
        sessions,
        filteredSessions,
        searchTerm,
        setSearchTerm,
        selectedDate,
        setSelectedDate,
        uniqueDates,
        fetchSessions,
      }}
    >
      {children}
    </ClipsSidebarContext.Provider>
  );
}

export function useClipsSidebar() {
  const context = useContext(ClipsSidebarContext);
  if (context === undefined) {
    throw new Error(
      'useClipsSidebar must be used within a ClipsSidebarProvider'
    );
  }
  return context;
}
