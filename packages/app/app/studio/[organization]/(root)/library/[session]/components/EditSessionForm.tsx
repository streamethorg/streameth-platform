'use client';

import { Form } from '@/components/ui/form';
import { updateSessionAction } from '@/lib/actions/sessions';
import { sessionSchema } from '@/lib/schema';
import { IExtendedSession } from '@/lib/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';
import BasicFormFields from './form/BasicFormFields';
import VisibilitySelector from './form/VisibilitySelector';
import ThumbnailSection from './form/ThumbnailSection';
import FormActions from './form/FormActions';
import { createSessionUpdatePayload } from './form/utils';

const EditSessionForm = ({
  session,
  organizationSlug,
}: {
  session: IExtendedSession;
  organizationSlug: string;
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof sessionSchema>>({
    resolver: zodResolver(sessionSchema),
    defaultValues: {
      name: session.name,
      description: session.description,
      coverImage: session.coverImage,
      assetId: session.assetId,
      published: session.published,
    },
  });

  function onSubmit(values: z.infer<typeof sessionSchema>) {
    setIsLoading(true);

    updateSessionAction(createSessionUpdatePayload(values, session))
      .then(() => {
        toast.success('Session updated');
        form.reset(values); // Reset the form with the current values
      })
      .catch(() => toast.error('Error updating session'))
      .finally(() => {
        setIsLoading(false);
        router.refresh();
      });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <BasicFormFields form={form} />
        <VisibilitySelector form={form} />
        <ThumbnailSection
          form={form}
          session={session}
          organizationSlug={organizationSlug}
        />
        <FormActions
          form={form}
          session={session}
          organizationSlug={organizationSlug}
          isLoading={isLoading}
        />
      </form>
    </Form>
  );
};

export default EditSessionForm;
