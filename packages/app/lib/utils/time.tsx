import moment from 'moment';
import { TIMEZONES } from '@/lib/constants/timezones';

export const getTime = (date: Date): number => moment(date).valueOf();

export const extractDate = (date: Date): string => moment(date).format('YYYY-MM-DD');

export const getDateAsString = (date: Date): string => moment(date).format('YYYY-MM-DD');

export const getEventDays = (start: Date, end: Date): number[] => {
  const startDate = moment(start);
  const endDate = moment(end);
  const days = endDate.diff(startDate, 'days') + 1;
  const dates: number[] = [];

  for (let i = 0; i < days; i++) {
    dates.push(startDate.clone().add(i, 'days').valueOf());
  }

  return dates;
}

export const isSameDay = (timestamp1: number, timestamp2: number): boolean => {
  return moment(timestamp1).isSame(moment(timestamp2), 'day');
}

export const isSameDate = (date1: Date, date2: Date): boolean => {
  return moment(date1).isSame(date2, 'day');
}


export const secondsSinceMidnight = (date: Date): number => {
  const momentDate = moment(date);
  return momentDate.seconds() + 60 * momentDate.minutes() + 3600 * momentDate.hours();
}

export const secondsToHHMM = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  return moment().startOf('day').seconds(seconds).format('hh:mm A');
}

export const getEventPeriod = (eventTime: string): string => {
  const [hours, minutes] = eventTime.split(':').map(Number);
  return moment().hours(hours).minutes(minutes).format('h:mm A');
}

export const getEventTimezoneText = (utcValue: string): string => {
  const timezone = TIMEZONES.find((tz) => tz.utc.includes(utcValue));
  return timezone ? timezone.text : utcValue;
}

export const isCurrentDateInUTC = (): number => {
  return moment().utc().startOf('day').valueOf();
}

export const getDateInUTC = (date: Date): number => {
  return moment(date).utc().startOf('day').valueOf();
}
