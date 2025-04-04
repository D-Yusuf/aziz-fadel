'use client'

import React from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Pagination, Navigation } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/navigation'
import Image from 'next/image'
import { results } from '@/data'
import ReviewSwiper from '../common/ReviewSwiper'

export default function Reviews() {
  

  return (
    <div id='reviews' className="w-full py-12 relative space-y-8 h-screen">
      <div className='space-y-5 max-w-sm mx-auto'>

        <h1 className='text-center text-4xl font-extrabold '>آراء العملاء</h1>
        <p className='text-center  text-gray-500'>ولله الحمد، حققنا نتائج ممتازة وتحولات كبيرة للعديد من المشتركين حول العالم</p>
      </div>
      <div className="w-full px-4 relative">
        
        <ReviewSwiper results={results} />
  
        
        
     
      </div>
    </div>
  )
}
