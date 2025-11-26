import { subDays, format } from 'date-fns';

export type AthleteSummary = {
  id: string;
  name: string;
  belt: string;
  weight: string;
  status: 'On Track' | 'At Risk' | 'Injured' | 'Peaking';
  compliance: number; // 0-100
  avgSleep: number;
  avgReadiness: string;
  lastCheckIn: string;
  avatarInitial: string;
};

export type AthleteDetail = AthleteSummary & {
  logs: any[]; // Mock logs
  journalEntries: { date: string; text: string; mood?: number }[];
  healthTrends: { date: string; sleep: number; hrv: number; rhr: number }[];
};

const MOCK_NAMES = [
  { name: "Marcus Almeida", belt: "Black", weight: "Heavy" },
  { name: "Mikey Musumeci", belt: "Black", weight: "Rooster" },
  { name: "Tainan Dalpra", belt: "Black", weight: "Middle" },
  { name: "Ffion Davies", belt: "Black", weight: "Light" },
  { name: "Mica Galvao", belt: "Brown", weight: "Middle" },
];

export const generateMockAthletes = (): AthleteSummary[] => {
  return MOCK_NAMES.map((p, idx) => ({
    id: `athlete-${idx}`,
    name: p.name,
    belt: p.belt,
    weight: p.weight,
    status: idx === 1 ? 'At Risk' : idx === 4 ? 'Injured' : 'On Track',
    compliance: idx === 1 ? 65 : 92,
    avgSleep: 7.5 + (Math.random() * 1.5),
    avgReadiness: idx === 4 ? "Low" : "High",
    lastCheckIn: format(subDays(new Date(), idx === 1 ? 3 : 0), 'yyyy-MM-dd'),
    avatarInitial: p.name.charAt(0)
  }));
};

export const getAthleteDetails = (id: string): AthleteDetail | null => {
  const summary = generateMockAthletes().find(a => a.id === id);
  if (!summary) return null;

  // Generate 30 days of mock data
  const healthTrends = Array.from({ length: 30 }, (_, i) => {
    return {
      date: format(subDays(new Date(), 29 - i), 'MMM dd'),
      sleep: 6 + Math.random() * 3,
      hrv: 40 + Math.random() * 40,
      rhr: 50 + Math.random() * 15
    };
  });

  const journalEntries = [
    { date: format(subDays(new Date(), 2), 'yyyy-MM-dd'), text: "Feeling sharp today. Passing is connecting.", mood: 4 },
    { date: format(subDays(new Date(), 5), 'yyyy-MM-dd'), text: "Knee feels a bit tweaky. Going light on sparring.", mood: 2 },
    { date: format(subDays(new Date(), 10), 'yyyy-MM-dd'), text: "Great conditioning session. Hit all PRs.", mood: 5 },
    { date: format(subDays(new Date(), 12), 'yyyy-MM-dd'), text: "Tired. Sleep was bad last night.", mood: 3 },
  ];

  return {
    ...summary,
    logs: [],
    journalEntries,
    healthTrends
  };
};
