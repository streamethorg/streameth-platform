import { Card, CardContent } from '@/components/ui/card';
import CreateOrganizationForm from '../components/CreateOrganizationForm';
import Image from 'next/image';

const CreateOrganization = () => {
  return (
    <div className="mx-auto mt-12 flex w-full max-w-4xl flex-row">
      <div className="w-1/3 space-y-4 rounded-l-xl bg-neutrals-100 p-6">
        <Image src="/logo.png" alt="streameth logo" height={50} width={50} />
        <h1 className="text-2xl font-medium">Create an organization</h1>
        <p className="text-sm text-muted-foreground">
          Organizations are used to manage events and videos. You can create
          multiple organizations to manage different types of events.
        </p>
      </div>
      <Card className="m-auto w-2/3 rounded-r-xl border-none bg-white shadow-none">
        <CardContent>
          <CreateOrganizationForm />
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateOrganization;
