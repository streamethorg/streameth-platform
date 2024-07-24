'use client'
import { Tabs, TabsTrigger, TabsList } from '@/components/ui/tabs'
import useSearchParams from '@/lib/hooks/useSearchParams'
import { useRouter } from 'next/navigation'

const ExploreTabs = () => {
  const { handleTermChange, searchParams } = useSearchParams()
  const router = useRouter()
  const currentTerm = searchParams.get('searchQuery') || ''

  const tabData = [
    { name: 'Home', searchQuery: '' },
    { name: 'Vitalik', searchQuery: 'vitalik' },
    { name: 'Zk', searchQuery: 'zk' },
    { name: 'Identity', searchQuery: 'identity' },
    { name: 'DAO', searchQuery: 'dao' },
    { name: 'Network States', searchQuery: 'network states' },
    { name: 'Fire side chat', searchQuery: 'fire side chat' },
    { name: 'Cryptography', searchQuery: 'cryptography' },
  ]

  const handleTabChange = (value: string) => {
    const newParams = new URLSearchParams(searchParams)
    newParams.set('searchQuery', value)
    newParams.delete('page')

    const newUrl = `${window.location.pathname}?${newParams.toString()}`
    router.push(newUrl)
  }

  return (
    <Tabs
      defaultValue={currentTerm}
      className="w-full"
      onValueChange={handleTabChange}>
      <TabsList className="flex flex-wrap justify-center">
        {tabData.map((tab) => (
          <TabsTrigger
            key={tab.name}
            value={tab.searchQuery}
            className="px-4 py-2 text-sm font-medium">
            {tab.name}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  )
}

export default ExploreTabs
