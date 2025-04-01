'use client';

import Link from 'next/link';
import { FaCheckCircle, FaHome } from 'react-icons/fa';

export default function SuccessPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="flex justify-center">
          <FaCheckCircle className="w-20 h-20 text-accent" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900">تم إرسال طلبك بنجاح!</h1>
        <p className="text-lg text-gray-600">
          شكراً لك. سنتواصل معك قريباً عبر البريد الإلكتروني أو الهاتف.
        </p>
        <Link 
          href="/"
          className="inline-flex items-center gap-2 bg-accent text-white px-6 py-3 rounded-lg hover:bg-accent/80 transition-colors"
        >
          <FaHome className="w-5 h-5" />
          العودة للرئيسية
        </Link>
      </div>
    </div>
  );
} 