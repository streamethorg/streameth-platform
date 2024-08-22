'use client';
import DatePicker from '@/components/misc/form/datePicker';
import ImageUpload from '@/components/misc/form/imageUpload';
import TimePicker from '@/components/misc/form/timePicker';
import { CardTitle } from '@/components/ui/card';
import Combobox from '@/components/ui/combo-box';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { NftCollectionType } from 'streameth-new-server/src/interfaces/nft.collection.interface';

const CollectionDetails = ({
  form,
  type,
}: {
  type: NftCollectionType;
  form: UseFormReturn<{
    description: string;
    name: string;
    symbol: string;
    mintFee: string;
    thumbnail: string;
    // startDate: Date
    // startTime: string
    // endDate: Date
    // endTime: string
    limitedSupply: string;
    maxSupply: string;
  }>;
}) => {
  return (
    <div>
      <CardTitle className="mb-4 text-2xl font-semibold">
        {type === 'multiple' ? 'Collection' : 'NFT'} Details
      </CardTitle>
      <Form {...form}>
        <form
          className="space-y-4"
          // onSubmit={form.handleSubmit(onSubmit)}
        >
          <div className="flex gap-4 items-center h-full">
            <FormField
              control={form.control}
              name="thumbnail"
              render={({ field }) => (
                <FormItem className="">
                  <FormControl>
                    <ImageUpload
                      options={{
                        aspectRatio: 1,
                        resize: false,
                      }}
                      className="rounded-xl aspect-square h-[100px] bg-neutrals-300"
                      path={`nftcollections`}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div>
              <p className="mb-2 font-medium">
                Thumbnail <span className="text-destructive">*</span>
              </p>
              <p className="text-sm">
                Drag or click to upload your logo image here.{' '}
              </p>
              <p className="text-[12px] text-muted-foreground">
                You may change this after deploying your contract. Recommended
                size: 500 x 500. File types: JPG, PNG, SVG or GIF
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
                  <Input placeholder="NFT Collection Name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex flex-col gap-4 w-full lg:flex-row">
            <FormField
              control={form.control}
              name="symbol"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel required className="">
                    Symbol
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Symbol" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="mintFee"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel required className="">
                    Mint Fee
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="0"
                      placeholder="Mint Fee"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          {/*//// Temp hiding this    
          {/* <div className="flex flex-col gap-4 w-full lg:flex-row">
            <FormField
              control={form.control}
              name="startDate"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel required>Start Date</FormLabel>
                  <FormControl>
                    <DatePicker
                      value={field.value as Date}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="startTime"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel required>Start Time</FormLabel>
                  <FormControl>
                    <TimePicker
                      value={field.value}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex flex-col gap-4 w-full lg:flex-row">
            <FormField
              control={form.control}
              name="endDate"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel required>End Date</FormLabel>
                  <FormControl>
                    <DatePicker
                      value={field.value as Date}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="endTime"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel required>End Time</FormLabel>
                  <FormControl>
                    <TimePicker
                      value={field.value}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div> */}
          <div className="flex flex-col gap-4 w-full lg:flex-row">
            <FormField
              control={form.control}
              name="limitedSupply"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Limited Supply?</FormLabel>
                  <FormControl>
                    <Combobox
                      items={[
                        { value: 'false', label: 'false' },
                        { value: 'true', label: 'true' },
                      ]}
                      value={field.value}
                      setValue={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="maxSupply"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel required>Max Supply</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="0"
                      placeholder="Max Supply"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
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
                    className="rounded-xl h-[200px] bg-muted"
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
  );
};

export default CollectionDetails;
