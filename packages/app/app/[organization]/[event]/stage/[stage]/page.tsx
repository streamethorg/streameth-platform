import Player from '@/components/ui/Player'
import SessionInfoBox from '@/components/sessions/SessionInfoBox'
import SessionList from '@/components/sessions/SessionList'
import Chat from '@/components/plugins/Chat'
import { EventPageProps } from '@/lib/types'
import {
  fetchEvent,
  fetchSessions,
  fetchEventStage,
} from '@/lib/data'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs'
import { notFound } from 'next/navigation'

export default async function Stage({ params }: EventPageProps) {
  const event = await fetchEvent({
    eventId: params.event,
  })

  if (!event) {
    return notFound()
  }
  const sessionsData = await fetchSessions({
    event: params.event,
    stage: params.stageId,
    date: new Date(),
  })

  const stage = await fetchEventStage({
    stage: params.stageId,
  })

  const tabs = []
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
  if (!event?.plugins?.disableChat) {
    tabs.push({
      value: 'chat',
      content: <Chat conversationId={stage._id} />,
    })
  }

  return (
    <div className="bg-accent   p-2 h-full flex flex-col w-full lg:flex-row relative lg:max-h-[calc(100vh-54px)]">
      <div className="flex flex-col w-full h-full z-40 lg:w-[70%] top-[54px] lg:p-4 lg:pr-2">
        <Player
          streamId={stage.streamSettings?.streamId}
          playerName={stage.name}
        />
        <SessionInfoBox
          title={'Watching: ' + stage.name + ' stage'}
          cardDescription={event.name}
          playerName={stage.name}
          streamId={stage.streamSettings?.streamId}
          description={event.description}
        />
      </div>
      {tabs.length > 0 && (
        <Tabs
          defaultValue={tabs[0]?.value ?? ''}
          className="lg:w-[30%] w-full max-h-[100vh] lg:ml-2 lg:m-4  p-2 rounded-lg ">
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
      )}
    </div>
  )
}
