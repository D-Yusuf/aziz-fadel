import Link from 'next/link'
import React from 'react'
import Image from 'next/image'
import logo from '@/public/logo.svg'
export default function Navbar() {
  return (
    <nav className='z-50 flex justify-between items-center p-3 fixed top-0 left-0 right-0 bg-background shadow-sm'>
        <Link href='/'>
            <Image src={logo} alt='logo' width={150} height={100} />
        </Link>
        <Link href='/subscribe'>
            <button className='bg-green-500 text-white px-4 py-2 rounded-md'>اشتراك</button>
        </Link>
    </nav>
  )
}
