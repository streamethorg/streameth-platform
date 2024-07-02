'use client'
import React, { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { addOrganizationMemberAction } from '@/lib/actions/organizations'
import { toast } from 'sonner'
import { addOrganizationMemberSchema } from '@/lib/schema'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useForm } from 'react-hook-form'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'

const AddTeamMembers = ({
  organizationId,
}: {
  organizationId: string
}) => {
  const [isAddingMember, setIsAddingMember] = useState(false)

  const form = useForm<z.infer<typeof addOrganizationMemberSchema>>({
    resolver: zodResolver(addOrganizationMemberSchema),
    defaultValues: {
      memberAddress: '',
    },
  })
  function onSubmit(
    values: z.infer<typeof addOrganizationMemberSchema>
  ) {
    setIsAddingMember(true)
    addOrganizationMemberAction({
      memberAddress: values.memberAddress,
      organizationId,
    })
      .then((response) => {
        if (response) {
          toast.success('Member Added to Organization')
          form.reset()
        } else {
          toast.error('Error adding team member')
        }
      })
      .catch(() => {
        toast.error('Error adding team member')
      })
      .finally(() => {
        setIsAddingMember(false)
      })
  }
  return (
    <Form {...form}>
      <form
        onError={(errors) => {}}
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4">
        <div className="flex gap-3">
          {/* <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl>
                  <Input placeholder="Enter Name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          /> */}
          <FormField
            control={form.control}
            name="memberAddress"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl>
                  <Input
                    placeholder="Enter email or wallet address"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            disabled={isAddingMember}
            variant="outlinePrimary"
            type="submit">
            Invite
          </Button>
        </div>
      </form>
    </Form>
  )
}

export default AddTeamMembers
