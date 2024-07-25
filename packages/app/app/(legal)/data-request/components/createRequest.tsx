'use client';
import { CardContent } from '@/components/ui/card';
import { useAccount } from 'wagmi';
import { Button } from '@/components/ui/button';
import { LuMail } from 'react-icons/lu';

const CreateRequest = () => {
  const { address } = useAccount();

  const handleEmailClick = () => {
    const subject = encodeURIComponent('Request for Personal Data');
    const body = encodeURIComponent(`Dear StreamETH Support,

I would like to request all my personal data saved by StreamETH.

My login address is: ${address || 'Unknown'}

Please provide me with the following information:

[Please specify what personal data you are requesting]

Thank you for your assistance.

Best regards,
[Your Name]`);

    window.location.href = `mailto:support@streameth.org?subject=${subject}&body=${body}`;
  };

  return (
    <CardContent className="space-y-4">
      <h2 className="text-2xl font-bold">Request Your Personal Data</h2>
      <p className="text-sm text-gray-600">
        Please click the button below to email support@streameth.org with your
        request:
      </p>
      <ul className="space-y-2 text-sm list-disc list-inside text-gray-600">
        <li>
          Your login address:{' '}
          <span className="font-mono">{address || 'Not connected'}</span>
        </li>
        <li>Specify what personal data you are requesting</li>
      </ul>
      <p className="text-sm text-gray-600">
        We will send an email confirmation that we received your request. We
        will then follow up with a zip file containing all your personal data
        saved on StreamETH.
      </p>

      <Button onClick={handleEmailClick} variant={'primary'} className="w-full">
        <LuMail size={20} className="mr-2" />
        Compose Email
      </Button>
    </CardContent>
  );
};

export default CreateRequest;
