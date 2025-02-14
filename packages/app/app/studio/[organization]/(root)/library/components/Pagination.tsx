'use client';
import { IPagination } from '@/lib/types';
import useSearchParams from '@/lib/hooks/useSearchParams';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import React, { useState } from 'react';
import { LuArrowLeft, LuArrowRight, LuSearch } from 'react-icons/lu';

const Pagination = (props: IPagination) => {
  const [jumpPage, setJumpPage] = useState(props.currentPage);
  const { handleTermChange, searchParams } = useSearchParams();
  const currentPage = Number(searchParams.get('page')) || 1;

  return (
    <div className="flex flex-row items-center justify-center p-2">
      <div className="flex flex-row items-center justify-center">
        <div className="flex flex-col items-center">
          <p className="text-sm">
            {currentPage} of {props.totalPages}
          </p>
          <div className="flex flex-row items-center">
            <Button
              variant="ghost"
              className=" active:hover:bg-gray-100 disabled:text-gray-200"
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
              <LuArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex items-center align-middle border bg-white rounded-xl px-1">
              <p className="text-sm mr-1">Jump to</p>
              <Input
                type="number"
                min={1}
                max={props.totalPages}
                onChange={(e) => setJumpPage(Number(e.target.value))}
                value={jumpPage}
                className="md:p-0 w-9 h-9 text-center border-none focus:ring-0 bg-white"
              />
              <Button
                size="sm"
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
                variant="ghost"
                className="p-0 text-primary"
              >
                <LuSearch className="w-4 h-4" />
              </Button>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className=" active:hover:bg-gray-100 disabled:text-gray-200"
              disabled={props.totalPages === currentPage}
              onClick={() => {
                if (currentPage < props.totalPages) {
                  handleTermChange([
                    { key: 'page', value: (currentPage + 1).toString() },
                  ]);
                }
              }}
            >
              <LuArrowRight className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pagination;
