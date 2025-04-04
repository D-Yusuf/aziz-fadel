import { useState } from 'react';
import { Question, MultipleChoiceQuestion, TextInputQuestion, MeasurementQuestion, ImageChoiceQuestion, DateInputQuestion } from '@/data';
import Image from 'next/image';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import '@/styles/datepicker.css';

interface Answer {
  question: string;
  answer: string;
}

interface QuestionsProps {
  questions: Question[];
  currentQuestionIndex: number;
  onAnswer: (answers: Answer[]) => void;
  onNext: () => void;
  onPrevious: () => void;
}

export default function Questions({
  questions,
  currentQuestionIndex,
  onAnswer,
  onNext,
  onPrevious
}: QuestionsProps) {
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [measurements, setMeasurements] = useState<{ height: string; weight: string }>({ height: '', weight: '' });
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const currentQuestion = questions[currentQuestionIndex];
  const currentAnswer = answers.find(a => a.question === currentQuestion.question);
  const followUpQuestion = currentAnswer ? currentQuestion.followUp?.(currentAnswer.answer) : undefined;
  const followUpAnswer = followUpQuestion ? answers.find(a => a.question === followUpQuestion.question) : null;
  const shouldShowFollowUp = currentAnswer && followUpQuestion;

  const handleAnswer = (question: string, answer: string) => {
    setSelectedOption(answer);
    const newAnswers = [...answers];
    const existingAnswerIndex = newAnswers.findIndex(a => a.question === question);
    
    if (existingAnswerIndex >= 0) {
      newAnswers[existingAnswerIndex] = { question, answer };
    } else {
      newAnswers.push({ question, answer });
    }
    
    setAnswers(newAnswers);
    onAnswer(newAnswers);

    // Only proceed automatically for multiple choice questions without follow-up
    if (isMultipleChoiceQuestion(currentQuestion) && !currentQuestion.followUp) {
      setTimeout(() => {
        onNext();
      }, 250);
    }
  };

  const handleDateChange = (date: Date | null) => {
    if (date) {
      setSelectedDate(date);
      const formattedDate = date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
      });
      handleAnswer(currentQuestion.question, formattedDate);
    }
  };

  const handleFollowUpAnswer = (question: string, answer: string) => {
    setSelectedOption(answer);
    const newAnswers = [...answers];
    const existingAnswerIndex = newAnswers.findIndex(a => a.question === question);
    
    if (existingAnswerIndex >= 0) {
      newAnswers[existingAnswerIndex] = { question, answer };
    } else {
      newAnswers.push({ question, answer });
    }
    
    setAnswers(newAnswers);
    onAnswer(newAnswers);
  };

  const handleMeasurementChange = (field: 'height' | 'weight', value: string) => {
    const newMeasurements = { ...measurements, [field]: value };
    setMeasurements(newMeasurements);
    
    const answer = `${newMeasurements.height}cm / ${newMeasurements.weight}kg`;
    const newAnswers = [...answers];
    const existingAnswerIndex = newAnswers.findIndex(a => a.question === currentQuestion.question);
    
    if (existingAnswerIndex >= 0) {
      newAnswers[existingAnswerIndex] = { question: currentQuestion.question, answer };
    } else {
      newAnswers.push({ question: currentQuestion.question, answer });
    }
    
    setAnswers(newAnswers);
    onAnswer(newAnswers);
  };

  const canProceed = () => {
    if (!currentAnswer?.answer) return false;
    if (followUpQuestion && !followUpAnswer?.answer) return false;
    if (isMeasurementQuestion(currentQuestion) && (!measurements.height || !measurements.weight)) return false;
    return true;
  };

  // Type guards
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

  const isDateInputQuestion = (question: Question): question is DateInputQuestion => {
    return question.type === 'date-input';
  };

  return (
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

          {isDateInputQuestion(currentQuestion) && (
            <div className="w-full">
              <DatePicker
                selected={selectedDate}
                onChange={handleDateChange}
                dateFormat="dd/MM/yyyy"
                showYearDropdown
                scrollableYearDropdown
                yearDropdownItemNumber={100}
                placeholderText="اختر تاريخ الميلاد"
                className="w-full p-3 text-right border-2 border-gray-200 rounded-xl focus:border-accent outline-none"
                calendarClassName="text-right"
                maxDate={new Date()}
                minDate={new Date('1940-01-01')}
              />
            </div>
          )}

          {isImageChoiceQuestion(currentQuestion) && (
            <div className="space-y-6">
              {currentQuestion.image && (
                <div className="relative w-full">
                  <Image 
                    src={currentQuestion.image} 
                    alt={currentQuestion.question}
                    width={800}
                    height={800}
                    className="w-full rounded-lg"
                    priority
                    quality={100}
                  />
                </div>
              )}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {currentQuestion.options.map((option: { image: string, value: string }, index: number) => (
                  <button
                    key={index}
                    onClick={() => handleAnswer(currentQuestion.question, option.value)}
                    className={`relative overflow-hidden rounded-lg border-2 transition-all duration-200 ${
                      currentAnswer?.answer === option.value 
                        ? 'border-accent ring-2 ring-accent ring-offset-2' 
                        : 'border-gray-200 hover:border-accent'
                    }`}
                  >
                    <Image
                      src={`${currentQuestion.imageFolder}/${option.image}`}
                      alt={`Option ${option.value}`}
                      width={800}
                      height={800}
                    />
                    <div className={`absolute inset-0 flex items-center justify-center text-white text-2xl font-bold
                      ${currentAnswer?.answer === option.value ? 'bg-accent/60' : 'hover:bg-accent/40'}`}>
                    </div>
                  </button>
                ))}
              </div>
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
          onClick={onNext}
          disabled={!canProceed()}
          className="bg-accent text-white px-8 py-3 rounded-lg hover:bg-accent/80 
                   disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          التالي
        </button>
      </div>
    </div>
  );
} 