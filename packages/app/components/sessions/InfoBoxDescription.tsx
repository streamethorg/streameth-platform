'use client';

import { useState, useEffect, useRef } from 'react';
import MarkdownDisplay from '../misc/MarkdownDisplay';
import { IExtendedSpeaker } from '@/lib/types';
import SpeakerIcon from '../speakers/SpeakerIcon';

const InfoBoxDescription = ({
  description,
  speakers,
}: {
  description?: string;
  speakers?: IExtendedSpeaker[];
}) => {
  const [isOpened, setIsOpened] = useState(false);
  const [isExpandable, setIsExpandable] = useState(false);
  const [maxHeight, setMaxHeight] = useState('0px');
  const descriptionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleResize = () => {
      if (descriptionRef.current) {
        const descriptionHeight = descriptionRef.current.scrollHeight;
        // Lower the threshold to ensure longer descriptions trigger the expand button
        setIsExpandable(descriptionHeight > 50);
        setMaxHeight(isOpened ? `${descriptionHeight}px` : '50px');
      }
    };

    // Call handleResize after a short delay to ensure content is properly rendered
    const timeoutId = setTimeout(handleResize, 100);
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(timeoutId);
    };
  }, [isOpened, description]); // Add description as dependency to recalculate on content change

  if (!description) return null;

  return (
    <div className="relative py-4">
      <div
        ref={descriptionRef}
        className="overflow-hidden duration-300 ease-in-out transition-max-height"
        style={{ maxHeight }}
      >
        {description && (
          <div className="space-y-2">
            <MarkdownDisplay content={description} />
            {speakers && (
              <div className="flex flex-col items-start space-y-2 md:flex-row md:space-y-0 md:space-x-2">
                {speakers.map((speaker) => (
                  <SpeakerIcon key={speaker._id} speaker={speaker} />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
      {isExpandable && !isOpened && (
        <div className="absolute right-0 left-0 bottom-4 h-6 bg-gradient-to-t from-white to-transparent pointer-events-none"></div>
      )}
      {isExpandable && (
        <button
          onClick={() => {
            setIsOpened(!isOpened);
            if (descriptionRef.current) {
              setMaxHeight(
                !isOpened ? `${descriptionRef.current.scrollHeight}px` : '50px'
              );
            }
          }}
          className="absolute right-0 bottom-0 pb-2 ml-auto text-sm font-bold text-primary"
        >
          {isOpened ? 'Show less' : 'Show more'}
        </button>
      )}
    </div>
  );
};

export default InfoBoxDescription;
