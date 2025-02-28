import Support from '@/components/misc/Support';
import { fetchUserAction } from '@/lib/actions/users';
import { redirect } from 'next/navigation';

const StudioLayout = async (props: { children: React.ReactNode }) => {
  console.log('🚀 [StudioLayout] Fetching user data...');
  const startTime = Date.now();
  
  const user = await fetchUserAction();
  
  console.log(`⏱️ [StudioLayout] User data fetch complete in ${Date.now() - startTime}ms:`, user ? '✅ User found' : '❌ User not found');

  if (!user) {
    console.log('🔄 [StudioLayout] Redirecting to login page');
    return redirect('/auth/login');
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
