'use client'
import useSearchParams from '@/lib/hooks/useSearchParams'

const NavigationItem = ({
  lable,
  path,
}: {
  lable: string
  path: string
}) => {
  const { searchParams, handleTermChange } = useSearchParams()

  const active =
    searchParams.get('settingsActiveTab') === path ||
    (!searchParams.get('settingsActiveTab') && path === 'basicInfo')
  return (
    <div
      className={`flex flex-row items-center cursor-pointer space-x-2 p-2 ${
        active && 'rounded-lg border bg-gray-200'
      }`}
      onClick={() =>
        handleTermChange([
          {
            key: 'settingsActiveTab',
            value: path,
          },
        ])
      }>
      <button className={!active ? 'text-muted-foreground' : ''}>
        {lable}
      </button>
    </div>
  )
}

export default NavigationItem
