import HomePageNavbar from '@/components/Layout/HomePageNavbar';
import Support from '@/components/misc/Support';

const StudioLayout = async (props: { children: React.ReactNode }) => {
  return (
    <div className="h-screen w-screen">
      <HomePageNavbar pages={[]} showLogo={true} showSearchBar={false} />
      <div className="top-[74px] flex h-[calc(100vh-74px)] flex-col">
        {props.children}
        <Support />
      </div>
    </div>
  );
};

export default StudioLayout;
