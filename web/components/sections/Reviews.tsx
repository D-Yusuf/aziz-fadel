'use client'

import React from 'react'
import { results } from '@/data'
import ReviewSwiper from '../common/swipers/ReviewSwiper'
import VoiceMessageSwiper from '../common/swipers/VoiceMessageSwiper'

export default function Reviews() {
  const voiceMessages = [
    '/voices/1.mp3',
    '/voices/2.mp3',

  ];

  return (
    <div id='reviews' className="w-full py-12 relative space-y-12">
      <div className='space-y-5 max-w-sm mx-auto'>
        <h1 className='text-center text-4xl font-extrabold'>آراء العملاء</h1>
        <p className='text-center text-gray-500'>ولله الحمد، حققنا نتائج ممتازة وتحولات كبيرة للعديد من المشتركين حول العالم</p>
      </div>

      {/* Image Reviews */}
      <div className="w-full px-4 relative">
        <ReviewSwiper results={results} />
      </div>
      
      {/* Voice Messages */}
      {/* <div className="w-full px-4 space-y-6">
        <div className='space-y-5'>
          <h1 className='text-center text-4xl font-extrabold'>قالوا عن عبدالعزيز</h1>
          <p className='text-center text-gray-500'>بعض من شهادات المشتركين لآرائهم الشخصية عن البرامج المقدمة</p>
        </div>
        <VoiceMessageSwiper voiceMessages={voiceMessages} />
      </div> */}
    </div>
  )
}
