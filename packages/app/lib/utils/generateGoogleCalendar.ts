import { formatDate } from './time';

const BASE_URL = 'https://calendar.google.com/calendar/render';

const generateGoogleCalendar = ({
  eventName,
  description,
  start,
  end,
}: {
  eventName: string;
  description: string;
  start: Date;
  end: Date;
}) => {
  const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const startDate = formatDate(start, 'YYYYMMDDTHHmmss', userTimezone);
  const endDate = formatDate(end, 'YYYYMMDDTHHmmss', userTimezone);

  return `${BASE_URL}?action=TEMPLATE&text=${encodeURIComponent(eventName)}&dates=${startDate}/${endDate}&details=${encodeURIComponent(description)}`;
};

export default generateGoogleCalendar;
