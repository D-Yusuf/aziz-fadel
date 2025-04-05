'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export default function NotFound() {
  const router = useRouter();

  useEffect(() => {
    toast.error('الصفحة غير موجودة');
    router.push('/');
  }, [router]);

  return null;
} 