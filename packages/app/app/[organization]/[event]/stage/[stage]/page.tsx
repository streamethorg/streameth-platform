import ActionsComponent from '@/app/[organization]/session/components/ActionsComponent'
import { LoadingContext } from '@/lib/context/LoadingContext'
import { MobileContext } from '@/lib/context/MobileContext'
import EmbedButton from '@/components/misc/EmbedButton'
import Player from '@/components/ui/Player'
import ShareButton, {
  ShareWithText,
} from '@/components/misc/ShareButton'
import SessionList from '@/components/sessions/SessionList'
import Chat from '@/components/plugins/Chat'
import { EventPageProps } from '@/lib/types'
import {
  fetchEvent,
  fetchEventSessions,
  fetchEventStage,
} from '@/lib/data'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs'

export default async function Stage({ params }: EventPageProps) {
  const event = await fetchEvent({
    event: params.event,
    organization: params.organization,
  })

  const sessions = await fetchEventSessions({
    event: params.event,
  })

  const stage = await fetchEventStage({
    event: params.event,
    stage: params.stage,
  })

  const tabs = []
  if (sessions.length > 0 && !event?.plugins?.hideSchedule) {
    tabs.push({
      value: 'schedule',
      content: <SessionList event={event} sessions={sessions} />,
    })
  }
  if (!event?.plugins?.disableChat) {
    tabs.push({
      value: 'chat',
      content: <Chat conversationId={stage.id} />,
    })
  }

  return (
    <div className="h-full flex flex-col w-full lg:flex-row relative lg:max-h-[calc(100vh-54px)]">
      <div className="flex flex-col w-full h-full lg:w-[70%] sticky top-[54px] md:p-4 md:pr-2">
        <div className="flex flex-col lg:flex-row relative  ">
          <div
            // ref={stickyRef}
            className="bg-black mb-2 lg:mb-0 sticky md:rounded-xl top-[64px] z-40 flex flex-col lg:h-full w-full box-border lg:overflow-scroll ">
            <ActionsComponent title={stage.name}>
              <EmbedButton
                streamId={stage.streamSettings.streamId}
                playerName={stage.name}
              />
              <ShareButton />
            </ActionsComponent>
            <Player
              streamId={stage.streamSettings.streamId}
              playerName={stage.name}
            />
          </div>
        </div>
      </div>
      <Tabs
        defaultValue={tabs[0].value}
        className="md:w-[30%] w-full max-h-[100%] p-4 md:pl-2">
        <TabsList className="w-full">
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
  )
}

/* <div className="flex flex-col md:flex-row relative justify-center items-start mb-2  ">
          <div className="flex flex-col">
            <div className="  font-ubuntu flex items-center rounded-xl w-fit px-2 m-2 text-center gap-4">
              <p className="text-black font-bold text-xl">
                Built by{' '}
              </p>
              <Image
                src={LogoDark}
                alt="logo"
                width={200}
                height={60}
              />
            </div>
            <div className="  font-ubuntu flex items-center rounded-xl w-fit px-2 m-2 text-center gap-4">
              <p className="text-black font-bold text-xl">
                Powered by{' '}
              </p>
              <Image
                src="/livepeer-logo.png"
                alt="logo"
                width={120}
                height={60}
              />
            </div>
          </div>
          <ShareWithText text="Share this event" />
        </div>
        */
