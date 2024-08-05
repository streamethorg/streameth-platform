'use client';
import { useContext, useEffect } from 'react';
import { TopNavbarContext } from '../../lib/context/TopNavbarContext';

const EmbedLayout = ({ children }: { children: React.ReactNode }) => {
  const { setShowNav } = useContext(TopNavbarContext);

  useEffect(() => {
    setShowNav(false);
  }, [setShowNav]);

  return children;
};

export default EmbedLayout;
