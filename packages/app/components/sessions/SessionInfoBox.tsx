'use server'

import { CardTitle } from '@/components/ui/card'
import InfoBoxDescription from './InfoBoxDescription'
import { IExtendedSession, IExtendedStage } from '@/lib/types'
import { formatDate } from '@/lib/utils/time'
import SignUp from '../plugins/SignUp'

const SessionInfoBox = async ({
  name,
  description,
  inverted,
  date,
  vod = false,
}: {
  name: string
  description: string
  date: string
  inverted?: boolean
  vod?: boolean
}) => {

  return (
    <div
      className={`flex flex-col md:flex-row py-4 md:space-x-2  ${
        inverted ? 'text-white rounded-lg  text-card-foreground ' : ''
      }`}>
      <div className="flex flex-col justify-start w-full">
        <CardTitle className="flex flex-row justify-between items-start text-xl lg:text-2xl">
          <span>{name}</span>
        </CardTitle>
        <InfoBoxDescription
          description={description}
        />
        <p className="">
          {formatDate(
            new Date(date),
            'ddd. MMMM. D, YYYY'
          )}
        </p>
      </div>
      <div className="flex justify-between items-center mb-auto space-x-2 md:justify-end">
        {/* <SignUp event={name} /> */}
      </div>
    </div>
  )
}

export default SessionInfoBox
