import React, { createContext, useContext, useEffect, useState } from 'react';
import { CheckItem, PROGRAM_DATA, WeeklyPhase, DailySchedule } from './program-data';
import { addDays, differenceInDays, startOfDay, format } from 'date-fns';

type Profile = {
  name: string;
  weight: string;
  height: string;
  belt: string;
  startDate: string; // ISO date string
  competitionDate: string; // ISO date string
};

type DailyLog = {
  date: string; // ISO date string YYYY-MM-DD
  completedItems: string[]; // IDs of completed items
  journalEntry: string;
  weight?: string;
  mood?: number; // 1-5
  sleepHours?: string;
  sleepQuality?: string;
  hrv?: string;
  restingHR?: string;
  activeCalories?: string;
  dailyFocus?: string;
};

type CampState = {
  profile: Profile | null;
  logs: Record<string, DailyLog>; // Keyed by YYYY-MM-DD
  setProfile: (profile: Profile) => void;
  updateLog: (date: string, updates: Partial<DailyLog>) => void;
  toggleItem: (date: string, itemId: string) => void;
  getDailySchedule: (date: Date) => { phase: WeeklyPhase | null, daySchedule: DailySchedule | undefined, dayNumber: number, weekNumber: number };
  resetData: () => void;
};

const CampContext = createContext<CampState | undefined>(undefined);

export const CampProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profile, setProfileState] = useState<Profile | null>(() => {
    const saved = localStorage.getItem('bjj_camp_profile');
    return saved ? JSON.parse(saved) : null;
  });

  const [logs, setLogs] = useState<Record<string, DailyLog>>(() => {
    const saved = localStorage.getItem('bjj_camp_logs');
    return saved ? JSON.parse(saved) : {};
  });

  useEffect(() => {
    localStorage.setItem('bjj_camp_profile', JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    localStorage.setItem('bjj_camp_logs', JSON.stringify(logs));
  }, [logs]);

  const setProfile = (p: Profile) => setProfileState(p);

  const updateLog = (date: string, updates: Partial<DailyLog>) => {
    setLogs(prev => {
      const current = prev[date] || { date, completedItems: [], journalEntry: '' };
      return {
        ...prev,
        [date]: { ...current, ...updates }
      };
    });
  };

  const toggleItem = (date: string, itemId: string) => {
    setLogs(prev => {
      const current = prev[date] || { date, completedItems: [], journalEntry: '' };
      const isCompleted = current.completedItems.includes(itemId);
      const newItems = isCompleted
        ? current.completedItems.filter(id => id !== itemId)
        : [...current.completedItems, itemId];
      
      return {
        ...prev,
        [date]: { ...current, completedItems: newItems }
      };
    });
  };

  const getDailySchedule = (date: Date) => {
    if (!profile) return { phase: null, daySchedule: undefined, dayNumber: 0, weekNumber: 0 };
    
    const start = startOfDay(new Date(profile.startDate));
    const current = startOfDay(date);
    const diff = differenceInDays(current, start);
    
    if (diff < 0 || diff >= 12 * 7) return { phase: null, daySchedule: undefined, dayNumber: 0, weekNumber: 0 };

    const weekIndex = Math.floor(diff / 7);
    const dayIndex = diff % 7; // 0-6
    
    const phase = PROGRAM_DATA[weekIndex];
    const daySchedule = phase?.schedule.find(d => d.dayOffset === dayIndex);

    return {
      phase,
      daySchedule,
      dayNumber: diff + 1,
      weekNumber: weekIndex + 1
    };
  };

  const resetData = () => {
    localStorage.removeItem('bjj_camp_profile');
    localStorage.removeItem('bjj_camp_logs');
    setProfileState(null);
    setLogs({});
  };

  return (
    <CampContext.Provider value={{ profile, logs, setProfile, updateLog, toggleItem, getDailySchedule, resetData }}>
      {children}
    </CampContext.Provider>
  );
};

export const useCampStore = () => {
  const context = useContext(CampContext);
  if (!context) throw new Error("useCampStore must be used within CampProvider");
  return context;
};
