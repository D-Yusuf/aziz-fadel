// Base question interface
export interface BaseQuestion {
  id: number;
  question: string;
  note: string;
}

// Question with date input
export interface DateInputQuestion extends BaseQuestion {
  type: 'date-input';
  answer: string;
  value: Date;
  minDate?: Date;
  maxDate?: Date;
  followUp?: (answer: string) => FollowUpQuestion | undefined;
}

// Question with multiple choice options
export interface MultipleChoiceQuestion extends BaseQuestion {
  type: 'multiple-choice';
  options: string[];
  answer: string;
  followUp?: (answer: string) => FollowUpQuestion | undefined;
}

// Question with text input
export interface TextInputQuestion extends BaseQuestion {
  type: 'text-input';
  answer: string;
  minLength?: number;
  maxLength?: number;
  followUp?: (answer: string) => FollowUpQuestion | undefined;
}

// Question with measurements (height & weight)
export interface MeasurementQuestion extends BaseQuestion {
  type: 'measurement';
  measurements: {
    height: string;
    weight: string;
  };
  followUp?: (answer: string) => FollowUpQuestion | undefined;
}

// Question with image and multiple 
export interface ImageChoiceQuestion extends BaseQuestion {
  type: 'image-choice';
  image?: string;
  options: { image: string, value: string }[];
  imageFolder: string;
  answer: string;
  followUp?: (answer: string) => FollowUpQuestion | undefined;
}

// Follow-up question can be any of the above types
export type FollowUpQuestion = 
  | MultipleChoiceQuestion 
  | TextInputQuestion 
  | MeasurementQuestion 
  | ImageChoiceQuestion
  | DateInputQuestion;

// Union type for all question types
export type Question = 
  | MultipleChoiceQuestion 
  | TextInputQuestion 
  | MeasurementQuestion 
  | ImageChoiceQuestion
  | DateInputQuestion;

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
      answer: "",
      note: ""
    },
    {
      id: 2,
      type: 'multiple-choice',
      question: "ماهو شكل جسمك حاليا؟",
      options: ["سمنة", "سكيني فات", "نحافة", "جسم متناسق أريد تطويره أكثر"],
      answer: "",
      note: ""
    },
    {
      id: 3,
      type: 'multiple-choice',
      question: "ما عدد أيام التمرين التي ستلتزم بها خلال اشتراكك؟",
      options: ["٣ أيام", "٤ أيام", "٥ أيام"],
      answer: "",
      note: "",
      followUp: (answer: string) => ({
        id: 3.1,
        type: 'multiple-choice',
        question: "هل بإمكانك التمرين ليوم إضافي لتقسيم الجهد وحجم التمرين؟",
        options: ["نعم", "لا"],
        answer: "",
        note: ""
      })
    },
    // {
    //   id: 4,
    //   type: 'multiple-choice',
    //   question: "هل تود استخدام الهرمونات؟",
    //   options: ["نعم", "لا"],
    //   answer: "",
    //   followUp: (answer: string) => answer === "نعم" ? {
    //     id: 4.1,
    //     type: 'text-input',
    //     question: "اذكر كورساتك السابقة (إن وجدت)",
    //     answer: ""
    //   } : undefined
    // },
    {
      id: 5,
      type: 'measurement',
      question: "القياسات",
      measurements: {
        height: "",
        weight: ""
      },
      note: ""
    },
    {
      id: 6,
      type: 'date-input',
      question: "تاريخ الميلاد",
      answer: "",
      value: new Date(2000, 0, 1), // 1/1/2000
      maxDate: new Date(new Date().setFullYear(new Date().getFullYear() - 16)),
      minDate: new Date(new Date().setFullYear(new Date().getFullYear() - 100)),
      note: "يجب أن يكون العمر ١٦ على الأقل"
    },
    {
      id: 7,
      type: 'multiple-choice',
      question: "هل لديك مشاكل صحية؟",
      options: ["نعم", "لا"],
      answer: "",
      note: "",
      followUp: (answer: string) => {
        if (answer === "نعم") {
          return {
            id: 7.1,
            type: 'text-input',
            question: "اذكرها",
            answer: "",
            note: ""
          };
        }
        return undefined;
      }
    },
    {
      id: 8,
      type: 'multiple-choice',
      question: "أين سمعت عنا؟" ,
      options: ["انستقرام","يوتيوب", "سناب جات", "تيكتوك", "أخرى"],
      answer: "",
      note: "",
      followUp: (answer: string) => answer === "أخرى" ? {
        id: 8.1,
        type: 'text-input',
        question: "من أين؟",
        answer: "",
        note: ""
      } : undefined
    },
    {
      id: 9,
      type: 'text-input',
      question: "ماهي اكثر المشاكل السابقة التي كانت تصعب عليك الوصول لهدفك؟",
      answer: "",
      maxLength: 500,
      note: ""
    },
    {
      id: 11,
      type: 'multiple-choice',
      question: "ما مدى معرفتك بتمارين المقاومة؟",
      options: ["مبتدئ", "متوسط", "متقدم"],
      answer: "",
      note: ""
    },

    {
      id: 13,
      type: 'date-input',
      question: "متى تستطيع البدء بالبرنامج التدريبي؟",
      answer: "",
      value: new Date(), // Today
      minDate: new Date(new Date().setDate(new Date().getDate() + 7)),
      maxDate: new Date(new Date().setMonth(new Date().getMonth() + 1)),
      note: ""
    },

  ],
  female: [
    // Similar structure for female questions...
    {
      id: 1,
      type: 'multiple-choice',
      question: "أين ستقومين بالتمارين؟",
      options: ["النادي", "المنزل"],
      answer: "",
      note: ""
    },
    {
      id: 2,
      type: 'multiple-choice',
      question: "ماهو شكل جسمك حاليا؟",
      options: ["سمنة", "سكيني فات", "نحافة", "جسم متناسق أريد تطويره أكثر"],
      answer: "",
      note: ""
    },
    {
      id: 3,
      type: 'multiple-choice',
      question: "ما عدد أيام التمرين التي ستلتزمين بها خلال اشتراكك؟",
      options: ["٣ أيام", "٤ أيام", "٥ أيام"],
      answer: "",
      note: "",
      followUp: (answer: string) => ({
        id: 3.1,
        type: 'multiple-choice',
        question: "هل بإمكانك التمرين ليوم إضافي لتقسيم الجهد وحجم التمرين؟",
        options: ["نعم", "لا"],
        answer: "",
        note: ""
      })
    },
    {
      id: 10,
      type: 'image-choice',
      question: "ما هو أقرب شكل لنسبة الدهون في الجسم لديك؟",
      options: [{ image: "1.png", value: "1" }, { image: "2.png", value: "2" }, { image: "3.png", value: "3" }, { image: "4.png", value: "4" }, { image: "5.png", value: "5" }, { image: "6.png", value: "6" }, { image: "7.png", value: "7" }, { image: "8.png", value: "8" }],
      imageFolder: "/female",
      answer: "1",
      note: ""
    },
    {
      id: 5,
      type: 'measurement',
      question: "القياسات",
      measurements: {
        height: "",
        weight: ""
      },
      note: ""
    },
    {
      id: 6,
      type: 'date-input',
      question: "تاريخ الميلاد",
      answer: "",
      value: new Date(2000, 0, 1), // 1/1/2000
      maxDate: new Date(new Date().setFullYear(new Date().getFullYear() - 16)),
      minDate: new Date(new Date().setFullYear(new Date().getFullYear() - 100)),
      note: "يجب أن يكون العمر ١٦ على الأقل"
    },
    {
      id: 7,
      type: 'multiple-choice',
      question: "هل لديك مشاكل صحية؟",
      options: ["نعم", "لا"],
      answer: "",
      note: "",
      followUp: (answer: string) => {
        if (answer === "نعم") {
          return {
            id: 7.1,
            type: 'text-input',
            question: "اذكرها",
            answer: "",
            note: ""
          };
        }
        return undefined;
      }
    },
    {
      id: 8,
      type: 'multiple-choice',
      question: "أين سمعت عنا؟" ,
      options: ["يوتيوب", "سناب جات", "انستقرام", "تيكتوك", "أخرى"],
      answer: "",
      note: "",
      followUp: (answer: string) => answer === "أخرى" ? {
        id: 8.1,
        type: 'text-input',
        question: "من أين؟",
        answer: "",
        note: ""
      } : undefined
    },
    {
      id: 9,
      type: 'text-input',
      question: "ماهي اكثر المشاكل السابقة التي كانت تصعب عليك الوصول لهدفك؟",
      answer: "",
      maxLength: 500,
      note: ""
    },
    {
      id: 11,
      type: 'multiple-choice',
      question: "ما مدى معرفتك بتمارين المقاومة؟",
      options: ["مبتدئ", "متوسط", "متقدم"],
      answer: "",
      note: ""
    },
    {
      id: 13,
      type: 'date-input',
      question: "متى تستطيعين البدء بالبرنامج التدريبي؟",
      answer: "",
      value: new Date(), // Today
      minDate: new Date(new Date().setDate(new Date().getDate() + 7)),
      maxDate: new Date(new Date().setMonth(new Date().getMonth() + 1)),
      note: "يجب أن يكون من اسبوع من تاريخ الاشتراك"
    }
  ]
};

export const subscriptions: Subscription[] = [
  {
    id: 1,
    name: "الاشتراك الذهبي",
    description: "اشتراك ٣ أشهر تغذية وتمرين",
    price: 399,
    image: "/workout.png",
    type: "عادي"
  },
  {
    id: 2,
    name: "اشتراك الطلاب",
    description: "اشتراك ٣ أشهر تغذية وتمرين",
    price: 249,
    image: "/workout.png",
    type: "طالب"
  },
];


export const faqData = [
  {
    question: "متى استطيع البدء بعد الاشتراك؟",
    answer: "خلال ٣ أيام عمل على الأقل لتصميم برنامجك المخصص"
  },
  {
    question: "هل الاشتراك للنساء أيضاً؟",
    answer: "نعم، الاشتراك للرجال والنساء"
  },
  {
    question: "كيفية التواصل مع المدرب؟",
    answer: "التواصل مع المدرب عبر المحادثات الكتابية في الواتساب"
  },
  {
    question: "هل النتائج مضمونة؟",
    answer: "نعم، وفي حال الالتزام بكامل التعليمات طوال فترة التسجيل وعدم الحصول على النتائج عند انتهاء الاشتراك فسيسترد المبلغ بالكامل"
  },
  {
    question: "ما هي الحالات التي لا يستقبلها كابتن عبدالعزيز؟",
    answer: "الحالات المرضية المزمنة كمرضى السرطان وأمراض المناعة بالإضافة إلى النساء الحوامل والمرضعات"
  }
]


export const results = [
  {
    image: '/results/1.webp',
  },
  {
    image: '/results/2.webp',
  },
  {
    image: '/results/3.webp',
  },
  {
    image: '/results/4.webp',
  },
  {
    image: '/results/5.webp',
  }
]


