import Player from '@/components/ui/Player'
import SessionInfoBox from '@/components/sessions/SessionInfoBox'
import SessionList from '@/components/sessions/SessionList'
import Chat from '@/components/plugins/Chat'
import { EventPageProps } from '@/lib/types'
import { fetchAllSessions } from '@/lib/data'
import { fetchEvent } from '@/lib/services/eventService'
import { fetchStage } from '@/lib/services/stageService'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs'
import { notFound } from 'next/navigation'
export default async function Stage({ params }: EventPageProps) {
  if (!params.event || !params.stage) {
    return notFound()
  }

  const event = await fetchEvent({
    eventId: params.event,
  })

  const sessionsData = await fetchAllSessions({
    event: params.event,
    stage: params.stage,
    date: new Date(),
  })

  const stage = await fetchStage({
    stage: params.stage,
  })

  if (!event || !stage) {
    return notFound()
  }

  const tabs = []
  if (!event?.plugins?.disableChat) {
    tabs.push({
      value: 'chat',
      content: <Chat conversationId="d" />,
    })
  }

  if (
    sessionsData.sessions.length > 0 &&
    !event?.plugins?.hideSchedule
  ) {
    tabs.push({
      value: 'schedule',
      content: (
        <SessionList event={event} sessions={sessionsData.sessions} />
      ),
    })
  }

  return (
    <div className="bg-event flex flex-col w-full md:flex-row relative lg:max-h-[calc(100vh-54px)] p-2 gap-2">
      <div className="flex flex-col w-full md:h-full z-40 md:w-full top-[54px] gap-2">
        <Player
          streamId={stage.streamSettings?.streamId}
          playerName={stage.name}
        />
        <SessionInfoBox
          inverted
          title={'Watching: ' + stage.name}
          cardDescription={event.name}
          playerName={stage.name}
          streamId={stage.streamSettings?.streamId}
          description={event.description}
        />
      </div>
      <Chat conversationId="d" />
      {/* {tabs.length > 0 && (
        <Tabs
          defaultValue={tabs[0]?.value ?? ''}
          className="md:w-[25%] w-full max-h-[100vh] rounded-md ">
          <TabsList className="w-full ">
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
      )} */}
    </div>
  )
}
