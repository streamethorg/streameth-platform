'use client';

import { useState, useEffect, useRef } from 'react';
import MarkdownDisplay from '../misc/MarkdownDisplay';
import { IExtendedSpeaker } from '@/lib/types';
import SpeakerIcon from '../speakers/speakerIcon';

const InfoBoxDescription = ({
  description,
  speakers,
}: {
  description?: string;
  speakers?: IExtendedSpeaker[];
}) => {
  const [isOpened, setIsOpened] = useState(false);
  const [isExpandable, setIsExpandable] = useState(false);
  const [maxHeight, setMaxHeight] = useState('auto');
  const [isClient, setIsClient] = useState(false);
  const descriptionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (descriptionRef.current) {
        const descriptionHeight = descriptionRef.current.scrollHeight;
        setIsExpandable(descriptionHeight > 100);
        setMaxHeight(isOpened ? `${descriptionHeight}px` : '50px');
      }
    };

    if (isClient) {
      handleResize();
      window.addEventListener('resize', handleResize);

      return () => {
        window.removeEventListener('resize', handleResize);
      };
    }
  }, [isOpened, isClient]);

  if (!description) return null;

  return (
    <div className="relative py-4">
      <div
        ref={descriptionRef}
        className={`transition-max-height overflow-hidden duration-300 ease-in-out ${
          !isClient ? 'max-h-[50px]' : ''
        }`}
        style={{ maxHeight: isClient ? maxHeight : undefined }}
      >
        {description && (
          <div className="space-y-2">
            <MarkdownDisplay content={description} />
            {speakers && (
              <div className="flex flex-col items-start space-y-2 md:flex-row md:space-x-2 md:space-y-0">
                {speakers.map((speaker) => (
                  <SpeakerIcon key={speaker._id} speaker={speaker} />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
      {isClient && isExpandable && !isOpened && (
        <div className="pointer-events-none absolute bottom-4 left-0 right-0 h-6 bg-gradient-to-t from-white to-transparent"></div>
      )}
      {isClient && isExpandable && (
        <button
          onClick={() => {
            setIsOpened(!isOpened);
            if (descriptionRef.current) {
              setMaxHeight(
                !isOpened ? `${descriptionRef.current.scrollHeight}px` : '50px'
              );
            }
          }}
          className="absolute bottom-0 right-0 ml-auto mr-5 pb-2 font-bold text-primary"
        >
          {isOpened ? 'less' : 'more'}
        </button>
      )}
    </div>
  );
};

export default InfoBoxDescription;
