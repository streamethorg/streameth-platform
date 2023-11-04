import Studio from './components/Studio'
import { GetEvents } from './utils/client'

export default async function Page() {
  const events = await GetEvents()

  return <Studio events={events} />
}
