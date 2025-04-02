'use client';

import { useState, useEffect, use } from 'react';
import { questions, Question, MultipleChoiceQuestion, TextInputQuestion, MeasurementQuestion, ImageChoiceQuestion } from '@/data';
import { useSearchParams, useRouter } from 'next/navigation';
import Header from '@/components/questions/Header';

interface Answer {
  question: string;
  answer: string;
}

export default function QuestionsPage({params}:{params: Promise<{id: string}>}) {
  const id = use(params).id;
  const [gender, setGender] = useState<'male' | 'female' | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [selectedGender, setSelectedGender] = useState<'male' | 'female' | null>(null);
  const [measurements, setMeasurements] = useState<{ height: string; weight: string }>({ height: '', weight: '' });
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

  const handleAnswer = (question: string, answer: string) => {
    setSelectedOption(answer);
    setAnswers(prev => {
      const existingAnswerIndex = prev.findIndex(a => a.question === question);
      if (existingAnswerIndex >= 0) {
        const newAnswers = [...prev];
        newAnswers[existingAnswerIndex] = { question, answer };
        return newAnswers;
      }
      return [...prev, { question, answer }];
    });

    // Only proceed automatically for multiple choice questions without follow-up
    if (isMultipleChoiceQuestion(currentQuestion) && !currentQuestion.followUp) {
      setTimeout(() => {
        handleNext();
      }, 250);
    }
  };

  const handleFollowUpAnswer = (question: string, answer: string) => {
    setSelectedOption(answer);
    setAnswers(prev => {
      const existingAnswerIndex = prev.findIndex(a => a.question === question);
      if (existingAnswerIndex >= 0) {
        const newAnswers = [...prev];
        newAnswers[existingAnswerIndex] = { question, answer };
        return newAnswers;
      }
      return [...prev, { question, answer }];
    });
  };

  const handleMeasurementChange = (field: 'height' | 'weight', value: string) => {
    setMeasurements(prev => ({ ...prev, [field]: value }));
    setAnswers(prev => {
      const existingAnswerIndex = prev.findIndex(a => a.question === currentQuestion.question);
      if (existingAnswerIndex >= 0) {
        const newAnswers = [...prev];
        newAnswers[existingAnswerIndex] = { 
          question: currentQuestion.question, 
          answer: `${measurements.height}cm / ${measurements.weight}kg` 
        };
        return newAnswers;
      }
      return [...prev, { 
        question: currentQuestion.question, 
        answer: `${measurements.height}cm / ${measurements.weight}kg` 
      }];
    });
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

  // Type guards for question types
  const isMultipleChoiceQuestion = (question: Question): question is MultipleChoiceQuestion => {
    return question.type === 'multiple-choice';
  };

  const isTextInputQuestion = (question: Question): question is TextInputQuestion => {
    return question.type === 'text-input';
  };

  const isMeasurementQuestion = (question: Question): question is MeasurementQuestion => {
    return question.type === 'measurement';
  };

  const isImageChoiceQuestion = (question: Question): question is ImageChoiceQuestion => {
    return question.type === 'image-choice';
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

  const currentQuestion = currentQuestions[currentQuestionIndex];
  const currentAnswer = answers.find(a => a.question === currentQuestion.question);
  const followUpQuestion = currentQuestion.followUp;
  const followUpAnswer = followUpQuestion ? answers.find(a => a.question === followUpQuestion.question) : null;
  const shouldShowFollowUp = currentAnswer && followUpQuestion;

  const canProceed = () => {
    if (!currentAnswer?.answer) return false;
    if (followUpQuestion && !followUpAnswer?.answer) return false;
    if (isMeasurementQuestion(currentQuestion) && (!measurements.height || !measurements.weight)) return false;
    return true;
  };

  return (
    <div className="min-h-screen max-w-2xl mx-auto p-6">
      <Header onPrevious={handlePrevious} progress={progress} />

      <div className="max-w-4xl mx-auto w-full">
        <h2 className="text-2xl font-bold text-right mb-8">
          {currentQuestion.question}
        </h2>

        <div className="space-y-6 w-full">
          {/* Main question */}
          <div className="space-y-4">
            {isMultipleChoiceQuestion(currentQuestion) && (
              currentQuestion.options.map((option: string, index: number) => (
                <button
                  key={index}
                  onClick={() => handleAnswer(currentQuestion.question, option)}
                  className={`w-full p-4 text-right border-2 rounded-lg transition-colors duration-200 ${
                    currentAnswer?.answer === option 
                      ? 'bg-accent text-white border-accent' 
                      : 'bg-white border-gray-200 hover:border-accent'
                  }`}
                >
                  {option}
                </button>
              ))
            )}

            {isTextInputQuestion(currentQuestion) && (
              <div className="w-full">
                <textarea
                  value={currentAnswer?.answer || ''}
                  onChange={(e) => handleAnswer(currentQuestion.question, e.target.value)}
                  placeholder="أدخل إجابتك هنا"
                  rows={4}
                  className="w-full p-4 text-right border-2 border-gray-200 rounded-lg
                           focus:border-accent outline-none resize-none"
                />
              </div>
            )}

            {isMeasurementQuestion(currentQuestion) && (
              <div className="space-y-4">
                <div className="w-full">
                  <input
                    type="text"
                    value={measurements.height}
                    onChange={(e) => handleMeasurementChange('height', e.target.value)}
                    placeholder="الطول (سم)"
                    className="w-full p-4 text-right border-2 border-gray-200 rounded-lg
                             focus:border-accent outline-none"
                  />
                </div>
                <div className="w-full">
                  <input
                    type="text"
                    value={measurements.weight}
                    onChange={(e) => handleMeasurementChange('weight', e.target.value)}
                    placeholder="الوزن (كجم)"
                    className="w-full p-4 text-right border-2 border-gray-200 rounded-lg
                             focus:border-accent outline-none"
                  />
                </div>
              </div>
            )}

            {isImageChoiceQuestion(currentQuestion) && (
              <div className="space-y-4">
                <img 
                  src={currentQuestion.image} 
                  alt={currentQuestion.question}
                  className="w-full h-48 object-cover rounded-lg"
                />
                {currentQuestion.options.map((option: string, index: number) => (
                  <button
                    key={index}
                    onClick={() => handleAnswer(currentQuestion.question, option)}
                    className={`w-full p-4 text-right border-2 rounded-lg transition-colors duration-200 ${
                      currentAnswer?.answer === option 
                        ? 'bg-accent text-white border-accent' 
                        : 'bg-white border-gray-200 hover:border-accent'
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Follow-up question */}
          {shouldShowFollowUp && (
            <div className="mt-8 space-y-4">
              <h3 className="text-xl font-bold text-right mb-4">
                {followUpQuestion.question}
              </h3>

              {isMultipleChoiceQuestion(followUpQuestion) && (
                followUpQuestion.options.map((option: string, index: number) => (
                  <button
                    key={index}
                    onClick={() => handleFollowUpAnswer(followUpQuestion.question, option)}
                    className={`w-full p-4 text-right border-2 rounded-lg transition-colors duration-200 ${
                      followUpAnswer?.answer === option 
                        ? 'bg-accent text-white border-accent' 
                        : 'bg-white border-gray-200 hover:border-accent'
                    }`}
                  >
                    {option}
                  </button>
                ))
              )}

              {isTextInputQuestion(followUpQuestion) && (
                <div className="w-full">
                  <textarea
                    value={followUpAnswer?.answer || ''}
                    onChange={(e) => handleFollowUpAnswer(followUpQuestion.question, e.target.value)}
                    placeholder="أدخل إجابتك هنا"
                    rows={4}
                    className="w-full p-4 text-right border-2 border-gray-200 rounded-lg
                             focus:border-accent outline-none resize-none"
                  />
                </div>
              )}
            </div>
          )}
        </div>

        {/* Next button */}
        <div className="flex justify-start mt-6">
          <button
            onClick={handleNext}
            disabled={!canProceed()}
            className="bg-accent text-white px-8 py-3 rounded-lg hover:bg-accent/80 
                     disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            التالي
          </button>
        </div>
      </div>
    </div>
  );
} 