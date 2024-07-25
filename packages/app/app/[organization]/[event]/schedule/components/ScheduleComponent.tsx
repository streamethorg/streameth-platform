import StageSelect from './StageSelect';
import DateSelect from './DateSelect';
import SessionList from '@/components/sessions/SessionList';
import { fetchAllSessions } from '@/lib/data';
import { getEventDays, getSessionDays } from '@/lib/utils/time';
import { isSameDay } from '@/lib/utils/time';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { IExtendedEvent, IExtendedStage } from '@/lib/types';

const ScheduleComponent = async ({
  stages,
  event,
  stage,
  date,
}: {
  stages: IExtendedStage[];
  event: IExtendedEvent;
  stage?: string;
  date?: string;
}) => {
  const sessionsData = await fetchAllSessions({
    event: event.slug,
    stageId: stage ?? stages[0]?._id,
  });

  const dates = getSessionDays(sessionsData.sessions);
  const sessions = sessionsData.sessions.filter((session) => {
    if (date) {
      if (date === 'all') return true;
      return isSameDay(session.start, Number(date));
    }
    return isSameDay(session.start, Number(dates[0]));
  });

  if (!sessionsData.sessions.length) return null;

  return (
    <Card id="schedule" className="border-none shadow-none">
      <CardHeader className="flex w-full flex-col justify-start space-y-2 lg:flex-row lg:space-x-4 lg:space-y-0">
        <DateSelect dates={dates} />
        <StageSelect stages={stages} />
      </CardHeader>
      <CardContent className="">
        <div className="relative flex w-full flex-col">
          <SessionList date={date} event={event} sessions={sessions} />
        </div>
      </CardContent>
    </Card>
  );
};

export const ScheduleSkeleton = () => (
  <div className="animate-pulse border-white border-opacity-[0.04] bg-white bg-opacity-[0.04] text-white shadow lg:rounded-xl">
    <div className="flex w-full flex-col justify-center space-y-2 p-3 lg:flex-row lg:space-x-4 lg:space-y-0 lg:p-6">
      <div className="h-10 w-1/4 rounded bg-gray-300"></div>
      <div className="flex flex-1 space-x-2">
        <div className="h-10 w-full max-w-xs rounded bg-gray-300"></div>
      </div>
      <div className="flex flex-1 space-x-2">
        <div className="h-10 w-full max-w-xs rounded bg-gray-300"></div>
      </div>
    </div>
    <div className="p-3 lg:p-6">
      <div className="relative flex w-full flex-col space-y-2">
        {Array(5)
          .fill(0)
          .map((_, index) => (
            <div key={index} className="h-20 rounded bg-gray-300"></div>
          ))}
      </div>
    </div>
  </div>
);

export default ScheduleComponent;
