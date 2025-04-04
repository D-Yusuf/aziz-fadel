import React from 'react'
import Image from 'next/image'
import pose from '@/public/pose.jpg'
import Link from 'next/link'

export default function Main() {
  return (
      <div dir='ltr' id='main' className='flex md:flex-row flex-col md:justify-around justify-center items-center  gap-4 font-extrabold  my-auto'>
        <div className='relative '>
          <div className='relative md:w-full w-4/5 mx-auto'>

          <Image className='rounded-xl rounded-b-none  ' src={pose} alt='pose' width={450} />

          <hr className='w-full  border-t-2 '/>
          </div>
        </div>
        <div dir='rtl' className='flex flex-col justify-between md:gap-10 gap-3 md:max-w-3/5 md:text-start text-center h-full'>
          <h1 className='lg:text-6xl md:text-4xl text-3xl  font-superbold md:leading-loose leading-relaxed'>تدريبات وخطط تغذية مبنية على حقائق علمية </h1>
          <div className='rounded-full overflow-hidden md:block hidden -space-y-32 max-h-20w-full max-w-xl'>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2000 320"><path fill="#0496FF" fillOpacity="0.60" d="M0,224L80,208C160,192,320,160,480,176C640,192,800,256,960,250.7C1120,245,1280,171,1360,133.3L2000,96L2000,0L1360,0C1280,0,1120,0,960,0C800,0,640,0,480,0C320,0,160,0,80,0L0,0Z"></path></svg>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2000 320"><path fill="#0496FF" fillOpacity="0.33" d="M0,224L80,208C160,192,320,160,480,176C640,192,800,256,960,250.7C1120,245,1280,171,1360,133.3L2000,96L2000,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z"></path></svg>
          </div>
          <div className='flex flex-col md:items-start items-center md:gap-10 gap-5'>
            <h1 className='lg:text-4xl md:text-2xl sm:text-xl text-lg text-accent'>وبنتائج مضمونة في حال الالتزام</h1>
            <Link href='#subscribe' className='bg-accent md:text-xl text-base text-white px-8 py-2 rounded-md w-fit'>اشترك الآن</Link>
          </div>
        </div>
      </div>
  )
}
