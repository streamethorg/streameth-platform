'use client';
import React, { useEffect, useRef, useState } from 'react';

const ChannelDescription = ({ description }: { description?: string }) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const [isClamped, setClamped] = useState(false);
  const [isExpanded, setExpanded] = useState(false);

  useEffect(() => {
    function handleResize() {
      if (contentRef && contentRef.current) {
        setClamped(
          contentRef.current.scrollHeight > contentRef.current.clientHeight
        );
      }
    }
    handleResize();
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, [contentRef]);

  return (
    <div className="hidden w-4/5 md:block">
      <div
        ref={contentRef}
        className={!isExpanded ? 'line-clamp-2' : 'line-clamp-4'}
      >
        {' '}
        {description}
      </div>

      {isClamped && (
        <div className="text-blue flex cursor-pointer justify-end">
          <p
            className="text-title font-semibold"
            onClick={() => setExpanded(!isExpanded)}
          >
            {!isExpanded ? 'Read more' : ' Read less'}
          </p>
        </div>
      )}
    </div>
  );
};

export default ChannelDescription;
