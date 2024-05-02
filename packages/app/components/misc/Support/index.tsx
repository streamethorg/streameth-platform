'use client'
import React, { useState } from 'react'
import { MessageCircleQuestion, X } from 'lucide-react'
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
import {
  Credenza,
  CredenzaContent,
  CredenzaTitle,
  CredenzaTrigger,
} from '@/components/ui/crezenda'
import InfoHoverCard from '../interact/InfoHoverCard'

const Support = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [messageSent, setMessageSent] = useState(false)
  const { isSignedIn } = useSIWE()
  const [open, setOpen] = useState(false)
  const form = useForm<z.infer<typeof supportSchema>>({
    resolver: zodResolver(supportSchema),
    defaultValues: {
      message: '',
      telegram: '',
      email: '',
      image: '',
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
    setOpen(false)
  }
  return (
    <Credenza open={open} onOpenChange={setOpen}>
      <CredenzaContent className="!z-[999999] p-6 md:overflow-auto max-h-[700px]">
        <CredenzaTitle>Contact Support</CredenzaTitle>
        <div>
          {messageSent && (
            <p className="font-bold pb-2">Message sent 🎉!!</p>
          )}
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

          {!isSignedIn ? (
            <div>
              <p className="py-2">Sign in to send us a message</p>
              <ConnectWalletButton />
            </div>
          ) : messageSent ? (
            <div>
              <p className="font-bold pb-2">Message sent 🎉!!</p>
              <Button onClick={handleClose}>Close</Button>
            </div>
          ) : (
            <SupportForm
              form={form}
              onSubmit={onSubmit}
              isLoading={isLoading}
              handleClose={handleClose}
            />
          )}
        </div>
      </CredenzaContent>
      <CredenzaTrigger>
        <div className="fixed bottom-4 right-0 cursor-pointer p-1 mr-1 lg:ml-0 lg:p-2">
          <div className="rounded-full p-4 bg-white shadow-xl">
            {!open ? (
              <MessageCircleQuestion className="text-muted-foreground h-7 w-7" />
            ) : (
              <X className="text-muted-foreground h-7 w-7" />
            )}
          </div>
        </div>
      </CredenzaTrigger>
    </Credenza>
  )
}

export default Support
