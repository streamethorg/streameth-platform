import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from '@/components/ui/select'

const TimePicker = ({
  value,
  onChange,
}: {
  value: string
  onChange: (value: string) => void
}) => {
  return (
    <Select
      onValueChange={(value) => {
        console.log(value)
        onChange(value)
      }}
      defaultValue={value}>
      <SelectTrigger>
        {value ? (
          value
        ) : (
          <span className="text-muted-foreground">select time</span>
        )}
      </SelectTrigger>
      <SelectContent>
        {generateTimeOptions(30).map((time) => (
          <SelectItem key={time} value={time}>
            {time}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

export default TimePicker

function generateTimeOptions(interval: number) {
  const times = []
  for (let hour = 0; hour < 24; hour++) {
    for (let minute = 0; minute < 60; minute += interval) {
      const timeString = `${hour.toString().padStart(2, '0')}:${minute
        .toString()
        .padStart(2, '0')} ${hour < 12 ? 'AM' : 'PM'}`
      times.push(timeString)
    }
  }
  return times
}
