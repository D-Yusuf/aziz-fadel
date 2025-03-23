import React from 'react'

export default function Footer() {
    const year = new Date().getFullYear()
  return (
    <div className='flex flex-col items-center justify-center bg-[#001f3f] text-white p-8 mt-auto'>
        <p className='text-sm '>جميع الحقوق محفوظة {year}©</p>
    </div>
  )
}
