import Link from 'next/link'
import React from 'react'
import Image from 'next/image'
import logo from '@/public/logo.svg'
export default function Navbar() {
  return (
    <nav className='z-50 flex justify-between items-center w-full bg-background'>
        <Link href='/'>
            <Image src={logo} alt='logo' width={150} height={100} />
            
        </Link>
        <Link href='/subscribe'>
            <button className='font-bold px-4 py-2 rounded-md'>تسجيل الدخول</button>
        </Link>
    </nav>
  )
}
