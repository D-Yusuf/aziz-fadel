import Image from 'next/image';
import { FaArrowRight } from "react-icons/fa";
import logo from '@/public/logo.svg'
interface HeaderProps {
  onPrevious: () => void;
  progress: number;
}

export default function Header({ onPrevious, progress }: HeaderProps) {
  return (
    <>
      {/* Logo and Back Arrow */}
      <div className="flex justify-center items-center relative mb-8">
        <button 
          onClick={onPrevious}
          className="absolute right-0 top-1/2 -translate-y-1/2 p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <FaArrowRight className="w-6 h-6 text-gray-600" />
        </button>
        <Image 
          src={logo}
          alt="Fadil Logo"
          width={150}
          height={50}
        />
      </div>

      {/* Progress bar */}
      <div className="w-full mx-auto bg-gray-200 rounded-full h-2.5 mb-8">
        <div 
          className="bg-accent h-2.5 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
    </>
  );
} 