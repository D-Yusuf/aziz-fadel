'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { FaExclamationCircle } from 'react-icons/fa';

export default function page() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getPaymentStatus = async () => {
      try {
        const paymentId = searchParams.get('paymentId');
        if (!paymentId) {
          setErrorMessage('No payment ID found');
          setIsLoading(false);
          return;
        }

        const response = await fetch('/api/payment-status', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ paymentId }),
        });

        const data = await response.json();
        console.log('Payment Status:', data);

        if (data.success) {
          setErrorMessage(data.message || 'Payment failed');
        } else {
          setErrorMessage(data.message || 'Failed to get payment status');
        }
      } catch (error: any) {
        console.error('Error fetching payment status:', error);
        setErrorMessage(error.message || 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    getPaymentStatus();

    // Clear any stored payment data
    // localStorage.removeItem('package');
    // localStorage.removeItem('userInfo');
  }, [searchParams]);

  return (
    <div className="min-h-screen max-w-2xl mx-auto p-6">
      <div className="text-center py-12">
        <div className="flex justify-center mb-6">
          <FaExclamationCircle className="w-16 h-16 text-red-500" />
        </div>
        
        <h1 className="text-2xl font-bold mb-4 text-red-600">فشل في عملية الدفع</h1>
        
        {isLoading ? (
          <p className="text-gray-600 mb-8">جاري التحقق من حالة الدفع...</p>
        ) : errorMessage ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
            <p className="text-red-600 font-medium mb-2">رسالة الخطأ:</p>
            <p className="text-gray-700">{errorMessage}</p>
          </div>
        ) : (
          <p className="text-gray-600 mb-8">
            عذراً، حدث خطأ أثناء معالجة الدفع. يرجى المحاولة مرة أخرى.
          </p>
        )}

        <div className="space-y-4">
          <button
            onClick={() => router.push('/')}
            className="w-full bg-accent text-white px-8 py-3 rounded-lg hover:bg-accent/80 transition-colors"
          >
            العودة للرئيسية
          </button>
          
          <button
            onClick={() => router.back()}
            className="w-full bg-gray-100 text-gray-700 px-8 py-3 rounded-lg hover:bg-gray-200 transition-colors"
          >
            المحاولة مرة أخرى
          </button>
        </div>
      </div>
    </div>
  );
}
