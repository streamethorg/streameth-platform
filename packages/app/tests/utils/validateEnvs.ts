import { validateEnv } from '@/lib/utils/utils';
import { exit } from 'process';

export const validateEnvs = () => {
  try {
    validateEnv('PRIVY_EMAIL');
    validateEnv('PRIVY_OTP');
    validateEnv('NEXT_PUBLIC_API_URL');
  } catch (error) {
    console.log(error);
    exit;
  }
};
