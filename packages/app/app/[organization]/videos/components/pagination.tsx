'use client';
import { IPagination } from '@/lib/types';
import useSearchParams from '@/lib/hooks/useSearchParams';
import React, { useState } from 'react';
import { useEffect } from 'react';

const Pagination = ({
  pagination,
  setPagination,
  isLoading,
}: {
  pagination: IPagination;
  setPagination: (pagination: IPagination) => void;
  isLoading: boolean;
}) => {
  const [jumpPage, setJumpPage] = useState(pagination.currentPage);
  const { handleTermChange, searchParams } = useSearchParams();
  const currentPage = Number(searchParams.get('page')) || 1;

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
      if (currentPage < pagination.totalPages) {
        setPagination({
          currentPage: currentPage + 1,
          totalPages: pagination.totalPages,
          totalItems: pagination.totalItems,
          limit: pagination.limit,
        });
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [currentPage, pagination.totalPages, handleTermChange]);

  if (isLoading) {
    return <div className="flex justify-center items-center">Loading...</div>;
  }

  return null;
};

export default Pagination;
