import React from 'react'
import { subscriptions } from '@/data'
import Image from 'next/image'
import Link from 'next/link'
import { FaArrowRight } from "react-icons/fa";
export default function page({ params }: { params: { id: string } }) {
  const id = params.id
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
        <div className='space-y-2'>
          <h2 className='text-xl font-bold text-right'>الضمان</h2>
          <div className=' text-right bg-white rounded-xl p-6 border border-gray-200 shadow-md'>
            <p className='text-gray-700'>
              * ضمان نزول على الأقل 10 كيلوغرام في 90 يوماً للأوزان فوق ال 100 كيلوغرام (في حال الالتزام بالتعليمات الكاملة)
            </p>
            <p className='text-gray-700'>
              * إذا لم تحصل على تطور وتكن سعيداً بالاشتراك بعد 90 يوم، أنا لست سعيداً بإبقاء أموالك، فستسترد أموالك بالكامل (في حال الالتزام بالتعليمات الكاملة)
            </p>
            
            <div className='mt-6'>
              <p className='font-semibold mb-4'>الالتزام الكامل بالتعليمات حق أخذ الضمان وهذا يشمل:</p>
              <ul className='list-disc list-inside space-y-2 mr-4'>
                <li>الالتزام الكامل بجدول التغذية والتمرين</li>
                <li>الالتزام الكامل بالنشاط المطلوب (كارديو/خطوات)</li>
                <li>القيام بعمل تحاليل الدم</li>
                <li>تصوير التمارين للمدرب/ه المختصين</li>
                <li>تسجيل جميع البيانات وإرسال المتابعة للمدرب كل أسبوعين</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Customers Results */}
        <div className='flex flex-col gap-10'>
          <h2 className='text-xl font-bold text-right'>نتائج العملاء</h2>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            {/* {results.map((result) => (
              <div key={result.id} className='bg-white rounded-xl p-6 shadow-md'>
                <Image src={result.image} alt={result.name} width={100} height={100} />
              </div>
            ))} */}
          </div>
        </div>
        
        
        

        {/* Guarantee Section */}
        <div className='space-y-2'>
          <h2 className='text-xl font-bold text-right'>الضمان</h2>
          <div className=' text-right bg-white rounded-xl p-6 border border-gray-200 shadow-md'>
            <p className='text-gray-700'>
              * ضمان نزول على الأقل 10 كيلوغرام في 90 يوماً للأوزان فوق ال 100 كيلوغرام (في حال الالتزام بالتعليمات الكاملة)
            </p>
            <p className='text-gray-700'>
              * إذا لم تحصل على تطور وتكن سعيداً بالاشتراك بعد 90 يوم، أنا لست سعيداً بإبقاء أموالك، فستسترد أموالك بالكامل (في حال الالتزام بالتعليمات الكاملة)
            </p>
            
            <div className='mt-6'>
              <p className='font-semibold mb-4'>الالتزام الكامل بالتعليمات حق أخذ الضمان وهذا يشمل:</p>
              <ul className='list-disc list-inside space-y-2 mr-4'>
                <li>الالتزام الكامل بجدول التغذية والتمرين</li>
                <li>الالتزام الكامل بالنشاط المطلوب (كارديو/خطوات)</li>
                <li>القيام بعمل تحاليل الدم</li>
                <li>تصوير التمارين للمدرب/ه المختصين</li>
                <li>تسجيل جميع البيانات وإرسال المتابعة للمدرب كل أسبوعين</li>
              </ul>
            </div>
          </div>
        </div>
        



          <Link href={`/subscribe/${subscription?.id}`} className='bg-accent text-white px-8 py-3 rounded-lg w-full text-lg font-semibold shadow-lg hover:bg-accent/80 transition-colors'>
            اشترك الآن - {subscription?.price || 399}$
          </Link>
      </div>
    </div>
  )
}
