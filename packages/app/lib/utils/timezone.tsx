'use client';

import { Badge } from '@/components/ui/badge';
import { IExtendedStage } from '../types';
import { formatDate } from './time';
import { useEffect, useState } from 'react';
import moment from 'moment-timezone';

export const getTimezoneAbbreviation = (timezone: string): string => {
  const abbreviation = moment.tz(timezone).zoneAbbr();

  return abbreviation || 'UTC';
};

const Timezone = ({
  date,
  video,
}: {
  date: string;
  video?: IExtendedStage;
}) => {
  const [formattedDate, setFormattedDate] = useState<string>(
    formatDate(new Date(date), 'ddd. MMM. D, YYYY, h:mm a')
  );
  const [timezoneAbbr, setTimezoneAbbr] = useState<string>('UTC');

  useEffect(() => {
    const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    setTimezoneAbbr(getTimezoneAbbreviation(userTimezone));

    if (video?.isMultipleDate && video?.streamEndDate) {
      setFormattedDate(
        `${formatDate(
          new Date(date),
          'ddd. MMM. D, YYYY, h:mm a',
          userTimezone
        )} - ${formatDate(
          new Date(video.streamEndDate),
          'ddd. MMM. D, YYYY, h:mm a',
          userTimezone
        )}`
      );
      return;
    }

    setFormattedDate(
      formatDate(new Date(date), 'ddd. MMM. D, YYYY, h:mm a', userTimezone)
    );
  }, [date, video]);

  return (
    <>
      <span>{formattedDate}</span>
      <Badge className="py-0" variant={'secondary'}>
        {timezoneAbbr}
      </Badge>
    </>
  );
};

export default Timezone;
