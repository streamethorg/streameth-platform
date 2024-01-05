import Player from '@/components/ui/Player'
import SessionInfoBox from '@/components/sessions/SessionInfoBox'
import { WatchPageProps } from '@/lib/types'
import { fetchEventSessions } from '@/lib/data'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs'
import RelatedVideos from './components/RelatedVideos'
import ColorComponent from '@/components/Layout/ColorComponent'
export default async function Watch({
  searchParams,
}: WatchPageProps) {
  if (!searchParams.event || !searchParams.session) return null

  const video = (
    await fetchEventSessions({
      event: searchParams.event,
    })
  ).filter((session) => {
    return session.id === searchParams.session
  })[0]

  // TODO: enable to query just by event id
  // const event = await fetchEvent({
  //   event: searchParams.event,
  // })

  if (!video) return null

  const tabs = []
  tabs.push({
    value: 'related',
    content: <RelatedVideos event={searchParams.event} />,
  })

  return (
    <ColorComponent accentColor={''}>
      <div className="h-full flex flex-col w-full lg:flex-row relative ">
        <div className="flex flex-col w-full h-full z-40 lg:w-[70%] sticky md:relative top-[72px] md:top-0  md:pr-2 ">
          <Player
            playbackId={video.playbackId}
            playerName={video.name}
          />
          <SessionInfoBox
            title={video.name}
            cardDescription={new Date(video.start).toLocaleString()}
            description={video.description}
            playerName={video.name}
            playbackId={video.playbackId}
            speakers={video.speakers}
            videoDownload
          />
        </div>
        <Tabs
          defaultValue={tabs[0]?.value ?? ''}
          className="md:w-[30%] w-full max-h-[100%] md:ml-2 bg-background p-2 rounded-md ">
          <TabsList className="w-full bg-background">
            {tabs.map((tab) => (
              <TabsTrigger key={tab.value} value={tab.value}>
                {tab.value}
              </TabsTrigger>
            ))}
          </TabsList>
          {tabs.map((tab) => (
            <TabsContent
              className="h-[calc(100%-50px)] overflow-y-scroll"
              key={tab.value}
              value={tab.value}>
              {tab.content}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </ColorComponent>
  )
}

// export async function generateMetadata(
//   { params }: Params,
//   parent: ResolvingMetadata
// ): Promise<Metadata> {
//   const sController = new SessionController()
//   const session = await sController.getSession(
//     params.session,
//     params.event
//   )
//   const imageUrl = session.coverImage
//     ? session.coverImage
//     : session.id + '.png'
//   try {
//     return {
//       title: session.name,
//       description: session.description,
//       openGraph: {
//         title: session.name,
//         description: session.description,
//         images: [imageUrl],
//       },
//     }
//   } catch (e) {
//     return {
//       title: 'StreamETH Session',
//       openGraph: {
//         title: 'StreamETH Session',
//         description:
//           'The complete solution to host your hybrid or virtual event.',
//       },
//     }
//   }
// }
