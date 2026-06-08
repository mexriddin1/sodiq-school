'use client';
import { useEffect } from 'react';
import { captureUtm } from '@/lib/utm';

// Mount once near the root. Captures first-touch UTM params from the URL into
// localStorage so subsequent form submissions can include them in the payload.
export function UtmCapture() {
  useEffect(() => {
    captureUtm();
  }, []);
  return null;
}
