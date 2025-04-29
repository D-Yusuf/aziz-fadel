'use client';

import Link from 'next/link';
import { FaCheckCircle, FaHome, FaWhatsapp } from 'react-icons/fa';

export default function SuccessPage() {
  return (
    <div className="min-h-screen w-fit  mx-auto  flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="flex justify-center">
          <FaCheckCircle className="w-20 h-20 text-accent" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900">تم الاشتراك بنجاح!</h1>
        <p className='text-gray-500'>سيتم التواصل معكم قريبا</p>
       <div className='flex flex-wrap justify-center gap-4'>
        <Link 
          href="https://api.whatsapp.com/send?phone=96567056297"
          className=" text-lg flex w-fit text-center items-center gap-2 bg-accent text-white p-3 rounded-lg hover:bg-accent/80 transition-colors"
        >
          <p>التواصل مع المدرب</p>
          <FaWhatsapp className="size-10" />
        </Link>
        <Link 
          href="/"
          className=" text-lg flex w-fit text-center items-center gap-2 bg-accent text-white p-3 rounded-lg hover:bg-accent/80 transition-colors"
        >
   
   <p>الرجوع إلى الرئيسية</p>     
          <FaHome className="size-10" />
   </Link>
        </div>
      </div>
    </div>
  );
} 