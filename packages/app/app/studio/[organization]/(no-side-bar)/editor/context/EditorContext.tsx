'use client';
import React, {
  createContext,
  useContext,
  useState,
  useRef,
  ReactNode,
} from 'react';
import { PlayerRef } from '@remotion/player';
import { IExtendedSession } from '@/lib/types';

// Define the shape of the context state
export interface EditorState {
  addCaptions: boolean;
  addBranding: boolean;
  selectedAspectRatio: string;
  aspectRatios: string[];
  captionEnabled: boolean;
  captionLinesPerPage: string;
  captionPosition: string;
  animation: string;
  setAddCaptions: (value: boolean) => void;
  setAddBranding: (value: boolean) => void;
  setSelectedAspectRatio: (value: string) => void;
  setCaptionEnabled: (value: boolean) => void;
  setCaptionLinesPerPage: (value: string) => void;
  setCaptionPosition: (value: string) => void;
  setAnimation: (value: string) => void;
  captionFont: string;
  captionColor: string;
  setCaptionFont: (font: string) => void;
  setCaptionColor: (color: string) => void;
  importedSessions: IExtendedSession[];
  addSession: (session: IExtendedSession) => void;
  removeSession: (sessionId: string) => void;
  playerRef: React.RefObject<PlayerRef>;
  fps: number;
  selectedSession: IExtendedSession | null;
  setSelectedSession: (session: IExtendedSession | null) => void;
}

// Create the context with default values
export const EditorContext = createContext<EditorState | undefined>(undefined);

// Create a provider component
export const EditorProvider = ({
  children,
  initialSessions,
}: {
  children: ReactNode;
  initialSessions: IExtendedSession[];
}) => {
  const [addCaptions, setAddCaptions] = useState(false);
  const [addBranding, setAddBranding] = useState(false);
  const [selectedAspectRatio, setSelectedAspectRatio] = useState('16:9');
  const [captionEnabled, setCaptionEnabled] = useState(false);
  const [captionLinesPerPage, setCaptionLinesPerPage] = useState('Three');
  const [captionPosition, setCaptionPosition] = useState('Auto');
  const [animation, setAnimation] = useState('None');
  const aspectRatios = ['9:16', '1:1', '16:9'];
  const [captionFont, setCaptionFont] = useState('Arial');
  const [captionColor, setCaptionColor] = useState('#FFFFFF');
  const [fps, setFps] = useState(30);
  const [selectedSession, setSelectedSession] = useState<IExtendedSession | null>(null);

  const [importedSessions, setImportedSessions] = useState<IExtendedSession[]>(
    initialSessions ?? []
  );

  const addSession = (session: IExtendedSession) => {
    setImportedSessions([...importedSessions, session]);
  };

  const removeSession = (sessionId: string) => {
    setImportedSessions(
      importedSessions.filter((session) => session._id !== sessionId)
    );
  };

  const playerRef = useRef<PlayerRef>(null);

  return (
    <EditorContext.Provider
      value={{
        addCaptions,
        addBranding,
        selectedAspectRatio,
        aspectRatios,
        captionEnabled,
        captionLinesPerPage,
        captionPosition,
        animation,
        setAddCaptions,
        setAddBranding,
        setSelectedAspectRatio,
        setCaptionEnabled,
        setCaptionLinesPerPage,
        setCaptionPosition,
        setAnimation,
        captionFont,
        captionColor,
        setCaptionFont,
        setCaptionColor,
        importedSessions,
        addSession,
        removeSession,
        playerRef,
        fps,
        selectedSession,
        setSelectedSession,
      }}
    >
      {children}
    </EditorContext.Provider>
  );
};

// Custom hook to use the EditorContext
export const useEditorContext = () => {
  const context = useContext(EditorContext);
  if (context === undefined) {
    throw new Error('useEditorContext must be used within an EditorProvider');
  }
  return context;
};
