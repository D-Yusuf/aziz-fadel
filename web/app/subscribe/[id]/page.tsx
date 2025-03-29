'use client';

import { useState, useEffect, use } from 'react';
import { questions } from '@/data';
import { useSearchParams, useRouter } from 'next/navigation';
import Header from '@/components/questions/Header';

interface Answer {
  question: string;
  answer: string;
}

export default function QuestionsPage({params}:{params: Promise<{id: string}>}) {
  const resolvedParams = use(params);
  const id = resolvedParams.id;
  const [gender, setGender] = useState<'male' | 'female' | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [selectedGender, setSelectedGender] = useState<'male' | 'female' | null>(null);
  const searchParams = useSearchParams();
  const router = useRouter();
  const step = searchParams.get('step');
  
  const currentQuestions = gender ? questions[gender] : [];
  // Include gender selection in progress calculation
  const totalSteps = gender ? currentQuestions.length : 1; // 1 for gender selection when no gender selected
  const currentStep = gender ? currentQuestionIndex + 1 : 0;
  const progress = (currentStep / totalSteps) * 100;

  // Listen for URL step changes and update the current question index
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

  // Update URL with current question step while preserving other query parameters
  const updateUrlWithStep = (newStep: number) => {
    const newSearchParams = new URLSearchParams(searchParams.toString());
    newSearchParams.set('step', newStep.toString());
    router.push(`/subscribe/${id}?${newSearchParams.toString()}`);
  };

  const handleGenderSelect = (selectedGender: 'male' | 'female') => {
    setSelectedGender(selectedGender);
    // Add delay before moving to next question
    setTimeout(() => {
      setGender(selectedGender);
      setAnswers(prev => [...prev, { question: 'الجنس', answer: selectedGender }]);
      updateUrlWithStep(1); // Start with first question after gender selection
    }, 250);
  };

  const handleAnswer = (question: string, answer: string) => {
    setSelectedOption(answer);
    setAnswers(prev => {
      // Find if we already have an answer for this question
      const existingAnswerIndex = prev.findIndex(a => a.question === question);
      if (existingAnswerIndex >= 0) {
        // Update existing answer
        const newAnswers = [...prev];
        newAnswers[existingAnswerIndex] = { question, answer };
        return newAnswers;
      }
      // Add new answer
      return [...prev, { question, answer }];
    });

    // Only add delay for multiple choice questions
    if (currentQuestion.options) {
      setTimeout(() => {
        handleNext();
      }, 250);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      const prevStep = currentQuestionIndex;
      setCurrentQuestionIndex(prev => prev - 1);
      updateUrlWithStep(prevStep);
    } else if (gender) {
      // If we're at the first question, go back to gender selection
      setGender(null);
      updateUrlWithStep(0);
    } else {
      // If we're at gender selection, go back to packages
      router.push('/');
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < currentQuestions.length - 1) {
      const nextStep = currentQuestionIndex + 2; // +2 because step 0 is gender
      setCurrentQuestionIndex(curr => curr + 1);
      updateUrlWithStep(nextStep);
    } else {
      // Handle completion - you can navigate to a summary page or submit answers
      console.log('All questions answered:', answers);
      localStorage.setItem("package", JSON.stringify(answers))
      router.push(`/checkout`)

    }
  };

  if (!gender) {
    return (
      <div className="min-h-screen max-w-2xl mx-auto p-6">
        <Header onPrevious={() => {}} progress={progress} />

        <div className=" w-full">
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

  const currentQuestion = currentQuestions[currentQuestionIndex];
  const currentAnswer = answers.find(a => a.question === currentQuestion.question);

  return (
    <div className="min-h-screen max-w-2xl mx-auto  p-6">
      <Header onPrevious={handlePrevious} progress={progress} />

      {/* Question */}
      <div className="max-w-4xl mx-auto w-full">
        <h2 className="text-2xl font-bold text-right mb-8">
          {currentQuestion.question}
        </h2>

        {/* Options */}
        <div className="space-y-4 w-full">
          {currentQuestion.options ? (
            // Multiple choice question
            currentQuestion.options.map((option, index) => (
              <button
                key={index}
                onClick={() => {
                  handleAnswer(currentQuestion.question, option);
                }}
                className={`w-full p-4 text-right border-2 rounded-lg transition-colors duration-200 ${
                  selectedOption === option 
                    ? 'bg-accent text-white border-accent' 
                    : 'bg-white border-gray-200 hover:border-accent'
                }`}
              >
                {option}
              </button>
            ))
          ) : (
            // Text input question
            <div className="w-full">
              <input
                type="text"
                value={currentAnswer?.answer || ''}
                onChange={(e) => handleAnswer(currentQuestion.question, e.target.value)}
                placeholder="أدخل إجابتك هنا"
                className="w-full p-4 text-right border-2 border-gray-200 rounded-lg
                         focus:border-accent outline-none"
              />
            </div>
          )}
        </div>

        {/* Next button for text input questions */}
        {!currentQuestion.options && (
          <div className="flex justify-start mt-6">
            <button
              onClick={handleNext}
              disabled={!currentAnswer?.answer}
              className="bg-accent text-white px-8 py-3 rounded-lg hover:bg-accent/80 
                       disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              التالي
            </button>
          </div>
        )}
      </div>
    </div>
  );
} 