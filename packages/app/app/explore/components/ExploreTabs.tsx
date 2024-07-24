'use client'
import { Tabs, TabsTrigger, TabsList } from '@/components/ui/tabs'
import useSearchParams from '@/lib/hooks/useSearchParams'

const ExploreTabs = () => {
  const { handleTermChange, searchParams } = useSearchParams()
  const currentTerm = searchParams.get('searchQuery')
  const tabData = [
    {
      name: 'Home',
      searchQuery: '',
    },
    {
      name: 'Vitalik',
      searchQuery: 'vitalik',
    },
    {
      name: 'Zk',
      searchQuery: 'zk',
    },
    {
      name: 'Identity',
      searchQuery: 'identity',
    },
    {
      name: 'DAO',
      searchQuery: 'dao',
    },
    {
      name: 'Network States',
      searchQuery: 'network states',
    },
    {
      name: 'Fire side chat',
      searchQuery: 'fire side chat',
    },
    {
      name: 'cryptography',
      searchQuery: 'cryptography',
    },
  ]

  return (
    <Tabs
      defaultValue={currentTerm ?? 'home'}
      onValueChange={(e) =>
        handleTermChange([
          {
            key: 'searchQuery',
            value: e,
          },
        ])
      }>
      <TabsList>
        {tabData.map((tab) => (
          <TabsTrigger key={tab.name} value={tab.searchQuery}>
            {tab.name}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  )
}

export default ExploreTabs
