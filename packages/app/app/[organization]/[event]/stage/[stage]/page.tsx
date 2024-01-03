import Player from '@/components/ui/Player'
import SessionInfoBox from '@/components/sessions/SessionInfoBox'
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
    stage: params.stage,
    date: new Date(),
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
      <div className="flex flex-col w-full h-full z-40 lg:w-[70%] sticky top-[54px] md:p-4 md:pr-2">
        <Player
          streamId={stage.streamSettings.streamId}
          playerName={stage.name}
        />
        <SessionInfoBox
          title={'Watching: ' + stage.name + ' stage'}
          cardDescription={event.name}
          playerName={stage.name}
          streamId={stage.streamSettings.streamId}
        />
      </div>
      <Tabs
        defaultValue={tabs[0]?.value ?? ''}
        className="md:w-[30%] w-full max-h-[100%] md:m-4 md:ml-2 bg-background p-2 rounded-lg ">
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
