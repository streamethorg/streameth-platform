import { ISpeaker } from 'streameth-new-server/src/interfaces/speaker.interface'
import SpeakerIcon from '@/components/speakers/speakerIcon'
import { useEffect, useState } from 'react'
import { apiUrl, cn } from '@/lib/utils/utils'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'

const AddSpeakersInput = ({
  speakers,
  eventId,
}: {
  speakers: ISpeaker[]
  eventId: string
}) => {
  console.log(speakers)
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState('')
  const [allSpeakers, setAllSpeakers] = useState<ISpeaker[]>([])
  const fetchSpeakers = async (): Promise<any> =>
    fetch(`${apiUrl()}/speakers/event/${eventId}`).then((res) =>
      res.json()
    )

  useEffect(() => {
    fetchSpeakers().then((speakers) => setAllSpeakers(speakers.data))
  }, [])

  return (
    <div>
      <div className="flex flex-row flex-wrap">
        {speakers.map((speaker) => (
          <SpeakerIcon key={speaker._id} speaker={speaker} />
        ))}
      </div>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-[200px] justify-between">
            {value
              ? allSpeakers.find((speaker) => speaker._id === value)
                  ?.name
              : 'Select speaker...'}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <Command>
            <CommandInput
              placeholder="Search speaker..."
              className="h-9"
            />
            <CommandEmpty>No speaker found.</CommandEmpty>
            <CommandGroup>
              {allSpeakers.map((speaker) => (
                <CommandItem
                  key={speaker.name}
                  value={speaker._id}
                  onSelect={(currentValue) => {
                    setValue(
                      currentValue === value ? '' : currentValue
                    )
                    setOpen(false)
                  }}>
                  {speaker.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  )
}

export default AddSpeakersInput
