'use server';

import { Card, CardTitle, CardFooter } from '@/components/ui/card';
import Image from 'next/image';
import Footer from '@/components/Layout/Footer';
import CreateRequest from './components/createRequest';

const DataRequest = async () => {

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex flex-grow justify-center items-center">
        <Card className="flex flex-col justify-between p-5 my-5 w-full max-w-4xl bg-gray-100">
          <CardTitle className="mb-6 ml-4">
            <Image
              src={'/logo.png'}
              alt={'StreamETH logo'}
              width={50}
              height={50}
            />
          </CardTitle>
          <CreateRequest />
        </Card>
      </div>
      <Footer active={'data_request'} />
    </div>
  );
};

export default DataRequest;
