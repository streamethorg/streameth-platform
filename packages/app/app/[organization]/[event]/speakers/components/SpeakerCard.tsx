import SpeakerModal from './SpeakerModal';
import SpeakerPhoto from './SpeakerPhoto';
import { ISessionModel } from 'streameth-new-server/src/interfaces/session.interface';
import { ISpeakerModel } from 'streameth-new-server/src/interfaces/speaker.interface';

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import { CredenzaTrigger, Credenza } from '@/components/ui/crezenda';
import { IExtendedEvent, IExtendedSession } from '@/lib/types';

const SpeakerCard = ({
  event,
  speaker,
  sessions,
}: {
  event: IExtendedEvent;
  speaker: ISpeakerModel;
  sessions: IExtendedSession[];
}) => {
  const speakerSessions = sessions?.filter((session) =>
    session.speakers
      ? session.speakers.some(
          (sessionSpeaker) => sessionSpeaker?._id === speaker?._id
        )
      : []
  );

  return (
    <Credenza>
      <CredenzaTrigger asChild>
        <Card className="border shadow-none">
          <CardHeader className="space-y-4 p-2 lg:p-2">
            <SpeakerPhoto speaker={speaker} size="lg" />
            <CardTitle className="mx-auto mr-auto text-lg">
              {speaker.name}
            </CardTitle>
          </CardHeader>
          <CardDescription className="overflow-clip">
            {speaker.company}
          </CardDescription>
        </Card>
      </CredenzaTrigger>
      <SpeakerModal speaker={speaker} sessions={speakerSessions} />
    </Credenza>
  );
};

export default SpeakerCard;
