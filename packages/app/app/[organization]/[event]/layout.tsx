import { notFound } from "next/navigation";
import { fetchEvent } from "@/lib/services/eventService";

const Layout = async ({
	children,
	params: paramsPromise,
}: {
	children: React.ReactNode;
	params: Promise<{
		organization: string;
		event: string;
	}>;
}) => {
	const params = await paramsPromise;
	const event = await fetchEvent({
		eventSlug: params.event,
	});

	if (!event) {
		return notFound();
	}
	const style = {
		"--colors-accent": event.accentColor,
		backgroundColor: event.accentColor,
	} as React.CSSProperties;

	return (
		<div className="flex flex-col w-full h-full min-h-screen z-1" style={style}>
			<main className={`top-[74px] ml-auto flex w-full flex-grow lg:h-full`}>
				{children}
			</main>
		</div>
	);
};

export default Layout;
