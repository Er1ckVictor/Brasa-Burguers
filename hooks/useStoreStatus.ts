'use client';

import { useEffect, useState } from 'react';
import { getStatus, type StoreStatus } from '@/lib/hours';

/**
 * Current open/closed status, refreshed every minute.
 * Returns null until mounted so server and browser HTML match.
 */
export function useStoreStatus(): StoreStatus | null {
  const [status, setStatus] = useState<StoreStatus | null>(null);
  useEffect(() => {
    const update = () => setStatus(getStatus());
    update();
    const id = window.setInterval(update, 60_000);
    return () => window.clearInterval(id);
  }, []);
  return status;
}
