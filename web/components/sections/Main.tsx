import React from 'react'
import Image from 'next/image'
import placeholder from '@/public/placeholder.png'
export default function Main() {
  return (
      <div className='flex justify-between items-end  gap-4 font-extrabold  my-auto'>
        <div className='flex flex-col gap-10 max-w-1/2'>
          <h1 className='text-5xl leading-loose'>تدريبات وخطط تغذية مبنية على حقائق علمية </h1>
          <h1 className='text-green-500  text-xl'>وبنتائج مضمونة في حال الالتزام</h1>
          <button className='bg-green-500 text-white px-8 py-2 rounded-md w-fit'>اشترك الان</button>
        </div>
        <Image src={placeholder} alt='placeholder' width={450} height={450} />
      </div>
  )
}
