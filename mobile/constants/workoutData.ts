export interface Exercise {
  id: string;
  name: string;
  muscle: string;
  sets: number;
  reps: string;
  rest: string;
  icon?: string; // Icon name from an icon library
}

export interface WorkoutDay {
  id: string;
  name: string;
  exercises: Exercise[];
}

export interface WorkoutWeek {
  weekNumber: number;
  days: WorkoutDay[];
}

const workoutPlan: WorkoutDay[] = [
  // Day 1: Push
  {
    id: 'day1',
    name: 'اليوم الأول (دفع)',
    exercises: [
      { id: 'ex1', name: 'SMITH MACHINE INCLINE PRESS', muscle: 'صدر علوي', sets: 3, reps: '7-10', rest: '60-120 ثانية', icon: 'chest' },
      { id: 'ex2', name: 'CHEST PRESS MACHINE', muscle: 'صدر مستوي', sets: 3, reps: '7-10', rest: '60-120 ثانية', icon: 'chest' },
      { id: 'ex3', name: 'MACHINE FLY', muscle: 'صدر عزل', sets: 2, reps: '10-15', rest: '60-120 ثانية', icon: 'chest' },
      { id: 'ex4', name: 'LATERAL RAISE DUMBBELL', muscle: 'اكتاف جانبي', sets: 3, reps: '10-15', rest: '60-120 ثانية', icon: 'shoulders' },
      { id: 'ex5', name: 'CABLE TRICEPS PUSHDOWN', muscle: 'ترايسبس', sets: 3, reps: '10-15', rest: '60-120 ثانية', icon: 'triceps' },
      { id: 'ex6', name: 'DUMBBELL SKULLCRUSHER', muscle: 'ترايسبس', sets: 2, reps: '8-12', rest: '60-120 ثانية', icon: 'triceps' },
    ],
  },
  // Day 2: Pull
  {
    id: 'day2',
    name: 'اليوم الثاني (سحب)',
    exercises: [
      { id: 'ex7', name: 'NORMAL GRIP PULLDOWNS', muscle: 'سحب راسي ظهر', sets: 3, reps: '10-15', rest: '60-90 ثانية', icon: 'back' },
      { id: 'ex8', name: 'BARBELL ROW', muscle: 'سحب افقي ظهر', sets: 3, reps: '10-15', rest: '60-120 ثانية', icon: 'back' },
      { id: 'ex9', name: 'SEATED CABLE ROW', muscle: 'سحب افقي ظهر', sets: 2, reps: '7-10', rest: '60-120 ثانية', icon: 'back' },
      { id: 'ex10', name: 'MACHINE PREACHER CURL', muscle: 'بايسبس', sets: 3, reps: '10-15', rest: '60-90 ثانية', icon: 'biceps' },
      { id: 'ex11', name: 'INCLINE DUMBBELL CURL', muscle: 'بايسبس', sets: 2, reps: '8-12', rest: '60-120 ثانية', icon: 'biceps' },
      { id: 'ex12', name: 'MACHINE REVERSE FLY', muscle: 'اكتاف خلفي', sets: 3, reps: '10-15', rest: '60-90 ثانية', icon: 'shoulders' },
    ],
  },
  // Day 3: Legs & Side Shoulders
  {
    id: 'day3',
    name: 'اليوم الثالث (ارجل- كتف جانبي)',
    exercises: [
      { id: 'ex13', name: 'LATERAL RAISE DUMBBELL', muscle: 'اكتاف جانبي', sets: 3, reps: '10-15', rest: '60-90 ثانية', icon: 'shoulders' },
      { id: 'ex14', name: 'LEG EXTENSION', muscle: 'رجلين امامي', sets: 3, reps: '10-15', rest: '60-120 ثانية', icon: 'legs' },
      { id: 'ex15', name: 'HACK SQUAT', muscle: 'رجلين سكوات', sets: 3, reps: '7-10', rest: '60-120 ثانية', icon: 'legs' },
      { id: 'ex16', name: 'SEATED LEG CURL', muscle: 'رجلين خلفي عزل', sets: 3, reps: '10-15', rest: '60-120 ثانية', icon: 'legs' },
      { id: 'ex17', name: 'CALF MACHINE', muscle: 'البطات', sets: 4, reps: '10-15', rest: '60-120 ثانية', icon: 'calves' },
      { id: 'ex18', name: 'ROPE CRUNCH', muscle: 'بطن', sets: 3, reps: '10-15', rest: '60-120 ثانية', icon: 'abs' },
    ],
  },
  // Day 4: Upper
  {
    id: 'day4',
    name: 'اليوم الرابع (علوي)',
    exercises: [
      { id: 'ex19', name: 'INCLINE DB PRESS', muscle: 'صدر علوي', sets: 4, reps: '8-12', rest: '60-120 ثانية', icon: 'chest' },
      { id: 'ex20', name: 'INCLINE HUMMER PRESS', muscle: 'صدر علوي', sets: 4, reps: '8-12', rest: '60-120 ثانية', icon: 'chest' },
      { id: 'ex21', name: 'HAMMER HIGH ROW', muscle: 'سحب راسي ظهر', sets: 4, reps: '10-15', rest: '60-90 ثانية', icon: 'back' },
      { id: 'ex22', name: 'WIDE-GRIP CABLE ROW', muscle: 'سحب افقي ظهر', sets: 4, reps: '8-12', rest: '60-90 ثانية', icon: 'back' },
      { id: 'ex23', name: 'MACHINE PREACHER CURL', muscle: 'بايسبس', sets: 3, reps: '10-15', rest: '60-90 ثانية', icon: 'biceps' },
      { id: 'ex24', name: 'ROPE OVERHEAD TRICEPS EXTENSION', muscle: 'ترايسبس', sets: 4, reps: '10-15', rest: '60-90 ثانية', icon: 'triceps' },
    ],
  },
  // Day 5: Lower & Side Shoulders
  {
    id: 'day5',
    name: 'اليوم الخامس (سفلي - كتف جانبي)',
    exercises: [
      { id: 'ex25', name: 'LEANING CABLE LATERAL RAISE', muscle: 'اكتاف جانبي', sets: 4, reps: '10-15', rest: '60-120 ثانية', icon: 'shoulders' },
      { id: 'ex26', name: 'LEG PRESS', muscle: 'افخاذ امامية', sets: 3, reps: '8-12', rest: '60-90 ثانية', icon: 'legs' },
      { id: 'ex27', name: 'BULGARIAN SPLIT-SQUAT', muscle: 'رجلين سكوات', sets: 3, reps: '10-15', rest: '60-90 ثانية', icon: 'legs' },
      { id: 'ex28', name: 'LYING LEG CURL', muscle: 'افخاذ خلفية', sets: 3, reps: '10-15', rest: '60-90 ثانية', icon: 'legs' },
      { id: 'ex29', name: 'LEG PRESS CALVES', muscle: 'البطات', sets: 3, reps: '10-15', rest: '60-90 ثانية', icon: 'calves' },
      { id: 'ex30', name: 'MACHINE CRUNCH', muscle: 'البطن', sets: 3, reps: '10-15', rest: '60-90 ثانية', icon: 'abs' },
    ],
  },
];

const generateFullWorkoutData = (): WorkoutWeek[] => {
  const weeks: WorkoutWeek[] = [];
  for (let i = 1; i <= 12; i++) {
    weeks.push({
      weekNumber: i,
      days: workoutPlan,
    });
  }
  return weeks;
};

export const workoutData = generateFullWorkoutData(); 