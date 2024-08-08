'use client';
import { IPagination } from '@/lib/types';
import useSearchParams from '@/lib/hooks/useSearchParams';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import React, { useState } from 'react';
import { LuArrowLeft, LuArrowRight } from 'react-icons/lu';
import { useEffect } from 'react';

const Pagination = (props: IPagination) => {
  const [jumpPage, setJumpPage] = useState(props.currentPage);
  const { handleTermChange, searchParams } = useSearchParams();
  const currentPage = Number(searchParams.get('page')) || 1;

  // trigger when reaching bottom of the page
  useEffect(() => {
    console.log(
      window.innerHeight,
      document.documentElement.scrollTop,
      document.documentElement.offsetHeight
    );
    const handleScroll = () => {
      console.log(
        window.innerHeight + document.documentElement.scrollTop,
        document.documentElement.offsetHeight
      );

      if (
        window.innerHeight + document.documentElement.scrollTop + 1 <
        document.documentElement.offsetHeight
      ) {
        return;
      }
      if (currentPage < props.totalPages) {
        handleTermChange([
          {
            key: 'page',
            value: (currentPage + 1).toString(),
          },
        ]);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [currentPage, props.totalPages, handleTermChange]);

  return (
    <div className="flex flex-row items-center justify-center p-2">
      <div className="flex items-center gap-3">
        <p>Jump to</p>
        <Input
          type="number"
          min={1}
          max={props.totalPages}
          onChange={(e) => setJumpPage(Number(e.target.value))}
          value={jumpPage}
          className="w-14 text-center"
        />
        <Button
          disabled={
            !jumpPage ||
            jumpPage < 1 ||
            jumpPage > props.totalPages ||
            props.totalPages === currentPage ||
            jumpPage == currentPage
          }
          onClick={() =>
            jumpPage &&
            handleTermChange([
              {
                key: 'page',
                value: jumpPage.toString(),
              },
            ])
          }
          variant="primary"
        >
          Go
        </Button>
      </div>
      <div className="flex flex-row items-center justify-center">
        <button
          className="rounded-full p-2 active:hover:bg-gray-100 disabled:text-gray-200"
          disabled={props.currentPage === 1}
          onClick={() => {
            if (currentPage > 1) {
              handleTermChange([
                {
                  key: 'page',
                  value: (currentPage - 1).toString(),
                },
              ]);
            }
          }}
        >
          <LuArrowLeft size={24} />
        </button>
        <div className="mx-2">
          {currentPage} of {props.totalPages}
        </div>
        <button
          className="rounded-full p-2 active:hover:bg-gray-100 disabled:text-gray-200"
          disabled={props.totalPages === currentPage}
          onClick={() => {
            if (currentPage < props.totalPages) {
              handleTermChange([
                { key: 'page', value: (currentPage + 1).toString() },
              ]);
            }
          }}
        >
          <LuArrowRight size={24} />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
