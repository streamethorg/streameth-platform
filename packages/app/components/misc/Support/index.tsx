'use client'
import React, { useState } from 'react'
import { Bug } from 'lucide-react'
import { createSupportTicketAction } from '@/lib/actions/support'
import { supportSchema } from '@/lib/schema'
import * as z from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { useSIWE } from 'connectkit'

import SupportForm from './SupportForm'
import { Button } from '../../ui/button'
import { ConnectWalletButton } from '../ConnectWalletButton'

const Support = () => {
  const [isSupportClicked, setIsSupportClicked] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [messageSent, setMessageSent] = useState(false)
  const { isSignedIn } = useSIWE()
  const form = useForm<z.infer<typeof supportSchema>>({
    resolver: zodResolver(supportSchema),
    defaultValues: {
      message: '',
    },
  })

  function onSubmit(values: z.infer<typeof supportSchema>) {
    setIsLoading(true)
    if (!isSignedIn) {
      toast.error('No wallet address found')
      return
    }
    createSupportTicketAction({
      ...values,
    })
      .then(() => {
        setMessageSent(true)
        toast.success('ticket created')
        form.reset()
      })
      .catch(() => {
        toast.error('Error creating ticket')
      })
      .finally(() => {
        setIsLoading(false)
      })
  }

  const handleClose = () => {
    setMessageSent(false)
    setIsSupportClicked(false)
  }
  return (
    <div className="fixed right-2 top-36 bg-white cursor-pointer p-4">
      {!isSupportClicked && (
        <div onClick={() => setIsSupportClicked(true)}>
          <Bug />
        </div>
      )}

      {isSupportClicked &&
        (!isSignedIn ? (
          <div>
            <p className="py-2">Sign in to send us a message</p>
            <ConnectWalletButton />
          </div>
        ) : messageSent ? (
          <div className="w-[250px]">
            <p className="font-bold pb-2">Message sent 🎉!!</p>
            <p className="pb-2">
              Feel free to become a part of our{' '}
              <a
                className="text-primary font-semibold"
                href="https://t.me/+p7TgdE06G-4zZDU0"
                target="_blank"
                rel="noopener noopener">
                Telegram support
              </a>{' '}
              channel to stay informed about ticket updates, or
              alternatively, you can raise an issue on{' '}
              <a
                className="text-primary font-semibold"
                href="https://github.com/streamethorg/streameth-platform/issues"
                target="_blank"
                rel="noopener noopener">
                GitHub.
              </a>
            </p>
            <Button onClick={handleClose}>Close</Button>
          </div>
        ) : (
          <SupportForm
            form={form}
            onSubmit={onSubmit}
            isLoading={isLoading}
            handleClose={handleClose}
          />
        ))}
    </div>
  )
}

export default Support
