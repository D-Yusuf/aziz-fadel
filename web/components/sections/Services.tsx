import React from 'react'
import { subscriptions } from '@/data'
import Image from 'next/image'
import { Subscription } from '@/data'
import { PiBowlFoodBold } from "react-icons/pi";
import { MdOutlinePermPhoneMsg } from "react-icons/md";
import { IoNewspaperOutline } from "react-icons/io5";
import { MdOutlineMarkChatRead } from "react-icons/md";
import Link from 'next/link'

export default function Services() {

  return (
    <div className='flex flex-col gap-10 items-center justify-center'>
        <div className='flex flex-col items-center justify-center gap-10'>
            <h1 className='text-4xl font-extrabold'>تتضمن الاشتراكات</h1>
            <ServiceCards />
        </div>
        <hr className='max-w-xl w-full  border-t border-gray-300' />
        <div id='subscribe' className='flex flex-col gap-5 items-center'>
            <h1 className='text-4xl font-extrabold mb-5'>الاشتراكات المتوفرة</h1>
            <div className='flex flex-wrap gap-4 items-center justify-between'>
                {subscriptions.map((subscription) => (
                    <SubscriptionCard key={subscription.name} subscription={subscription} />
                ))}
            </div>
        </div>

    </div>
  )
}

function SubscriptionCard({ subscription }: { subscription: Subscription }) {
    return (
        <div className='flex flex-col relative lg:w-[49%] w-full shadow-sm text-center rounded-md p-5 bg-secondary'>

                <Image  src={subscription.image} width={700} height={256} alt={subscription.name}  className=' mx-auto md:object-contain object-cover bg-accent/90 rounded-md' />
                
          
            <div className='flex flex-col gap-4 py-5 px-5'>
                <h2 className='text-2xl font-bold'>{subscription.name}</h2>
                <p className='text-xs text-gray-500'>{subscription.description}</p>
                <p className='z-10 text-sm absolute top-3 left-3 shadow-md font-extrabold p-1 px-4 rounded-md bg-accent text-white'>${subscription.price}</p>
                <Link href={`/packages/${subscription.id}`} className='text-xl bg-accent hover:bg-accent/80 text-white px-4 py-2 rounded-md'> اشترك الآن</Link>
            </div>
        </div>
    )
}

function ServiceCards() {
    return (
        <div className='flex flex-wrap gap-8 items-center justify-center w-full'>
            {/* box */}
            <div className='flex lg:w-[31%] h-[300px] text-center w-full flex-col gap-5 shadow-sm items-center bg-secondary px-8 py-8 rounded-md'>
                <MdOutlinePermPhoneMsg className='text-8xl text-accent' />
                <h2 className='text-2xl font-extrabold'>التواصل المستمر 
                </h2>
                <p className='text-base max-w-xl text-gray-500 overflow-y-auto max-h-[80px]'>تواصل مع المدرب بشكل مباشر طيلة فترة الاشتراك
                </p>
            </div>
            {/* box */}
            <div className='flex lg:w-[31%] h-[300px] text-center w-full flex-col gap-5 shadow-sm items-center bg-secondary px-8 py-8 rounded-md'>
                <IoNewspaperOutline className='text-8xl text-accent' />
                <h2 className='text-2xl font-extrabold'>خطة مخصصة لك
                </h2>
                <p className='text-base max-w-xl text-gray-500 overflow-y-auto max-h-[80px]'>نقوم ببناء خطة للتمرين والتغذية مصممة خصيصًا لتلبية احتياجاتك وأهدافك
                </p>
            </div>
            {/* box */}
            <div className='flex lg:w-[31%] h-[300px] text-center w-full flex-col gap-5 shadow-sm items-center bg-secondary px-8 py-8 rounded-md'>
                <MdOutlineMarkChatRead className='text-8xl text-accent' />
                <h2 className='text-2xl font-extrabold'>متابعة مستمرة 
                </h2>
                <p className='text-base max-w-xl text-gray-500 overflow-y-auto max-h-[80px]'>الفحص الدقيق ومتابعة تمارينك وتغذيتك حتى تتم بشكل صحيح دون أخطاء
                </p>
            </div>
        </div>
    )
}
