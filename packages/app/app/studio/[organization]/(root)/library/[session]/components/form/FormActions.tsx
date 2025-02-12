'use client';

import { Button } from '@/components/ui/button';
import { getFormSubmitStatus } from '@/lib/utils/utils';
import { Loader2 } from 'lucide-react';
import { UseFormReturn } from 'react-hook-form';
import * as z from 'zod';
import { sessionSchema } from '@/lib/schema';
import { useOrganizationContext } from '@/lib/context/OrganizationContext';
import { LuArrowLeft } from 'react-icons/lu';
import Link from 'next/link';
interface FormActionsProps {
  form: UseFormReturn<z.infer<typeof sessionSchema>>;
  isLoading: boolean;
}

const FormActions = ({ form, isLoading }: FormActionsProps) => {
  const { organizationId } = useOrganizationContext();
  return (
    <div className="flex justify-start items-start gap-2">
      <Link href={`/studio/${organizationId}/library`}>
        <Button variant="secondary" className="gap-2">
          <LuArrowLeft className="h-4 w-4" />
          <p>Back</p>
        </Button>
      </Link>
      <Button
        disabled={getFormSubmitStatus(form) || isLoading}
        type="submit"
        variant={'outlinePrimary'}
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
