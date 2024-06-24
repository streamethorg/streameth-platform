import {
  Card,
  CardDescription,
  CardTitle,
} from '@/components/ui/card'
import YoutubeIcon from '@/lib/svg/YoutubeIcon'
import { IExtendedOrganization } from '@/lib/types'
import Image from 'next/image'
import React from 'react'
import DeleteDestination from './DeleteDestination'

const Destinations = ({
  organization,
}: {
  organization: IExtendedOrganization
}) => {
  return (
    <div className="h-full">
      <CardTitle>Destinations</CardTitle>

      <Card className="mt-10 shadow-none">
        <div className="grid grid-cols-5 p-4 border-opacity-10">
          <p className="col-span-3">Name</p>
        </div>
        {organization?.socials?.map(
          ({ _id, name, type, thumbnail }) => (
            <div
              key={_id}
              className="grid grid-cols-5 gap-4 border-t p-4 border-opacity-10 items-center">
              <div className="col-span-4 flex items-center gap-4">
                <div className="relative">
                  <Image
                    className="rounded-full"
                    src={thumbnail!}
                    width={50}
                    height={50}
                    alt={type}
                  />

                  <YoutubeIcon className="absolute max-w-5 max-h-5 right-0 bottom-0 fill-destructive" />
                </div>

                <div>
                  <p className="font-semibold">{name}</p>
                  <p className="capitalize text-sm text-ext-muted">
                    {type}
                  </p>
                </div>
              </div>
              <DeleteDestination
                destinationId={_id}
                organizationId={organization._id}
              />
            </div>
          )
        )}
      </Card>
    </div>
  )
}

export default Destinations
