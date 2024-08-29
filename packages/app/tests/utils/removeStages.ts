import { deleteStage, fetchStages } from '@/lib/services/stageService';
import { BrowserContext } from '@playwright/test';
import { IOrganization } from 'streameth-new-server/src/interfaces/organization.interface';

export const removeStage = async (
  context: BrowserContext,
  organization: IOrganization
) => {
  const cookies = await context.cookies();
  const authtoken =
    cookies.find((cookie) => cookie.name === 'user-session')?.value || '';
  const stages = await fetchStages({
    organizationId: organization._id?.toString() || '',
  });

  stages.map(async (stage) => {
    await deleteStage({
      stageId: stage._id!,
      organizationId: organization._id?.toString() || '',
      authToken: authtoken,
    });

    console.log('Removed stage');
  });
};
