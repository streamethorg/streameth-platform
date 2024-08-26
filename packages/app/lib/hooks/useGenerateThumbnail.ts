'use client';
import { useEffect, useState } from 'react';
import { IExtendedSession } from '../types';
import { generateThumbnailAction } from '../actions/sessions';

const useGenerateThumbnail = ({ session }: { session: IExtendedSession }) => {
  const [thumbnail, setThumbnail] = useState<string | undefined>(undefined);

  useEffect(() => {
    const getThumbnail = async (session: IExtendedSession) => {
      try {
        const generatedThumbnail = await generateThumbnailAction(session);
        setThumbnail(generatedThumbnail);
      } catch (error) {
        console.error('Failed to generate thumbnail:', error);
      }
    };

    if (session && !session.coverImage) {
      getThumbnail(session);
    }
  }, []);

  return thumbnail;
};

export default useGenerateThumbnail;
