import { TIMEZONES } from '@/app/constants/timezones'
import moment from 'moment-timezone'

export const getTime = (date: Date): number => date.getTime()

export const extractDate = (date: Date) =>
  date.toISOString().split('T')[0]

export const getDateAsString = (date: Date) =>
  new Date(date).toISOString().split('T')[0]

export const getEventDays = (start: Date, end: Date): number[] => {
  // Calculate the difference in days between the two dates
  const days =
    Math.floor(
      (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
    ) + 1

  // Generate the date options
  const dates = []
  for (let i = 0; i < days; i++) {
    const date = start.getTime() + i * 24 * 60 * 60 * 1000
    dates.push(date)
  }

  return dates
}

export const isSameDay = (timestamp1: number, timestamp2: number) => {
  return (
    getDateAsString(new Date(timestamp1)) ===
    getDateAsString(new Date(timestamp2))
  )
}

export const secondsSinceMidnight = (date: Date) => {
  return (
    date.getSeconds() +
    60 * date.getMinutes() +
    60 * 60 * date.getHours()
  )
}

export const secondsToHHMM = (seconds: number) => {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)

  const hoursStr = hours.toString().padStart(2, '0')
  const minutesStr = minutes.toString().padStart(2, '0')
  const ampm = hours >= 12 ? 'pm' : 'am'
  return `${hoursStr}:${minutesStr} ${ampm}`
}

export const getEventTime = (eventTime: string) => {
  const timeArray = eventTime.split(':')
  const date = new Date()
  date.setHours(parseInt(timeArray[0], 10))
  date.setMinutes(parseInt(timeArray[1], 10))

  const options: Intl.DateTimeFormatOptions = {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }
  const formattedTime = date.toLocaleTimeString(undefined, options)

  return formattedTime
}

export const getLocalTimezone = () => {
  const date = new Date()
  const offset = -date.getTimezoneOffset()
  const hours = Math.floor(offset / 60)
  const gmtString = 'GMT' + (offset >= 0 ? '+' : '') + hours
  return gmtString
}

export const getEventLocalTime = (
  eventTime: string,
  eventTimezone: string
) => {
  const getTimezone = TIMEZONES.find(
    (timeZone) => timeZone.text === eventTimezone
  )
  const targetOffset = getTimezone?.offset ?? 1
  const originalOffset = parseInt(
    getLocalTimezone().replace('GMT', ''),
    10
  )
  const [hours, minutes] = eventTime
    .split(':')
    .map((part) => parseInt(part, 10))

  const timeDiff = (originalOffset - targetOffset) * 60
  let newHours = hours + Math.floor(timeDiff / 60)
  let newMinutes = minutes + (timeDiff % 60)

  if (newMinutes < 0) {
    newMinutes += 60
    newHours--
  } else if (newMinutes >= 60) {
    newMinutes -= 60
    newHours++
  }

  newHours = (newHours + 24) % 24
  const newTime = `${newHours
    .toString()
    .padStart(2, '0')}:${newMinutes.toString().padStart(2, '0')}`

  return `${getEventTime(newTime)} ${getLocalTimezone()} `
}
