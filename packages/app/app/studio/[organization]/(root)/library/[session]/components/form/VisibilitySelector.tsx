'use client';

import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UseFormReturn } from 'react-hook-form';
import * as z from 'zod';
import { sessionSchema } from '@/lib/schema';
import { eVisibilty } from 'streameth-new-server/src/interfaces/session.interface';

interface VisibilitySelectorProps {
  form: UseFormReturn<z.infer<typeof sessionSchema>>;
}

const VisibilitySelector = ({ form }: VisibilitySelectorProps) => {
  return (
    <FormField
      control={form.control}
      name="published"
      render={({ field }) => (
        <FormItem className="w-[200px]">
          <FormLabel>Visibility</FormLabel>
          <FormControl>
            <Select
              value={field.value}
              onValueChange={(value) => {
                field.onChange(value);
              }}
            >
              <SelectTrigger className="bg-white">
                <SelectValue placeholder="Select visibility" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={eVisibilty.public}>Public</SelectItem>
                <SelectItem value={eVisibilty.unlisted}>Unlisted</SelectItem>
                <SelectItem value={eVisibilty.private}>Private</SelectItem>
              </SelectContent>
            </Select>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default VisibilitySelector; 