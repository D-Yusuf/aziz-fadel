'use client';

import { useState, useEffect, use } from 'react';
import { questions } from '@/data';
import { useSearchParams, useRouter } from 'next/navigation';
import Header from '@/components/questions/Header';
import Questions from '@/components/questions/Questions';

interface Answer {
  question: string;
  answer: string;
}

export default function QuestionsPage({params}:{params: Promise<{id: string}>}) {
  const id = use(params).id;
  const [gender, setGender] = useState<'male' | 'female' | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [selectedGender, setSelectedGender] = useState<'male' | 'female' | null>(null);
  const searchParams = useSearchParams();
  const router = useRouter();
  const step = searchParams.get('step');
  
  const currentQuestions = gender ? questions[gender] : [];
  const totalSteps = gender ? currentQuestions.length : 1;
  const currentStep = gender ? currentQuestionIndex + 1 : 0;
  const progress = (currentStep / totalSteps) * 100;

  useEffect(() => {
    if (step) {
      const stepNum = parseInt(step);
      if (stepNum === 0) {
        setGender(null);
        setCurrentQuestionIndex(0);
      } else if (!isNaN(stepNum) && stepNum > 0 && gender && stepNum <= currentQuestions.length) {
        setCurrentQuestionIndex(stepNum - 1);
      }
    }
  }, [step, gender, currentQuestions.length]);

  const updateUrlWithStep = (newStep: number) => {
    const newSearchParams = new URLSearchParams(searchParams.toString());
    newSearchParams.set('step', newStep.toString());
    router.push(`/subscribe/${id}?${newSearchParams.toString()}`);
  };

  const handleGenderSelect = (selectedGender: 'male' | 'female') => {
    setSelectedGender(selectedGender);
    setTimeout(() => {
      setGender(selectedGender);
      setAnswers(prev => [...prev, { question: 'الجنس', answer: selectedGender }]);
      updateUrlWithStep(1);
    }, 250);
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      const prevStep = currentQuestionIndex;
      setCurrentQuestionIndex(prev => prev - 1);
      updateUrlWithStep(prevStep);
    } else if (gender) {
      setGender(null);
      updateUrlWithStep(0);
    } else {
      router.push('/');
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < currentQuestions.length - 1) {
      const nextStep = currentQuestionIndex + 2;
      setCurrentQuestionIndex(curr => curr + 1);
      updateUrlWithStep(nextStep);
    } else {
      console.log('All questions answered:', answers);
      localStorage.setItem("package", JSON.stringify(answers));
      router.push(`/checkout`);
    }
  };

  const handleAnswer = (newAnswers: Answer[]) => {
    setAnswers(newAnswers);
  };

  if (!gender) {
    return (
      <div className="min-h-screen max-w-2xl mx-auto p-6">
        <Header onPrevious={() => {}} progress={progress} />

        <div className="w-full">
          <h2 className="text-2xl font-bold text-right mb-8">
            ما هو جنسك؟
          </h2>

          <div className="space-y-4 w-full">
            <button
              onClick={() => handleGenderSelect('male')}
              className={`w-full p-4 text-right border-2 rounded-lg transition-colors duration-200 ${
                selectedGender === 'male'
                  ? 'bg-accent text-white border-accent'
                  : 'bg-white border-gray-200 hover:border-accent'
              }`}
            >
              ذكر
            </button>
            <button
              onClick={() => handleGenderSelect('female')}
              className={`w-full p-4 text-right border-2 rounded-lg transition-colors duration-200 ${
                selectedGender === 'female'
                  ? 'bg-accent text-white border-accent'
                  : 'bg-white border-gray-200 hover:border-accent'
              }`}
            >
              أنثى
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen max-w-2xl mx-auto p-6">
      <Header onPrevious={handlePrevious} progress={progress} />
      <Questions
        questions={currentQuestions}
        currentQuestionIndex={currentQuestionIndex}
        onAnswer={handleAnswer}
        onNext={handleNext}
        onPrevious={handlePrevious}
      />
    </div>
  );
} 