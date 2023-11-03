export const STAGE_ID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

export async function GetEvents() {
  const res = await fetch(
    'https://app.streameth.org/api/events?inclStages=true'
  )
  const data = await res.json()

  return data.filter(
    (i: any) =>
      !i.archiveMode &&
      i.stages?.length > 0 &&
      i.stages.some((s: any) =>
        STAGE_ID_PATTERN.test(s.streamSettings?.streamId)
      )
  )
}

export function FilterValidStages(stages: any[]) {
  return stages.filter((i) =>
    STAGE_ID_PATTERN.test(i.streamSettings?.streamId)
  )
}
