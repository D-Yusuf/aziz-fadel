import React from 'react'
import { subscriptions } from '@/data'
import Image from 'next/image'
import { Subscription } from '@/data'
import placeholder from '@/public/placeholder.png'
import { PiBowlFoodBold } from "react-icons/pi";
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

                <Image  src={placeholder} alt={subscription.name}  className=' lg:h-40 h-64 mx-auto object-cover  rounded-md' />
                
          
            <div className='flex flex-col gap-4 py-5 px-5'>
                <h2 className='text-2xl font-bold'>{subscription.name}</h2>
                <p className='text-xs text-gray-500'>{subscription.description}</p>
                <p className='z-10 text-sm absolute top-3 left-3 font-extrabold p-1 px-4 rounded-md bg-accent text-white'>${subscription.price}</p>
                <Link href={`/packages/${subscription.id}`} className='text-xl bg-accent hover:bg-accent/80 text-white px-4 py-2 rounded-md'> اشترك الآن</Link>
            </div>
        </div>
    )
}

function ServiceCards() {
    return (
        <div className='flex flex-wrap gap-8 items-center justify-center w-full'>
            {/* box */}
            <div className='flex flex-col gap-5 shadow-sm items-center  bg-[#ffffff] px-8 py-18 rounded-md'>
                <PiBowlFoodBold className='text-8xl text-accent' />
                <h2 className='text-2xl font-extrabold'>٣ أشهر من المتابعة
                </h2>
                <p className='text-xs text-gray-500'>حتى ترى نتائج أنت بحاجة إلى متابعة لمدة ٣ أشهر على الأقل
                </p>
            </div>
            {/* box */}
            <div className='flex flex-col gap-5 shadow-sm items-center  bg-[#ffffff] px-8 py-18 rounded-md'>
                <PiBowlFoodBold className='text-8xl text-accent' />
                <h2 className='text-2xl font-extrabold'>٣ أشهر من المتابعة
                </h2>
                <p className='text-xs text-gray-500'>حتى ترى نتائج أنت بحاجة إلى متابعة لمدة ٣ أشهر على الأقل
                </p>
            </div>
            {/* box */}
            <div className='flex flex-col gap-5 shadow-sm items-center  bg-[#ffffff] px-8 py-18 rounded-md'>
                <PiBowlFoodBold className='text-8xl text-accent' />
                <h2 className='text-2xl font-extrabold'>٣ أشهر من المتابعة
                </h2>
                <p className='text-xs text-gray-500'>حتى ترى نتائج أنت بحاجة إلى متابعة لمدة ٣ أشهر على الأقل
                </p>
            </div>
            
        </div>
    )
}
