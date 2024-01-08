import {
  useSearchParams as useNextSearchParams,
  usePathname,
  useRouter,
} from 'next/navigation'

const useSearchParams = ({ key }: { key: string }) => {
  const pathname = usePathname()
  const { replace } = useRouter()
  const searchParams = useNextSearchParams()

  function handleTermChange(term: string) {
    const params = new URLSearchParams(searchParams)
    if (term) {
      params.set(key, term)
    } else {
      params.delete(key)
    }
    replace(`${pathname}?${params.toString()}`, { scroll: false })
  }

  return {
    searchParams,
    handleTermChange,
  }
}

export default useSearchParams
