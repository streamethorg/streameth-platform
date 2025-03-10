import { notFound } from 'next/navigation';
import { fetchNavBarRoutes } from '@/lib/data';
import { fetchEvent } from '@/lib/services/eventService';
const Layout = async ({
  children,
  params,
}: {
  children: React.ReactNode;
  params: {
    organization: string;
    event: string;
  };
}) => {
  const navbarRoutes = await fetchNavBarRoutes({
    event: params.event,
    organization: params.organization,
  });
  const event = await fetchEvent({
    eventSlug: params.event,
  });

  if (!event) {
    return notFound();
  }
  const style = {
    '--colors-accent': event.accentColor,
    backgroundColor: event.accentColor,
  } as React.CSSProperties;

  return (
    <div className="z-1 flex h-full min-h-screen w-full flex-col" style={style}>
      <main className={`top-[74px] ml-auto flex w-full flex-grow lg:h-full`}>
        {children}
      </main>
    </div>
  );
};

export default Layout;
