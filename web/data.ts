// Base question interface
export interface BaseQuestion {
  id: number;
  question: string;
}

// Question with multiple choice options
export interface MultipleChoiceQuestion extends BaseQuestion {
  type: 'multiple-choice';
  options: string[];
  answer: string;
  followUp?: FollowUpQuestion;
}

// Question with text input
export interface TextInputQuestion extends BaseQuestion {
  type: 'text-input';
  answer: string;
  followUp?: FollowUpQuestion;
}

// Question with measurements (height & weight)
export interface MeasurementQuestion extends BaseQuestion {
  type: 'measurement';
  measurements: {
    height: string;
    weight: string;
  };
  followUp?: FollowUpQuestion;
}

// Question with image and multiple choice
export interface ImageChoiceQuestion extends BaseQuestion {
  type: 'image-choice';
  image: string;
  options: string[];
  answer: string;
  followUp?: FollowUpQuestion;
}

// Follow-up question can be any of the above types
export type FollowUpQuestion = 
  | MultipleChoiceQuestion 
  | TextInputQuestion 
  | MeasurementQuestion 
  | ImageChoiceQuestion;

// Union type for all question types
export type Question = 
  | MultipleChoiceQuestion 
  | TextInputQuestion 
  | MeasurementQuestion 
  | ImageChoiceQuestion;

export interface Subscription {
  id: number;
  name: string;
  description: string;
  price: number;
  type?: 'عادي' | 'طالب';
  image: string;
}

export const questions: { male: Question[], female: Question[] } = {
  male: [
    {
      id: 1,
      type: 'multiple-choice',
      question: "أين ستقوم بالتمارين؟",
      options: ["النادي", "المنزل"],
      answer: ""
    },
    {
      id: 2,
      type: 'multiple-choice',
      question: "ماهو شكل جسمك حاليا؟",
      options: ["سمنة", "سكيني فات", "نحافة", "جسم متناسق أريد تطويره أكثر"],
      answer: ""
    },
    {
      id: 3,
      type: 'multiple-choice',
      question: "ما عدد أيام التمرين التي ستلتزم بها خلال اشتراكك؟",
      options: ["٣ أيام", "٤ أيام", "٥ أيام"],
      answer: "",
      followUp: {
        id: 3.1,
        type: 'multiple-choice',
        question: "هل بإمكانك التمرين ليوم إضافي لتقسيم الجهد وحجم التمرين؟",
        options: ["نعم", "لا"],
        answer: ""
      }
    },
    {
      id: 4,
      type: 'multiple-choice',
      question: "هل تود استخدام الهرمونات؟",
      options: ["نعم", "لا"],
      answer: "",
      followUp: {
        id: 4.1,
        type: 'text-input',
        question: "اذكر كورساتك السابقة (إن وجدت)",
        answer: ""
      }
    },
    {
      id: 5,
      type: 'measurement',
      question: "القياسات",
      measurements: {
        height: "",
        weight: ""
      }
    },
    {
      id: 6,
      type: 'multiple-choice',
      question: "كم مرة في الأسبوع يجب ممارسة تمارين القوة؟",
      options: ["مرة واحدة", "مرتين", "3-4 مرات", "5-6 مرات"],
      answer: "3-4 مرات"
    },
    {
      id: 7,
      type: 'image-choice',
      question: "ما هو أفضل تمرين لحرق الدهون؟",
      image: "/exercises/cardio.jpg",
      options: ["تمرين الضغط", "تمرين القفز", "تمرين الجري", "تمرين اليوغا"],
      answer: "تمرين الجري"
    },
    {
      id: 8,
      type: 'multiple-choice',
      question: "كم ساعة يجب الانتظار بين التمارين؟",
      options: ["12 ساعة", "24 ساعة", "36 ساعة", "48 ساعة"],
      answer: "24 ساعة"
    },
    {
      id: 9,
      type: 'multiple-choice',
      question: "ما هو أفضل نوع من التمارين لتحسين المرونة؟",
      options: ["تمارين القوة", "تمارين التمدد", "تمارين القلب", "تمارين التوازن"],
      answer: "تمارين التمدد"
    },
    {
      id: 10,
      type: 'multiple-choice',
      question: "كم لتر من الماء يجب شربه أثناء التمرين؟",
      options: ["0.5 لتر", "1 لتر", "2 لتر", "3 لتر"],
      answer: "1 لتر"
    },
    {
      id: 11,
      type: 'text-input',
      question: "عدد التكرارات المثالي لتمرين الضغط للمبتدئين",
      answer: "10-15 تكرار"
    },
    {
      id: 12,
      type: 'text-input',
      question: "مدة تمرين البلانك المثالية",
      answer: "45-60 ثانية"
    },
    {
      id: 13,
      type: 'text-input',
      question: "معدل ضربات القلب المستهدف أثناء التمرين",
      answer: "60-80% من الحد الأقصى"
    },
    {
      id: 14,
      type: 'text-input',
      question: "مدة الراحة بين المجموعات",
      answer: "60-90 ثانية"
    },
    {
      id: 15,
      type: 'text-input',
      question: "عدد السعرات الحرارية المحروقة في ساعة من الجري",
      answer: "600-800 سعرة"
    }
  ],
  female: [
    // Similar structure for female questions...
  ]
};

export const subscriptions: Subscription[] = [
  {
    id: 1,
    name: "الاشتراك الذهبي",
    description: "اشتراك ٣ أشهر تغذية وتمرين",
    price: 399,
    image: "/placeholder.png",
    type: "عادي"
  },
  {
    id: 2,
    name: "اشتراك الطلاب",
    description: "اشتراك ٣ أشهر تغذية وتمرين",
    price: 249,
    image: "/placeholder.png",
    type: "طالب"
  },
];


