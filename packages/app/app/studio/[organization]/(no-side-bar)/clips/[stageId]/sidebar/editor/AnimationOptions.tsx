import { IExtendedSession } from '@/lib/types';
import { useState } from 'react';
import { fetchAllSessions } from '@/lib/services/sessionService';
import { useEffect } from 'react';
import SelectAnimation from '../../topBar/SelectAnimation';
import { SessionType } from 'streameth-new-server/src/interfaces/session.interface';
import { useOrganizationContext } from '@/lib/context/OrganizationContext';

const AnimationOptions = () => {
  const [animations, setAnimations] = useState<IExtendedSession[]>([]);
  const [introAnimation, setIntroAnimation] = useState<string>('');
  const [outroAnimation, setOutroAnimation] = useState<string>('');
  const { organizationId } = useOrganizationContext();

  useEffect(() => {
    const fetchAnimations = async () => {
      const animations = await fetchAllSessions({
        type: SessionType.animation,
        organizationId: organizationId,
      });
      setAnimations(animations.sessions);
    };
    fetchAnimations();
  }, [organizationId]);

  return (
    <div className="grid grid-cols-2 gap-x-2">
      <SelectAnimation
        animations={animations}
        value={introAnimation}
        onChange={setIntroAnimation}
        name="introAnimation"
        label="Intro animation"
        organizationId={organizationId}
      />
      <SelectAnimation
        animations={animations}
        value={outroAnimation}
        onChange={setOutroAnimation}
        name="outroAnimation"
        label="Outro animation"
        organizationId={organizationId}
      />
    </div>
  );
};

export default AnimationOptions;
