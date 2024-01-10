"use server"
import { formSchema } from "@/app/studio/event/create/lib/schema"
import { redirect } from 'next/navigation';

export async function createEvent(formData: FormData) {
  const data = await formSchema.parseAsync(formData)
  redirect('/studio/event/create?step=2');
  return data
}