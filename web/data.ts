// Base question interface
export interface BaseQuestion {
  id: number;
  question: string;
}

// Question with date input
export interface DateInputQuestion extends BaseQuestion {
  type: 'date-input';
  answer: string;
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

// Question with image and multiple choice
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
      followUp: (answer: string) => ({
        id: 3.1,
        type: 'multiple-choice',
        question: "هل بإمكانك التمرين ليوم إضافي لتقسيم الجهد وحجم التمرين؟",
        options: ["نعم", "لا"],
        answer: ""
      })
    },
    {
      id: 4,
      type: 'multiple-choice',
      question: "هل تود استخدام الهرمونات؟",
      options: ["نعم", "لا"],
      answer: "",
      followUp: (answer: string) => answer === "نعم" ? {
        id: 4.1,
        type: 'text-input',
        question: "اذكر كورساتك السابقة (إن وجدت)",
        answer: ""
      } : undefined
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
      type: 'date-input',
      question: "تاريخ الميلاد",
      answer: "٢٠٠٠-٢٠٠٩"
    },
    {
      id: 7,
      type: 'multiple-choice',
      question: "هل لديك مشاكل صحية؟",
      options: ["نعم", "لا"],
      answer: "",
      followUp: (answer: string) => {
        if (answer === "نعم") {
          return {
            id: 7.1,
            type: 'text-input',
            question: "اذكرها",
            answer: ""
          };
        }
        return undefined;
      }
    },
    {
      id: 8,
      type: 'multiple-choice',
      question: "أين سمعت عنا؟" ,
      options: ["يوتيوب", "اكس", "تيليغرام", "تيكتوك", "أخرى"],
      answer: "",
      followUp: (answer: string) => answer === "أخرى" ? {
        id: 8.1,
        type: 'text-input',
        question: "من أين؟",
        answer: ""
      } : undefined
    },
    {
      id: 9,
      type: 'text-input',
      question: "ماهي اكثر المشاكل السابقة التي كانت تصعب عليك الوصول لهدفك؟",
      answer: "",
     
    },
   
    {
      id: 11,
      type: 'multiple-choice',
      question: "ما مدى معرفتك بتمارين المقاومة؟",
      options: ["مبتدئ", "متوسط", "متقدم"],
      answer: ""
    },
    {
      id: 12, // will delete and add a birthday checker in the prev birthday question
      type: 'multiple-choice',
      question: "هل ستقوم بالالتزام بتعليمات المدرب وعمرك أكبر من ١٦ سنة؟",
      options: ["نعم", "لا"],
      answer: "",
     
    },
    {
      id: 13,
      type: 'date-input',
      question: "متى تستطيع البدء بالبرنامج التدريبي؟",
      answer: ""
    },

  ],
  female: [
    // Similar structure for female questions...
    {
      id: 1,
      type: 'multiple-choice',
      question: "أين ستقومين بالتمارين؟",
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
      question: "ما عدد أيام التمرين التي ستلتزمين بها خلال اشتراكك؟",
      options: ["٣ أيام", "٤ أيام", "٥ أيام"],
      answer: "",
      followUp: (answer: string) => ({
        id: 3.1,
        type: 'multiple-choice',
        question: "هل بإمكانك التمرين ليوم إضافي لتقسيم الجهد وحجم التمرين؟",
        options: ["نعم", "لا"],
        answer: ""
      })
    },
    {
      id: 10,
      type: 'image-choice',
      question: "ما هو أقرب شكل لنسبة الدهون في الجسم لديك؟",
      options: [{ image: "1.png", value: "1" }, { image: "2.png", value: "2" }, { image: "3.png", value: "3" }, { image: "4.png", value: "4" }, { image: "5.png", value: "5" }, { image: "6.png", value: "6" }, { image: "7.png", value: "7" }, { image: "8.png", value: "8" }],
      imageFolder: "/female",
      answer: "1"
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
      type: 'date-input',
      question: "تاريخ الميلاد",
      answer: "٢٠٠٠-٢٠٠٩"
    },
    {
      id: 7,
      type: 'multiple-choice',
      question: "هل لديك مشاكل صحية؟",
      options: ["نعم", "لا"],
      answer: "",
      followUp: (answer: string) => {
        if (answer === "نعم") {
          return {
            id: 7.1,
            type: 'text-input',
            question: "اذكرها",
            answer: ""
          };
        }
        return undefined;
      }
    },
    {
      id: 8,
      type: 'multiple-choice',
      question: "أين سمعت عنا؟" ,
      options: ["يوتيوب", "اكس", "تيليغرام", "تيكتوك", "أخرى"],
      answer: "",
      followUp: (answer: string) => answer === "أخرى" ? {
        id: 8.1,
        type: 'text-input',
        question: "من أين؟",
        answer: ""
      } : undefined
    },
    {
      id: 9,
      type: 'text-input',
      question: "ماهي اكثر المشاكل السابقة التي كانت تصعب عليك الوصول لهدفك؟",
      answer: "",
     
    },
   
    {
      id: 11,
      type: 'multiple-choice',
      question: "ما مدى معرفتك بتمارين المقاومة؟",
      options: ["مبتدئ", "متوسط", "متقدم"],
      answer: ""
    },
    {
      id: 12, // will delete and add a birthday checker in the prev birthday question
      type: 'multiple-choice',
      question: "هل ستقومين بالالتزام بتعليمات المدرب وعمرك أكبر من ١٦ سنة؟",
      options: ["نعم", "لا"],
      answer: "",
     
    },
    {
      id: 13,
      type: 'date-input',
      question: "متى تستطيعين البدء بالبرنامج التدريبي؟",
      answer: ""
    }
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


export const faqData = [
  {
    question: "هل تريد البدء معنا؟",
    answer: "نعم، يمكنك البدء معنا في أي وقت"
  },
  {
    question: "هل النتائج مضمونة؟",
    answer: "النتائج تعتمد على التزامك بالبرنامج"
  },
  {
    question: "هل تستطيع إنقاص الوزن؟",
    answer: "نعم، مع برنامجنا المتخصص"
  },
  {
    question: "كيف التواصل مع المدرب؟",
    answer: "يمكنك التواصل عبر التطبيق مباشرة"
  },
  {
    question: "هل يوجد خطة استرجاع المال؟",
    answer: "نعم، لدينا سياسة استرجاع خلال 30 يوم"
  },
  {
    question: "هل يمكن تغيير المدرب الخاص بي؟",
    answer: "نعم، يمكنك طلب تغيير المدرب"
  },
  {
    question: "متى الدفعات التي يستحقها النادي مستحقة؟",
    answer: "الدفعات تستحق في بداية كل شهر"
  }
]


