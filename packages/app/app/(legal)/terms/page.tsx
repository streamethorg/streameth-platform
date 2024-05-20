import { Card, CardTitle, CardFooter } from '@/components/ui/card'
import { promises as fs } from 'fs'
import Image from 'next/image'
import Footer from '@/components/Layout/Footer'
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

const Terms = async () => {
  const year = new Date().getFullYear()
  const file = await fs.readFile(
    process.cwd() + '/public/legal/terms.md',
    'utf8'
  )

  return (
    <div>
      <div className="flex justify-center items-center min-h-screen">
        <Card className="flex flex-col justify-between p-5 my-5 w-full max-w-4xl bg-gray-100">
          <div>
            <CardTitle className="ml-4">
              <Image
                src={'/logo.png'}
                alt={'StreamETH logo'}
                width={50}
                height={50}
              />
            </CardTitle>
            <Markdown
              remarkPlugins={[remarkGfm]}
              className="p-4 my-5 max-w-full prose prose-sm">
              {file}
            </Markdown>
          </div>
          <CardFooter>
            © {year} StreamETH International B.V.
          </CardFooter>
        </Card>
      </div>
      <Footer active={'terms'} />
    </div>
  )
}

export default Terms
