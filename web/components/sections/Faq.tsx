'use client'
import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { IoIosArrowDown } from 'react-icons/io'
import { faqData } from '@/data'
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
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
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
    <div className="lg:w-2/3 w-full mx-auto bg-white py-12 px-4">
      <h2 className="text-3xl font-bold text-center mb-8 text-gray-900">الأسئلة الشائعة</h2>
      <div className="space-y-4">
        {faqData.map((faq, index) => (
          <FaqItem key={index} question={faq.question} answer={faq.answer} />
        ))}
      </div>
    </div>
  )
}
