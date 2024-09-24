import { fetchStage } from '@/lib/services/stageService';

const StageName = async ({ stageId }: { stageId: string }) => {
  console.log('stageId', stageId);
  const stage = await fetchStage({ stage: stageId });
  console.log('stage', stage);
  if (!stage) return <span>Stage not found</span>;
  return <span>{stage.name}</span>;
};

export default StageName;
