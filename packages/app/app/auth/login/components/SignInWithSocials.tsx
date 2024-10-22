'use client';

import { signIn } from 'next-auth/react';
import { Button } from '../../../../components/ui/button';
import { SiGoogle } from 'react-icons/si';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { EmailSignInSchema } from '@/lib/schema';
import { magicLinkSignInAction } from '@/lib/actions/auth';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const SignInWithSocials = ({ callbackUrl }: { callbackUrl: string }) => {
  const [isSendingMagicLink, setIsSendingMagicLink] = useState(false);
  const router = useRouter();
  const form = useForm<z.infer<typeof EmailSignInSchema>>({
    resolver: zodResolver(EmailSignInSchema),
    defaultValues: {
      email: '',
    },
  });

  const handleOnClick = () => {
    signIn('google', {
      callbackUrl: callbackUrl,
    });
  };

  const onSubmit = async (values: z.infer<typeof EmailSignInSchema>) => {
    setIsSendingMagicLink(true);
    try {
      // call magic link action
      const response = await magicLinkSignInAction({
        email: values.email.trim(),
      });
      if (response) {
        router.push('/auth/auth-success');
      }
    } catch (error) {
      console.error(error);
      router.push('/auth/auth-error');
    }
    setIsSendingMagicLink(false);
  };

  return (
    <div className="flex w-full flex-col space-y-4">
      <div className=" flex items-center justify-center">
        <Button
          onClick={() => handleOnClick()}
          className="w-4/5 rounded-xl border bg-white text-black gap-2"
          size="lg"
        >
          <SiGoogle className="h-5 w-5" />
          Continue with Google
        </Button>
      </div>

      <div className="flex items-center my-8">
        <div className="flex-grow border-t border-gray-300"></div>
        <span className="px-4 text-gray-500 text-sm">or</span>
        <div className="flex-grow border-t border-gray-300"></div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="w-4/5 mx-auto">
                <FormLabel>
                  Enter your email below to receive a magic sign-in link.
                </FormLabel>
                <FormControl>
                  <Input
                    className="bg-white"
                    {...field}
                    placeholder="example@domain.com"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            loading={isSendingMagicLink}
            type="submit"
            className="ml-auto w-4/5"
          >
            Continue with email
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default SignInWithSocials;
