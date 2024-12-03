import {
  CredenzaContent,
  CredenzaDescription,
  CredenzaTitle,
  CredenzaHeader,
  CredenzaBody,
} from '@/components/ui/crezenda';

import Link from 'next/link';
import { IExtendedSpeaker, IExtendedSession } from '@/lib/types';

interface Params {
  speaker: IExtendedSpeaker;
  sessions?: IExtendedSession[];
}

const SpeakerModal = ({ speaker }: Params) => {
  return (
    <CredenzaContent>
      <CredenzaHeader>
        <CredenzaTitle>{speaker?.name}</CredenzaTitle>
        <CredenzaDescription>
          {speaker?.twitter && (
            <Link target="_blank" href={`https://x.com/${speaker?.twitter}`}>
              Follow on X
            </Link>
          )}
        </CredenzaDescription>
      </CredenzaHeader>
      <CredenzaBody className="p-4">{speaker?.bio}</CredenzaBody>
    </CredenzaContent>
  );
};

export default SpeakerModal;
