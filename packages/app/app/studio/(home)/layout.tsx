import Support from '@/components/misc/Support';

const StudioLayout = async (props: { children: React.ReactNode }) => {
  return (
    <div className="h-screen w-screen">
      <div className="top-[74px] flex h-[calc(100vh)] flex-col">
        {props.children}
        <Support />
      </div>
    </div>
  );
};

export default StudioLayout;
