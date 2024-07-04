import {
  useSearchParams as useNextSearchParams,
  usePathname,
  useRouter,
} from 'next/navigation';

interface ITerm {
  key: string;
  value: string;
}
const useSearchParams = () => {
  const pathname = usePathname();
  const { replace } = useRouter();
  const searchParams = useNextSearchParams();

  function handleTermChange(terms: ITerm[]) {
    const params = new URLSearchParams(searchParams);
    for (const term of terms) {
      if (term.value) {
        params.set(term.key, term.value);
      } else {
        params.delete(term.key);
      }
      replace(`${pathname}?${params.toString()}`);
    }
  }
  return {
    searchParams,
    handleTermChange,
  };
};

export default useSearchParams;
