import React from 'react'
import { subscriptions } from '@/data'
import Image from 'next/image'
import { Subscription } from '@/data'
import placeholder from '@/public/placeholder.png'
export default function layout({ children }: { children: React.ReactNode }) {
  return (
    <div className='flex flex-col gap-10 items-center h-screen'>
        {children}
            

    </div>
  )
}

function SubscriptionCard({ subscription }: { subscription: Subscription }) {
    return (
        <div className='flex flex-col relative  shadow-sm text-center rounded-md hover:bg-white '>

                <Image  src={placeholder} alt={subscription.name}  className='w-96 h-40 object-cover rounded-t-md' />
                
          
            <div className='flex flex-col gap-4 py-5 px-5'>
                <h2 className='text-2xl font-bold'>{subscription.name}</h2>
                <p className='text-xs text-gray-500'>{subscription.description}</p>
                <p className='z-10 text-sm absolute top-3 left-3 font-extrabold p-1 px-4 rounded-md bg-green-500 text-white'>${subscription.price}</p>
                <button className='text-xl bg-accent hover:bg-accent/80 text-white px-4 py-2 rounded-md'> اشترك الآن</button>
            </div>
        </div>
    )
}
