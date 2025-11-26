export type CheckItem = {
  id: string;
  label: string;
  category: 'training' | 'nutrition' | 'recovery';
  completed: boolean;
};

export type DailySchedule = {
  dayOffset: number; // 0-6 (Monday-Sunday)
  training: string[]; // e.g., ["BJJ: Drilling", "S&C: Squat Day"]
  nutrition: string[]; // e.g., ["Hit Protein Goal", "Hydration 4L"]
  recovery: string[]; // e.g., ["Sleep 8h", "Stretching"]
  notes: string;
};

export type WeeklyPhase = {
  weekNumber: number;
  phaseName: string;
  focus: string;
  schedule: DailySchedule[];
};

const STANDARD_WEEK = [
  {
    dayOffset: 0, // Mon
    training: ["BJJ: Hard Sparring", "S&C: Lower Body Strength"],
    nutrition: ["Caloric Surplus (+200)", "Creatine"],
    recovery: ["Sleep 8h", "Foam Roll"],
    notes: "Start strong. Focus on passing."
  },
  {
    dayOffset: 1, // Tue
    training: ["BJJ: Drilling / Tech", "Conditioning: Zone 2 Cardio (45m)"],
    nutrition: ["Maintenance Calories", "Electrolytes"],
    recovery: ["Active Recovery", "Cold Shower"],
    notes: "Technique focus."
  },
  {
    dayOffset: 2, // Wed
    training: ["BJJ: Positional Sparring", "S&C: Upper Body Strength"],
    nutrition: ["High Carb Day", "Post-workout Shake"],
    recovery: ["Sleep 8.5h", "Massage Gun"],
    notes: "Mid-week grind."
  },
  {
    dayOffset: 3, // Thu
    training: ["BJJ: Flow Roll", "Mobility Session"],
    nutrition: ["Maintenance Calories"],
    recovery: ["Sauna / Hot Bath", "Nap (20m)"],
    notes: "Active recovery focus."
  },
  {
    dayOffset: 4, // Fri
    training: ["BJJ: Competition Rounds", "S&C: Full Body Power"],
    nutrition: ["High Protein", "Hydration Focus"],
    recovery: ["Sleep 9h"],
    notes: "Hardest session of the week."
  },
  {
    dayOffset: 5, // Sat
    training: ["BJJ: Open Mat", "Conditioning: Sprints"],
    nutrition: ["Refeed Meal"],
    recovery: ["Contrast Bath", "Yoga"],
    notes: "Empty the tank."
  },
  {
    dayOffset: 6, // Sun
    training: ["Rest Day", "Walk (30m)"],
    nutrition: ["Maintenance Calories", "Meal Prep"],
    recovery: ["Total Rest", "Mental Visualization"],
    notes: "Visualize next week."
  },
];

export const PROGRAM_DATA: WeeklyPhase[] = Array.from({ length: 12 }, (_, i) => {
  const weekNum = i + 1;
  let phaseName = "Base Building";
  let focus = "Hypertrophy & Cardio Base";

  if (weekNum > 4 && weekNum <= 8) {
    phaseName = "Strength & Power";
    focus = "Max Strength & Intensity";
  } else if (weekNum > 8) {
    phaseName = "Peaking";
    focus = "Speed, Agility & Competition Specificity";
  }

  return {
    weekNumber: weekNum,
    phaseName,
    focus,
    schedule: STANDARD_WEEK.map(day => ({...day})) // Clone standard week
  };
});
