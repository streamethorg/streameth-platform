'use client';

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { UseFormReturn } from 'react-hook-form';
import * as z from 'zod';
import { sessionSchema } from '@/lib/schema';

interface BasicFormFieldsProps {
  form: UseFormReturn<z.infer<typeof sessionSchema>>;
}

const BasicFormFields = ({ form }: BasicFormFieldsProps) => {
  return (
    <>
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel required>Video title</FormLabel>
            <FormControl>
              <Input
                className="bg-white rounded-md border border-gray-300"
                placeholder="name"
                {...field}
              />
            </FormControl>
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="description"
        render={({ field }) => (
          <FormItem className="h-50">
            <FormLabel required>Description</FormLabel>
            <FormControl>
              <Textarea
                className="bg-white rounded-md border border-gray-300"
                placeholder="description"
                {...field}
              />
            </FormControl>
          </FormItem>
        )}
      />
    </>
  );
};

export default BasicFormFields;
