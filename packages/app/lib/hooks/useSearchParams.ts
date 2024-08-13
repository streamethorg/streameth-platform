import {
  useSearchParams as useNextSearchParams,
  usePathname,
  useRouter,
} from 'next/navigation';

interface ITerm {
  key: string;
  value: string | undefined;
}
const useSearchParams = () => {
  const pathname = usePathname();
  const { push } = useRouter();
  const searchParams = useNextSearchParams();

  function handleTermChange(terms: ITerm[]) {
    const params = new URLSearchParams(searchParams);
    for (const term of terms) {
      if (term.value) {
        params.set(term.key, term.value);
      } else {
        params.delete(term.key);
      }
      push(`${pathname}?${params.toString()}`, {
        scroll: false,
      });
    }
  }

  return {
    searchParams,
    handleTermChange,
  };
};

export default useSearchParams;
