'use client';
import { useState, useRef, useEffect } from 'react';
import { Tabs, TabsTrigger, TabsList } from '@/components/ui/tabs';
import useSearchParams from '@/lib/hooks/useSearchParams';
import { useRouter } from 'next/navigation';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const ExploreTabs = () => {
  const { searchParams } = useSearchParams();
  const router = useRouter();
  const currentTerm = searchParams.get('searchQuery') || '';
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);
  const tabsListRef = useRef<HTMLDivElement>(null);

  const tabData = [
    { name: 'Home', searchQuery: '' },
    { name: 'Vitalik', searchQuery: 'vitalik' },
    { name: 'Zk', searchQuery: 'zk' },
    { name: 'Identity', searchQuery: 'identity' },
    { name: 'DAO', searchQuery: 'dao' },
    { name: 'Network States', searchQuery: 'network states' },
    { name: 'Fire side chat', searchQuery: 'fire side chat' },
    { name: 'Cryptography', searchQuery: 'cryptography' },
  ];

  const handleTabChange = (value: string) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('searchQuery', value);
    newParams.delete('page');

    const newUrl = `${window.location.pathname}?${newParams.toString()}`;
    router.push(newUrl);
  };

  const checkForArrows = () => {
    if (tabsListRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = tabsListRef.current;
      setShowLeftArrow(scrollLeft > 0);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth);
    }
  };

  useEffect(() => {
    checkForArrows();
    window.addEventListener('resize', checkForArrows);
    return () => window.removeEventListener('resize', checkForArrows);
  }, []);

  const scroll = (direction: 'left' | 'right') => {
    if (tabsListRef.current) {
      const scrollAmount = tabsListRef.current.clientWidth / 2;
      tabsListRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div className=" w-full sticky top-[57px] z-[5] bg-white pt-2 border-b">
      {showLeftArrow && (
        <button
          onClick={() => scroll('left')}
          className="absolute left-0 top-1/2 z-10 -translate-y-1/2 rounded-xl bg-white p-1 shadow-md"
          aria-label="Scroll left"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
      )}
      {showRightArrow && (
        <button
          onClick={() => scroll('right')}
          className="absolute right-0 top-1/2 z-10 -translate-y-1/2 rounded-xl bg-white p-1 shadow-md"
          aria-label="Scroll right"
        >
          <ChevronRight className="h-6 w-6" />
        </button>
      )}
      <Tabs
        defaultValue={currentTerm}
        className="w-full mt-4"
        onValueChange={handleTabChange}
      >
        <TabsList
          ref={tabsListRef}
          className="flex overflow-x-hidden overflow-y-hidden"
          onScroll={checkForArrows}
        >
          {tabData.map((tab) => (
            <TabsTrigger
              key={tab.name}
              value={tab.searchQuery}
              className="whitespace-nowrap px-4 text-md font-medium "
            >
              {tab.name}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
    </div>
  );
};

export default ExploreTabs;
