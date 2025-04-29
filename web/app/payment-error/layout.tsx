import React, { Suspense } from 'react'

export default function layout({children}:{children: React.ReactNode}) {
  return (
    <Suspense fallback={
      <div className='container mx-auto px-4 py-8 max-w-3xl font-bold'>
        <div className='text-center py-12'>
          <p className='text-gray-600'>جاري التحميل...</p>
        </div>
      </div>
    }>
      {children}
    </Suspense>
  )
}
