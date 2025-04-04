'use client'
import React, { use } from 'react'
import { subscriptions } from '@/data'
import Image from 'next/image'
import Link from 'next/link'
import { FaArrowRight } from "react-icons/fa";
import ReviewSwiper from '@/components/common/swipers/ReviewSwiper';
import { results } from '@/data';
export default function page({params}:{params: Promise<{id: string}>}) {
  const id = use(params).id
  const subscription = subscriptions.find((subscription) => subscription.id === parseInt(id))
  
  return (
    <div className='container mx-auto px-4 py-8 max-w-3xl font-bold'>
      

      {/* Main Content */}
      <div className='flex flex-col gap-10'>
        {/* Header */}
        <div className='flex justify-center items-center relative'>
          <h1 className='text-4xl font-bold'>تفاصيل البرنامج</h1>
          <Link href="/" className='text-gray-500 text-center'>
            <FaArrowRight className='size-8 absolute right-0 top-1/2 -translate-y-1/2' />
          </Link>
        </div>

        {/* Hero Image */}
        <div className='w-full h-[300px] bg-red-500 rounded-2xl overflow-hidden relative'>
          <Image 
            src={subscription?.image || '/placeholder.png'} 
            alt={subscription?.name || 'subscription image'} 
            fill
            className='object-cover'
          />
        </div>

        {/* Subscription Details */}
        <div className='bg-white rounded-xl p-6 shadow-sm'>
          <h2 className='text-xl font-bold text-center mb-4'>
            {subscription?.name + " - " + subscription?.description}
          </h2>
        </div>

        {/* Guarantee Section */}
        <div className='space-y-2 font-semibold'>
          <h2 className='text-xl font-bold text-right'>الضمان</h2>
          <div className=' text-right bg-white rounded-xl p-6 border border-gray-200 shadow-md'>
            <p className='text-gray-700'>
              النتائج مضمونة، وفي حال عدم حصولك على نتيجة مع التزام كامل من قبلك لمدة ٣ أشهر، يمكنك استرجاع مبلغ الاشتراك
            </p>
           
            
            <div className='mt-6'>
              <p className='font-bold mb-4'>لكي تحصل على الضمان يجب عليك الالتزام بالتالي:</p>
              <ul className='list-disc list-inside space-y-2 mr-4'>
                <li>الالتزام الكامل بجدول التغذية والتمرين</li>
                <li>الالتزام الكامل بالنشاط المطلوب (كارديو/خطوات)</li>
                <li>تصوير التمارين للمدرب</li>
                <li>تسجيل جميع البيانات وإرسال المتابعة للمدرب كل أسبوع</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Customers Results */}
        <div className='flex flex-col gap-10'>
          <h2 className='text-xl font-bold text-right'>نتائج العملاء</h2>
           <ReviewSwiper results={results} />
        </div>
        
        
          <Link href={`/subscribe/${subscription?.id}`} className='bg-accent text-white text-center px-8 py-3 rounded-lg w-full text-xl font-extrabold shadow-lg hover:bg-accent/80 transition-colors'>
            اشترك الآن - {subscription?.price || 399}$
          </Link>
      </div>
    </div>
  )
}
