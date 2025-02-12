import Support from '@/components/misc/Support';
import { fetchUserAction } from '@/lib/actions/users';
import { redirect } from 'next/navigation';
const StudioLayout = async (props: { children: React.ReactNode }) => {
  
  const user = await fetchUserAction();

  if (!user) {
    return redirect('/login');
  }

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
