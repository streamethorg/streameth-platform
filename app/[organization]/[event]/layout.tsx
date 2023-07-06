import Navbar from "@/components/Layout/Navbar";
import EventController from "@/services/controller/event";
import StageController from "@/services/controller/stage";

export async function generateStaticParams() {
  const eventController = new EventController();
  const allEvents = await eventController.getAllEvents();
  const paths = allEvents.map((event) => {
    return {
      params: {
        organization: event.organizationId,
        event: event.id,
      },
    };
  });
  return paths;
}

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
  const stageController = new StageController();
  const stages = await stageController.getAllStagesForEvent(params.event);
  const pages = stages.map((stage) => {
    return {
      href: `/${params.organization}/${stage.eventId}/stage/${stage.id}`,
      name: stage.name,
    };
  });

  return (
    <div className="flex flex-row flex-grow overflow-hidden">
      <Navbar pages={pages} />
      <main className="flex h-full w-full  md:w-[calc(100%-5rem)] ml-auto bg-base overflow-hidden">
        {children}
      </main>
    </div>
  );
};

export default Layout;
