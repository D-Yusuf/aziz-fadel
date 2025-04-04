'use client'

import React from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Pagination, Navigation } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/navigation'
import Image from 'next/image'

export default function Reviews() {
  const results = [
    {
      image: '/results/1.webp',
      text: 'العمر ١٧.. زيادة ١١ كيلو'
    },
    {
      image: '/results/2.webp',
      text: 'نتائج مذهلة بعد 6 أسابيع من البرنامج العلاجي'
    },
    {
      image: '/results/3.webp',
      text: 'تحسن كبير في مظهر البشرة بعد شهرين من العلاج'
    },
    {
      image: '/results/4.webp',
      text: 'نتائج إيجابية بعد 4 جلسات من العلاج المتخصص'
    },
    {
      image: '/results/5.webp',
      text: 'تحسن واضح في نسيج البشرة بعد 8 أسابيع'
    }
  ]

  return (
    <div id='reviews' className="w-full py-12 relative space-y-8">
      <div className='space-y-5 max-w-sm mx-auto'>

        <h1 className='text-center text-4xl font-extrabold '>آراء العملاء</h1>
        <p className='text-center  text-gray-500'>ولله الحمد، حققنا نتائج ممتازة وتحولات كبيرة للعديد من المشتركين حول العالم</p>
      </div>
      <div className="w-full px-4 relative">
        {/* Navigation arrows - visible only on md and larger screens */}
        <div className="swiper-button-prev !text-accent !-left-12 !w-10 !h-10 !hidden md:!block"></div>
        <div className="swiper-button-next !text-accent !-right-12 !w-10 !h-10 !hidden md:!block"></div>
        
        <Swiper
          slidesPerView={1}
          spaceBetween={30}
          loop={true}
          autoplay={{
            delay: 2500,
            disableOnInteraction: false,
          }}
          pagination={{
            clickable: true,
            el: '.swiper-pagination',
            bulletClass: 'swiper-pagination-bullet !bg-accent !w-3 !h-3 !mx-1',
            bulletActiveClass: 'swiper-pagination-bullet-active !bg-accent !w-4 !h-4',
            enabled: true, // Always enabled for small screens
          }}
          navigation={{
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
            enabled: true, // Always enabled for medium and larger screens
          }}
          modules={[Autoplay, Pagination, Navigation]}
          className="mySwiper"
          breakpoints={{
            640: {
              slidesPerView: 2,
              pagination: {
                enabled: false, // Disable pagination on medium screens
              },
              navigation: {
                enabled: true, // Enable navigation on medium screens
              },
            },
            1024: {
              slidesPerView: 3,
              pagination: {
                enabled: false, // Disable pagination on large screens
              },
              navigation: {
                enabled: true, // Enable navigation on large screens
              },
            },
          }}
        >
          {results.map((result, index) => (
            <SwiperSlide key={index}>
              <div className="flex flex-col gap-4 bg-white rounded-lg shadow-lg p-4">
                <div className="relative w-full aspect-[4/3] rounded-lg overflow-hidden">
                  <Image
                    src={result.image}
                    alt={`Result ${index + 1}`}
                    fill
                    className="object-contain"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                </div>
                <p className="text-center text-lg text-gray-700 font-medium">
                  {result.text}
                </p>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
        
        {/* Pagination dots - visible only on small screens */}
        <div className="swiper-pagination !relative !mt-6 !flex !justify-center !gap-2 md:!hidden"></div>
      </div>
    </div>
  )
}
