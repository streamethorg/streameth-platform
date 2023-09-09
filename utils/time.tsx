import moment from 'moment-timezone'

export const getTime = (date: Date): number => date.getTime()

export const extractDate = (date: Date) => date.toISOString().split('T')[0]

export const getDateAsString = (date: Date) => new Date(date).toISOString().split('T')[0]

export const getEventDays = (start: Date, end: Date): number[] => {
  // Calculate the difference in days between the two dates
  const days = Math.floor((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1

  // Generate the date options
  const dates = []
  for (let i = 0; i < days; i++) {
    const date = start.getTime() + i * 24 * 60 * 60 * 1000
    dates.push(date)
  }

  return dates
}

export const isSameDay = (timestamp1: number, timestamp2: number) => {
  return getDateAsString(new Date(timestamp1)) === getDateAsString(new Date(timestamp2))
}

export const secondsSinceMidnight = (date: Date) => {
  return date.getSeconds() + 60 * date.getMinutes() + 60 * 60 * date.getHours()
}

export const secondsToHHMM = (seconds: number) => {
  const date = new Date(0)
  
  return moment(date.setSeconds(seconds)).local().format('HH:mm')
  return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
}
