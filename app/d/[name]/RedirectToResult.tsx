'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function RedirectToResult({ name }: { name: string | null }) {
  const router = useRouter();

  useEffect(() => {
    router.replace(name ? `/?dest=${encodeURIComponent(name)}` : '/');
  }, [name, router]);

  return null;
}
