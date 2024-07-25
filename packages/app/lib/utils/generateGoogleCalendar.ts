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
  const startDate = formatDate(start, 'YYYYMMDDTHHmm00Z');
  const endDate = formatDate(end, 'YYYYMMDDTHHmm00Z');

  return `${BASE_URL}?action=TEMPLATE&text=${eventName}&dates=${startDate}/${endDate}&details=${description}`;
};

export default generateGoogleCalendar;
