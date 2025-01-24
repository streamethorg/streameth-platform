import { IExtendedSession } from '@/lib/types';

interface SearchResultsProps {
  isLoading: boolean;
  searchResults: IExtendedSession[];
  onSelect: (result: IExtendedSession) => void;
}

export function SearchResults({ isLoading, searchResults, onSelect }: SearchResultsProps) {
  if (isLoading) {
    return <span>Loading...</span>;
  }

  return (
    <div className="flex flex-col bg-white">
      {searchResults.length > 0 && (
        <div className="mt-2">
          <div className="text p-1 font-bold">Videos</div>
          {searchResults.map((result) => (
            <div
              onClick={() => onSelect(result)}
              className="cursor-pointer p-1 hover:bg-gray-100"
              key={result._id.toString()}
            >
              {result.name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}