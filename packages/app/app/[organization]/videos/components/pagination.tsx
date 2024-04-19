'use client'
import { IPagination } from '@/lib/types'
import useSearchParams from '@/lib/hooks/useSearchParams'
import { ArrowLeft, ArrowRight } from 'lucide-react'

const Pagination = (props: IPagination) => {
  const { handleTermChange, searchParams } = useSearchParams()
  const currentPage = Number(searchParams.get('page')) || 1

  return (
    <div className="flex flex-row justify-center items-center">
      <div className="flex flex-row justify-center items-center">
        <button
          className="p-2 rounded-full disabled:text-gray-200 active:hover:bg-gray-100"
          disabled={props.currentPage === 1}
          onClick={() => {
            if (currentPage > 1) {
              handleTermChange([
                {
                  key: 'page',
                  value: (currentPage - 1).toString(),
                },
              ])
            }
          }}>
          <ArrowLeft size={24} />
        </button>
        <div className="mx-2">
          {currentPage} of {props.totalPages}
        </div>
        <button
          className="p-2 rounded-full hover:bg-gray-100"
          onClick={() => {
            if (currentPage < props.totalPages) {
              handleTermChange([
                { key: 'page', value: (currentPage + 1).toString() },
              ])
            }
          }}>
          <ArrowRight size={24} />
        </button>
      </div>
    </div>
  )
}

export default Pagination
