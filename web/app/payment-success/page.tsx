'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function PaymentSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isVerifying, setIsVerifying] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        const paymentId = searchParams.get('paymentId');

        if (!paymentId) {
          throw new Error('Missing payment information');
        }

        const response = await fetch('/api/payment-status', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            paymentId,
          }),
        });

        const data = await response.json();

        if (data.success) {
          // Payment verified, send email
          const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
          const packageData = JSON.parse(localStorage.getItem('package') || '[]');

          await fetch('/api/send-email', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              ...userInfo,
              package: packageData,
            }),
          });

          // Clear local storage
          // localStorage.removeItem('package');
          // localStorage.removeItem('userInfo');

          // Redirect to success page
          router.push('/success');
        } else {
          setError(data.message || 'Payment verification failed');
        }
      } catch (error: any) {
        setError(error.message || 'An error occurred');
      } finally {
        setIsVerifying(false);
      }
    };

    verifyPayment();
  }, [router, searchParams]);

  if (isVerifying) {
    return (
      <div className="min-h-screen max-w-2xl mx-auto p-6">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold mb-4">جاري التحقق من الدفع...</h1>
          <p className="text-gray-600">يرجى الانتظار</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen max-w-2xl mx-auto p-6">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold mb-4 text-red-600">حدث خطأ</h1>
          <p className="text-gray-600 mb-8">{error}</p>
          <button
            onClick={() => router.push('/')}
            className="bg-accent text-white px-8 py-3 rounded-lg hover:bg-accent/80 transition-colors"
          >
            العودة للرئيسية
          </button>
        </div>
      </div>
    );
  }

  return null;
} 