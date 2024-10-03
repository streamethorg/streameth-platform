import { useSIWE } from 'connectkit';
import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import { fetchUserAction } from '../actions/users';
import { IExtendedUser } from '../types';

const useUserData = () => {
  const { isSignedIn } = useSIWE();
  const { address } = useAccount();
  const [userData, setUserData] = useState<IExtendedUser>();
  useEffect(() => {
    const getUserData = async () => {
      try {
        const userData = await fetchUserAction();
        setUserData(userData);
      } catch (error) {
        console.error(error);
      }
    };
    if (isSignedIn && address) getUserData();
  }, [isSignedIn, address]);

  return { userData };
};

export default useUserData;
