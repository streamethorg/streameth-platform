'use client'
import { IPagination } from '@/lib/types'
import useSearchParams from '@/lib/hooks/useSearchParams'
import {
  ArrowLeftIcon,
  ArrowRightIcon,
} from '@heroicons/react/24/outline'

const Pagination = (props: IPagination) => {
  const { handleTermChange, searchParams } = useSearchParams({
    key: 'page',
  })
  const currentPage = Number(searchParams.get('page')) || 1

  return (
    <div className="flex flex-row justify-center items-center">
      <div className="flex flex-row justify-center items-center">
        <button
          className="p-2 rounded-full bg-background hover:bg-gray-100"
          onClick={() => {
            if (currentPage > 1) {
              handleTermChange((currentPage - 1).toString())
            }
          }}>
          <ArrowLeftIcon className="h-6 w-6" />
        </button>
        <div className="mx-2 text-background">
          {currentPage} of {props.totalPages}
        </div>
        <button
          className="p-2 rounded-full bg-background hover:bg-gray-100"
          onClick={() => {
            if (currentPage < props.totalPages) {
              handleTermChange((currentPage + 1).toString())
            }
          }}>
          <ArrowRightIcon className="h-6 w-6" />
        </button>
      </div>
    </div>
  )
}

export default Pagination
