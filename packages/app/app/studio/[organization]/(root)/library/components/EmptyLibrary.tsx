'use server';

import EmptyFolder from '@/lib/svg/EmptyFolder';
import UploadVideoDialog from './UploadVideoDialog';

const EmptyLibrary = () => {
  return (
    <div className="flex h-full flex-col items-center justify-center space-y-6 bg-white p-4 rounded-xl">
      <EmptyFolder />
      <div className="flex flex-col items-center">
        <p className="text-3xl font-bold">The library is empty</p>
        <p className="text-xl text-gray-500">
          Upload your first video to get started!
        </p>
      </div>
      <UploadVideoDialog variant="primary" />
    </div>
  );
};

export default EmptyLibrary;
