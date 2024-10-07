'use server';

import { IState } from 'streameth-new-server/src/interfaces/state.interface';
import { createState } from '../services/stateService';

export const createStateAction = async ({ state }: { state: IState }) => {
  const response = await createState({
    state,
  });
  if (!response) {
    throw new Error('Error creating state');
  }
  return response;
};
