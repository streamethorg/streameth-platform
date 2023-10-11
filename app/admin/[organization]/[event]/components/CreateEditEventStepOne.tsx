'use client'

import React, { Dispatch, SetStateAction } from 'react'
import FormLabel from '@/app/utils/FormLabel'
import { FormTextArea } from '@/app/utils/FormTextArea'
import { FormTextInput } from '@/app/utils/FormTextInput'
import { IEvent } from '@/server/model/event'
import StatusBarOneIcon from '@/app/assets/icons/StatusBarOneIcon'
import { Button } from '@/app/utils/Button'

interface Props {
  formData: Omit<IEvent, 'id'>
  setFormData: Dispatch<SetStateAction<Omit<IEvent, 'id'>>>
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void
}

const CreateEditEventStepOne = ({ handleChange, formData, setFormData }: Props) => {
  return (
    <div>
      <div className="flex items-start justify-between mt-5 mb-10">
        <div>
          <FormLabel label="Event's Logo" required toolTip toolTipHTML="Click to edit image" />
          <img src={`/events/${formData.logo}`} className="rounded-full min-w-[158px] h-[158px]" />
        </div>

        <div>
          <FormLabel label="Event's Cover Image" toolTip />
          <img src={`/events/${formData.eventCover}`} className="w-[258px] h-[158px]" />
        </div>

        <div>
          <FormLabel label="Event's Banner Image" toolTip />
          <img src={`/events/${formData.banner}`} className="w-[330px] h-[158px]" />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <FormTextInput
          label="Event's Name"
          name="name"
          placeholder="E.g. Ethereum Stream"
          required
          toolTip
          value={formData.name}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange(e)}
        />
        <FormTextArea
          label="Description"
          name="description"
          placeholder="E.g. Ethereum Streaming: Unveil blockchain's potential. Dive into Ethereum's world with experts, trends, and innovations. Join the revolution. Don't miss out!"
          required
          toolTip
          value={formData.description}
          onChange={handleChange}
        />
        <FormTextInput
          label="Location"
          name="location"
          placeholder="E.g. Madrid, Spain"
          required
          toolTip
          value={formData.location}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange(e)}
        />
        <FormTextInput
          label="Select your event start date"
          placeholder="E.g. 12-16 November 2023"
          required
          toolTip
          type="date"
          name="start"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange(e)}
          value={formData.start instanceof Date ? formData.start.toISOString().split('T')[0] : formData.start}
        />
        <FormTextInput
          label="Select your event end date"
          placeholder="E.g. 12-16 November 2023"
          required
          toolTip
          type="date"
          name="end"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange(e)}
          value={formData.end instanceof Date ? formData.end.toISOString().split('T')[0] : formData.end}
        />
        <FormTextInput
          label="Timezone"
          required
          toolTip
          name="timezone"
          placeholder="Timezone"
          value={formData.timezone}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange(e)}
        />
      </div>

      <div className="flex justify-end items-center gap-5">
        <div className="flex items-center gap-2">
          <p className="text-accent text-sm">1/3</p>
          <StatusBarOneIcon />
        </div>
        <Button variant="outline">Next page</Button>
      </div>
    </div>
  )
}

export default CreateEditEventStepOne
