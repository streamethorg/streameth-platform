import { Card, CardTitle, CardFooter } from '@/components/ui/card';
import { promises as fs } from 'fs';
import Image from 'next/image';
import Footer from '@/components/Layout/Footer';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const Terms = async () => {
  const year = new Date().getFullYear();
  const file = await fs.readFile(
    process.cwd() + '/public/legal/terms.md',
    'utf8'
  );

  return (
    <div>
      <div className="flex min-h-screen items-center justify-center">
        <Card className="my-5 flex w-full max-w-4xl flex-col justify-between bg-gray-100 p-5">
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
              className="prose prose-sm my-5 max-w-full p-4"
            >
              {file}
            </Markdown>
          </div>
          <CardFooter>© {year} StreamETH International B.V.</CardFooter>
        </Card>
      </div>
      <Footer active={'terms'} />
    </div>
  );
};

export default Terms;
