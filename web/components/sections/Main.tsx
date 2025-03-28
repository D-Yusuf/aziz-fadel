import React from 'react'
import Image from 'next/image'
import pose from '@/public/pose.jpg'
import Link from 'next/link'

export default function Main() {
  return (
      <div id='main' className='flex justify-around  gap-4 font-extrabold  my-auto'>
        <div className='flex flex-col justify-between gap-10 max-w-3/5  h-full'>
          <h1 className='text-6xl font-superbold leading-loose'>تدريبات وخطط تغذية مبنية على حقائق علمية </h1>
          <div className='rounded-full overflow-hidden -space-y-32 max-h-20w-full max-w-xl'>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2000 320"><path fill="#0496FF" fill-opacity="0.60" d="M0,224L80,208C160,192,320,160,480,176C640,192,800,256,960,250.7C1120,245,1280,171,1360,133.3L2000,96L2000,0L1360,0C1280,0,1120,0,960,0C800,0,640,0,480,0C320,0,160,0,80,0L0,0Z"></path></svg>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2000 320"><path fill="#0496FF" fill-opacity="0.33" d="M0,224L80,208C160,192,320,160,480,176C640,192,800,256,960,250.7C1120,245,1280,171,1360,133.3L2000,96L2000,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z"></path></svg>
          </div>
          <div className='flex flex-col gap-10'>
            <h1 className='text-accent text-4xl'>وبنتائج مضمونة في حال الالتزام</h1>
            <Link href='#subscribe' className='bg-accent text-xl text-white px-8 py-2 rounded-md w-fit'>اشترك الآن</Link>
          </div>
        </div>
        <div className='relative '>
          <Image className='rounded-xl' src={pose} alt='pose' width={450} />
          <hr />
        </div>
      </div>
  )
}
