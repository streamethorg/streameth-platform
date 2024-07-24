'use client'
import {
  Tabs,
  TabsTrigger,
  TabsList,
  TabsContent,
} from '@/components/ui/tabs'
import useSearchParams from '@/lib/hooks/useSearchParams'

const ExploreTabs = () => {
  const { handleTermChange, searchParams } = useSearchParams()
  const currentTerm = searchParams.get('searchQuery') || ''

  const tabData = [
    { name: 'All', searchQuery: '' },
    { name: 'Vitalik', searchQuery: 'vitalik' },
    { name: 'Zk', searchQuery: 'zk' },
    { name: 'Identity', searchQuery: 'identity' },
    { name: 'DAO', searchQuery: 'dao' },
    { name: 'Network States', searchQuery: 'network states' },
    { name: 'Fire side chat', searchQuery: 'fire side chat' },
    { name: 'Cryptography', searchQuery: 'cryptography' },
  ]

  return (
    <Tabs
      defaultValue={currentTerm}
      className="w-full"
      onValueChange={(value) =>
        handleTermChange([{ key: 'searchQuery', value }])
      }>
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
