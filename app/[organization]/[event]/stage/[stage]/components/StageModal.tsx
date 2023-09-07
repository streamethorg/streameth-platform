import { usePathname } from 'next/navigation'
import { Page } from '@/components/Layout/Navbar'

const  StageModal = ({ stages, handleClick }: { stages: Page[]; handleClick: (stageHref: string) => void }) => {
  const pathname = usePathname()

  return (
    <div className="flex flex-col items-center justify-center">
      <h1 className="font-bold uppercase mb-2 text-accent">Select a stage</h1>
      {stages.map((stage) => (
        <div
          className={`p-4 border-2 rounded m-1 cursor-pointer w-[200px] h-[50px] flex items-center justify-center hover:bg-gray-400
                       ${pathname === stage.href && 'bg-accent rounded text-primary'}`}
          key={stage.name}
          onClick={() => handleClick(stage.href)}>
          <p>{stage.name}</p>
        </div>
      ))}
    </div>
  )
}

export default StageModal 
