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
    <div className="relative">
      {showLeftArrow && (
        <button
          onClick={() => scroll('left')}
          className="absolute left-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white p-2 shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-200"
          aria-label="Scroll left"
        >
          <ChevronLeft className="h-5 w-5 text-gray-600" />
        </button>
      )}
      {showRightArrow && (
        <button
          onClick={() => scroll('right')}
          className="absolute right-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white p-2 shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-200"
          aria-label="Scroll right"
        >
          <ChevronRight className="h-5 w-5 text-gray-600" />
        </button>
      )}
      <Tabs
        defaultValue={currentTerm}
        className="w-full"
        onValueChange={handleTabChange}
      >
        <TabsList
          ref={tabsListRef}
          className="flex overflow-x-auto overflow-y-hidden bg-gray-50 rounded-xl p-1 gap-1 scrollbar-hide"
          onScroll={checkForArrows}
        >
          {tabData.map((tab) => (
            <TabsTrigger
              key={tab.name}
              value={tab.searchQuery}
              className="whitespace-nowrap px-6 py-3 text-sm font-medium rounded-lg data-[state=active]:bg-white data-[state=active]:text-slate-600 data-[state=active]:shadow-sm transition-all duration-200 hover:bg-gray-100"
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
