export const getTime = (date: Date): number => date.getTime()

export const extractDate = (date: Date) => date.toISOString().split('T')[0]

export const getDateAsString = (date: Date) => new Date(date).toISOString().split('T')[0]


export const sessionInDateRange = (days:number[], timestamp:number ): number => {
  const date = new Date(timestamp)
  const dateString = extractDate(date)
  return days[days.indexOf(getTime(new Date(dateString)))]
}
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

export const getDateFromSessionTimestamp = (timestamp: number) => {
  const date = new Date(timestamp)
  return new Date(date.getFullYear(), date.getMonth(), date.getDate())
}

export const secondsSinceMidnight = (date: Date) => {
  return date.getSeconds() + 
         (60 * date.getMinutes()) + 
         (60 * 60 * date.getHours());
};

export const secondsToHHMM = (seconds: number) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  const hoursStr = String(hours).padStart(2, '0');
  const minutesStr = String(minutes).padStart(2, '0');

  return `${hoursStr}:${minutesStr}`;
};