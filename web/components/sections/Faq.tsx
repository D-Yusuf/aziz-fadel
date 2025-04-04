'use client'
import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { IoIosArrowDown } from 'react-icons/io'
import { faqData } from '@/data'
import Link from 'next/link'
interface FaqItemProps {
  question: string;
  answer: string;
}

const FaqItem = ({ question, answer }: FaqItemProps) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="mb-4">
      <button
        className={`w-full font-bold flex justify-between items-center p-4 bg-secondary rounded-lg   hover:bg-gray-50 ${isOpen ? 'rounded-b-none shadow-none' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="text-right text-gray-800">{question}</span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <IoIosArrowDown className="text-primary h-5 w-5" />
        </motion.div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ 
              type: "spring",
              stiffness: 800,
              damping: 20,
              mass: 0.6,
              duration: 0.1
            }}
            className="relative"
          >
            <div className="px-4 pb-2 bg-secondary rounded-b-lg space-y-2">
            <hr className='border-gray-200 px-10 h-1'/>
              <p className="font-semibold text-right">{answer}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function Faq() {
  

  return (
    <div className="w-full mx-auto bg-white py-12 px-4">
      <h2 className="text-3xl font-bold text-center mb-8 text-gray-900">الأسئلة الشائعة</h2>
      <div className="lg:w-2/3 w-full mx-auto">
        {faqData.map((faq, index) => (
          <FaqItem key={index} question={faq.question} answer={faq.answer} />
        ))}
      </div>
        <div className='w-full mt-20 gap-12 p-10 bg-secondary   rounded-xl  flex items-center justify-center flex-col'>
          <h1 className='max-w-4/5 text-center lg:text-6xl md:text-4xl text-3xl  font-superbold  leading-relaxed'>تحدى نفسك وابدأ رحلتك نحو جسم صحي ومثالي.</h1>
          <Link href='#subscribe' className='bg-accent font-extrabold md:text-xl text-base text-white px-8 py-2 rounded-md w-fit'>اشترك الآن</Link>
        </div>
    </div>
  )
}
