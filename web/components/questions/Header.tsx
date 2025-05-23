import Image from 'next/image';
import { FaArrowRight } from "react-icons/fa";
import logo from '@/public/logo.svg'
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface HeaderProps {
  onPrevious: () => void;
  progress?: number;
}

export default function Header({ onPrevious, progress = 0 }: HeaderProps) {
  const router = useRouter();
  const handlePrevious = () => {
    if (onPrevious) {
      onPrevious();
    } else {
      router.push('/');
    }
  };

  return (
    <>
      {/* Logo and Back Arrow */}
      <div className="flex justify-center items-center relative mb-8 ">
        <button 
          onClick={handlePrevious}
          className="absolute right-0 top-1/2 -translate-y-1/2 p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <FaArrowRight className="w-6 h-6 text-gray-600" />
        </button>
        <Link href="/">
          <Image 
            src={logo}
            alt="Fadil Logo"
            width={150}
            height={50}
          />
        </Link>
      </div>

      {/* Progress bar */}
      {progress+1 && (
        <div className="w-full mx-auto bg-gray-200 rounded-full h-2.5 mb-8">
          <div 
            className="bg-accent h-2.5 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </>
  );
} 