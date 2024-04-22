import moment from 'moment-timezone'
import { IExtendedSession } from '../types'

export function generateTimezones() {
  const timezones = moment.tz.names()
  return timezones.map((timezone) => {
    const gmtOffset = moment.tz(timezone).utcOffset()
    const gmtOffsetString =
      gmtOffset === 0
        ? 'GMT'
        : `GMT${moment.tz(timezone).format('Z')}`

    return {
      label: timezone,
      value: timezone,
      abbr: gmtOffsetString,
    }
  })
}

export const getTime = (date: Date): number => moment(date).valueOf()

export const formatDate = (
  date: Date,
  format = 'YYYY-MM-DD'
): string => moment(date).format(format)

export const getEventDays = (start: Date, end: Date): number[] => {
  const startDate = moment(start)
  const endDate = moment(end)
  const days = endDate.diff(startDate, 'days') + 1
  const dates: number[] = []

  for (let i = 0; i < days; i++) {
    dates.push(startDate.clone().add(i, 'days').valueOf())
  }

  return dates
}

export const isSameDay = (
  timestamp1: number,
  timestamp2: number
): boolean => {
  return moment(timestamp1).isSame(moment(timestamp2), 'day')
}

export const isSameDate = (date1: Date, date2: Date): boolean => {
  return moment(date1).isSame(date2, 'day')
}

export const secondsSinceMidnight = (date: Date): number => {
  const momentDate = moment(date)
  return (
    momentDate.seconds() +
    60 * momentDate.minutes() +
    3600 * momentDate.hours()
  )
}

export const secondsToHHMM = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  return moment().startOf('day').seconds(seconds).format('hh:mm A')
}

export const getEventPeriod = (eventTime: string): string => {
  const [hours, minutes] = eventTime.split(':').map(Number)
  return moment().hours(hours).minutes(minutes).format('h:mm A')
}

export const getEventTimezoneText = (utcValue: string): string => {
  const timezone = generateTimezones().find(
    (tz) => tz.value.toLowerCase() === utcValue.toLowerCase()
  )

  return timezone ? timezone.abbr : utcValue
}

export const isCurrentDateInUTC = (): number => {
  return moment().utc().startOf('day').valueOf()
}

export const getDateInUTC = (date: Date): number => {
  return moment(date).utc().startOf('day').valueOf()
}

export const getSessionDays = (sessions: IExtendedSession[]) => {
  // Create a Set to store unique dates
  const uniqueDates = new Set()

  // Iterate through sessions to extract and filter dates
  sessions.forEach((session) => {
    const sessionDate = new Date(session.start).toDateString()
    uniqueDates.add(sessionDate)
  })

  // Convert Set to array and convert each date to timestamp
  const uniqueDatesArray = Array.from(uniqueDates)
  const uniqueTimestampsArray = uniqueDatesArray.map((dateString) =>
    new Date(dateString as string).getTime()
  )

  return uniqueTimestampsArray
}

export const getDateWithTime = (date: Date, time: string) => {
  const dateInput = formatDate(new Date(date), 'YYYY-MM-DD')
  return new Date(`${dateInput}T${time}`)
}
