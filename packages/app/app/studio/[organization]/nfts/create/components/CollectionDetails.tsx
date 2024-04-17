'use client'
import ImageUpload from '@/components/misc/form/imageUpload'
import { CardTitle } from '@/components/ui/card'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

import React from 'react'
import { UseFormReturn } from 'react-hook-form'

const CollectionDetails = ({
  form,
}: {
  form: UseFormReturn<{
    description: string
    name: string

    thumbnail?: string | undefined
  }>
}) => {
  return (
    <div>
      <CardTitle className="text-2xl font-semibold mb-4">
        Collection Details
      </CardTitle>
      <Form {...form}>
        <form
          className="space-y-4"
          // onSubmit={form.handleSubmit(onSubmit)}
        >
          <div className="flex h-full items-center gap-4">
            <FormField
              control={form.control}
              name="thumbnail"
              render={({ field }) => (
                <FormItem className="">
                  <FormControl>
                    <ImageUpload
                      className="aspect-square h-[100px] rounded-xl bg-neutrals-300 "
                      aspectRatio={1}
                      path={`nftcollections`}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div>
              <p className="font-medium mb-2">
                Thumbnail <span className="text-destructive">*</span>
              </p>
              <p className="text-sm">
                Drag or click to upload your logo image here.{' '}
              </p>
              <p className="text-[12px] text-muted-foreground">
                You may change this after deploying your contract.
                Recommended size: 500 x 500. File types: JPG, PNG, SVG
                or GIF
              </p>
            </div>
          </div>
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel required className="">
                  Name
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="NFT Collection Name"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel required className="">
                  Description
                </FormLabel>
                <FormControl>
                  <Textarea
                    className="h-[200px] rounded-xl bg-muted"
                    placeholder="Brief description about your NFT collection"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>
    </div>
  )
}

export default CollectionDetails
