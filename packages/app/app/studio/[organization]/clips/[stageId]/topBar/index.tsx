import { Button } from '@/components/ui/button';

const TopBar = () => {
  return (
    <div className="w-full bg-white p-4 flex justify-end">
      {/* <CreateClipButton /> */}
      <Button variant={'primary'} className="bg-blue-500 text-white ml-auto">
        Create Clip
      </Button>
    </div>
  );
};

export default TopBar;
