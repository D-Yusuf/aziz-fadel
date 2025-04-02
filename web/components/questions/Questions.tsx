import { useState } from 'react';
import { Question, MultipleChoiceQuestion, TextInputQuestion, MeasurementQuestion, ImageChoiceQuestion, DateInputQuestion } from '@/data';
import Image from 'next/image';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

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
  const followUpQuestion = currentQuestion.followUp;
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
              <style jsx global>{`
                .react-datepicker-wrapper {
                  width: 100%;
                }
                .react-datepicker {
                  font-family: inherit;
                  border: 2px solid #e5e7eb;
                  border-radius: 0.75rem;
                  direction: rtl;
                  padding: 0.75rem;
                  background: white;
                  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
                  width: 280px;
                  font-size: 0.875rem;
                }
                .react-datepicker__header {
                  background-color: white;
                  border-bottom: none;
                  padding-top: 0.25rem;
                }
                .react-datepicker__current-month {
                  color: #111827;
                  font-weight: 600;
                  font-size: 0.95rem;
                  margin-bottom: 0.25rem;
                }
                .react-datepicker__day-names {
                  margin-top: 0.25rem;
                }
                .react-datepicker__day-name {
                  color: #6b7280;
                  font-weight: 500;
                  width: 2rem;
                  line-height: 2rem;
                  margin: 0.1rem;
                }
                .react-datepicker__day {
                  color: #374151;
                  border-radius: 0.375rem;
                  margin: 0.1rem;
                  width: 2rem;
                  line-height: 2rem;
                  font-size: 0.875rem;
                }
                .react-datepicker__day--selected {
                  background-color: var(--accent-color);
                  color: white;
                  font-weight: 600;
                }
                .react-datepicker__day--selected:hover {
                  background-color: var(--accent-color);
                }
                .react-datepicker__day:hover {
                  background-color: var(--accent-color);
                  color: white;
                  border-radius: 0.375rem;
                }
                .react-datepicker__day--keyboard-selected {
                  background-color: var(--accent-color);
                  color: white;
                }
                .react-datepicker__day--outside-month {
                  color: #9ca3af;
                }
                .react-datepicker__input-container input {
                  width: 100%;
                  padding: 0.75rem;
                  text-align: right;
                  border: 2px solid #e5e7eb;
                  border-radius: 0.75rem;
                  outline: none;
                  transition: all 0.2s;
                  font-size: 0.875rem;
                  color: #111827;
                  background-color: white;
                }
                .react-datepicker__input-container input:focus {
                  border-color: var(--accent-color);
                  box-shadow: 0 0 0 3px rgba(var(--accent-rgb), 0.1);
                }
                .react-datepicker__input-container input::placeholder {
                  color: #9ca3af;
                }
                .react-datepicker-popper {
                  z-index: 10;
                }
                .react-datepicker__year-dropdown {
                  background-color: white;
                  border: 2px solid #e5e7eb;
                  border-radius: 0.75rem;
                  padding: 0.5rem;
                  width: 50%;
                  right: 25%;
                  font-size: 0.875rem;
                }
                .react-datepicker__year-dropdown-container {
                  text-align: center;
                }
                .react-datepicker__year-option {
                  padding: 0.375rem;
                  color: #374151;
                  cursor: pointer;
                  transition: all 0.2s;
                }
                .react-datepicker__year-option:hover {
                  background-color: var(--accent-color);
                  color: white;
                  border-radius: 0.375rem;
                }
                .react-datepicker__navigation {
                  top: 0.75rem;
                }
                .react-datepicker__navigation--previous {
                  left: auto;
                  right: 0.75rem;
                  transform: rotate(180deg);
                }
                .react-datepicker__navigation--next {
                  right: auto;
                  left: 0.75rem;
                  transform: rotate(180deg);
                }
                .react-datepicker__navigation-icon::before {
                  border-width: 2px 2px 0 0;
                  height: 8px;
                  width: 8px;
                }
              `}</style>
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