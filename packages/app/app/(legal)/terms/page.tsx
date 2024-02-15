import { Card, CardTitle, CardFooter } from '@/components/ui/card'
import { promises as fs } from 'fs'
import Image from 'next/image'
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

const Terms = async () => {
  const year = new Date().getFullYear()
  const file = await fs.readFile(
    process.cwd() + '/public/legal/terms.md',
    'utf8'
  )

  return (
    <div className="flex justify-center items-center min-h-screen">
      <Card className="flex flex-col justify-between p-5 my-5 mx-10 w-full max-w-4xl bg-gray-300">
        <div>
          <CardTitle>
            <Image
              src={'/logo.png'}
              alt={'StreamETH logo'}
              width={50}
              height={50}
            />
          </CardTitle>
          <Markdown
            remarkPlugins={[remarkGfm]}
            className="p-4 my-5 max-w-full prose">
            {file}
          </Markdown>
        </div>
        <CardFooter>
          © {year} StreamETH International B.V.
        </CardFooter>
      </Card>
    </div>
  )
}

export default Terms
