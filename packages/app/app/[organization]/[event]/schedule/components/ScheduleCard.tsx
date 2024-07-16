'use client';
import ScheduleCardModal from './ScheduleCardModal';
import moment from 'moment-timezone';
import { getEventTimezoneText } from '@/lib/utils/time';
import { ClockIcon, WavesIcon } from 'lucide-react';
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import { CredenzaTrigger, Credenza } from '@/components/ui/crezenda';
import { IExtendedEvent, IExtendedSession } from '@/lib/types';
import { Button } from '@/components/ui/button';

const ScheduleCard = ({
  event,
  session,
  showTime = false,
  speakers = false,
  date,
}: {
  event: IExtendedEvent;
  session: IExtendedSession;
  showTime?: boolean;
  speakers?: boolean;
  date?: string;
}) => {
  const isActive =
    new Date(session.start).getTime() < Date.now() &&
    new Date(session.end).getTime() > Date.now();

  return (
    <Credenza>
      <CredenzaTrigger asChild>
        <Card className="hover:border-primary hover:bg-secondary flex flex-col shadow-none">
          <CardHeader>
            <CardTitle className="text-lg">{session.name}</CardTitle>
            <CardDescription className="flex flex-row items-center justify-start space-x-2">
              {showTime && (
                <>
                  <ClockIcon className="h-4 w-4" />
                  <p>
                    {moment(session.start)
                      .tz(event.timezone || 'UTC')
                      .format('HH:mm')}{' '}
                    -{' '}
                    {moment(session.end)
                      .tz(event?.timezone || 'UTC')
                      .format('HH:mm')}
                    {' | '}
                    {getEventTimezoneText(event?.timezone || 'UTC')}
                  </p>
                </>
              )}
            </CardDescription>
          </CardHeader>
          <CardFooter className="mt-auto">
            {isActive && (
              <p className="text-bold ml-auto animate-pulse text-red-500">
                Live
              </p>
            )}
            <Button variant={'secondary'}>
              <WavesIcon className="mr-2 h-4 w-4" /> Watch
            </Button>
          </CardFooter>
        </Card>
      </CredenzaTrigger>
      {/* <ScheduleCardModal event={event} session={session} /> */}
    </Credenza>
  );
};

export default ScheduleCard;
