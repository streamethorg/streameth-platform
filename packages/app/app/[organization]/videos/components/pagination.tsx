'use client'
import { IPagination } from '@/lib/types'
import useSearchParams from '@/lib/hooks/useSearchParams'
import { ArrowLeft, ArrowRight } from 'lucide-react'

const Pagination = (props: IPagination) => {
  const { handleTermChange, searchParams } = useSearchParams()
  const currentPage = Number(searchParams.get('page')) || 1

  return (
    <div className="flex flex-row items-center justify-center">
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
              ])
            }
          }}>
          <ArrowLeft size={24} />
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
