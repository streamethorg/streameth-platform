import { Card, CardContent } from '@/components/ui/card';
import { IExtendedSession } from '@/lib/types';
import Image from 'next/image';
import { formatDate } from '@/lib/utils/time';
import Thumbnail from '@/components/misc/VideoCard/thumbnail';
import useSearchParams from '@/lib/hooks/useSearchParams';
export default function Clip({ session }: { session: IExtendedSession }) {
  const { handleTermChange } = useSearchParams();
  const { name, coverImage, _id } = session;
  return (
    <Card
      onClick={() => handleTermChange([{ key: 'previewId', value: _id }])}
      className="w-full max-w-2xl overflow-hidden p-2 shadow-none cursor-pointer hover:bg-gray-100"
    >
      <div className="flex justify-center items-center">
        <div className="flex-shrink-0 w-1/3">
          <Thumbnail imageUrl={coverImage} />
        </div>
        <CardContent className="lg:p-2 p-2 flex-grow">
          <h2 className="text-lg font-semibold line-clamp-1">{name}</h2>
          <p className="text-sm text-gray-500 mt-1">
            {formatDate(
              new Date(session.createdAt as string),
              'ddd. MMM. D, YYYY'
            )}
          </p>
        </CardContent>
      </div>
    </Card>
  );
}
