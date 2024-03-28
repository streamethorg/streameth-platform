import { Livepeer } from 'livepeer'

const ClipStatus = async ({ assetId }: { assetId: string }) => {
  const livepeer = new Livepeer({
    apiKey: process.env.LIVEPEER_API_KEY,
  })

  const currentClip = (await livepeer.asset.get(assetId)).asset

  return (
    <div className="flex flex-col mr-auto">
      <p>Clip processing: {currentClip?.status?.phase}</p>
      <p>Progress: {currentClip?.status?.progress}</p>
      {currentClip?.status?.errorMessage && (
        <p>Error: {currentClip?.status?.errorMessage}</p>
      )}
    </div>
  )
}

export default ClipStatus
