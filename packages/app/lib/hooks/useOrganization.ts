'use client';

import { useEffect, useState } from 'react';
import { fetchOrganization } from '@/lib/services/organizationService';

interface Organization {
  _id: string;
  name: string;
  slug: string;
  paymentStatus?: 'none' | 'pending' | 'processing' | 'active' | 'failed';
  streamingDays?: number;
  currentStages?: number;
  paidStages?: number;
  expirationDate?: Date;
}

export const useOrganization = (organizationId: string) => {
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const data = await fetchOrganization({ organizationId });
        setOrganization(data as Organization);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    }

    if (organizationId) {
      fetchData();
    }
  }, [organizationId]);

  return { organization, loading, error };
};
