'use client';
import { IPagination } from '@/lib/types';
import useSearchParams from '@/lib/hooks/useSearchParams';
import React, { useState } from 'react';
import { useEffect } from 'react';

const Pagination = ({
  pagination,
  fetch,
  isLoading,
}: {
  pagination: IPagination | null;
  fetch: (params: { page: number }) => void;
  isLoading: boolean;
}) => {
  // trigger when reaching bottom of the page
  useEffect(() => {
    const handleScroll = () => {
      if (isLoading) return;
      if (
        window.innerHeight + document.documentElement.scrollTop + 1 <
        document.documentElement.offsetHeight
      ) {
        return;
      }
      if (
        !pagination ||
        pagination.currentPage === pagination.totalPages ||
        pagination.totalPages === 0
      ) {
        return;
      }

      fetch({ page: pagination.currentPage + 1 });
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [pagination]);

  if (isLoading) {
    return <div className="flex justify-center items-center">Loading...</div>;
  }

  return null;
};

export default Pagination;
