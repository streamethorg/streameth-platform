'use client';

import { Button } from '@/components/ui/button';
import { IExtendedSession } from '@/lib/types';
import { getFormSubmitStatus } from '@/lib/utils/utils';
import { Loader2, Trash2 } from 'lucide-react';
import { UseFormReturn } from 'react-hook-form';
import * as z from 'zod';
import { sessionSchema } from '@/lib/schema';
import DeleteAsset from '../../../components/DeleteAsset';

interface FormActionsProps {
  form: UseFormReturn<z.infer<typeof sessionSchema>>;
  session: IExtendedSession;
  organizationSlug: string;
  isLoading: boolean;
}

const FormActions = ({ form, session, organizationSlug, isLoading }: FormActionsProps) => {
  return (
    <div className="flex justify-start items-start space-x-2">
      <DeleteAsset
        session={session}
        href={`/studio/${organizationSlug}/library`}
        TriggerComponent={
          <Button
            variant={'destructive-outline'}
            className="space-x-2 hover:bg-gray-100"
          >
            <Trash2 />
            <p>Delete video</p>
          </Button>
        }
      />
      <Button
        disabled={getFormSubmitStatus(form) || isLoading}
        type="submit"
        variant={'primary'}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 w-4 h-4 animate-spin" />
            Please wait...
          </>
        ) : (
          'Update details'
        )}
      </Button>
    </div>
  );
};

export default FormActions; 