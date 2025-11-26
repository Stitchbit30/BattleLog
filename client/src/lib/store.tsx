import React, { createContext, useContext, useEffect, useState } from 'react';
import { CheckItem, PROGRAM_DATA, WeeklyPhase, DailySchedule } from './program-data';
import { addDays, differenceInDays, startOfDay, format } from 'date-fns';
import type { Profile, DailyLog } from '@shared/schema';
import { profileApi, logsApi } from './api';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

type CampState = {
  profile: Profile | null;
  logs: Record<string, DailyLog>;
  isLoading: boolean;
  setProfile: (profile: Omit<Profile, 'id' | 'createdAt' | 'userId'>) => Promise<void>;
  updateLog: (date: string, updates: Partial<DailyLog>) => void;
  toggleItem: (date: string, itemId: string) => void;
  getDailySchedule: (date: Date) => { phase: WeeklyPhase | null, daySchedule: DailySchedule | undefined, dayNumber: number, weekNumber: number };
  resetData: () => void;
};

const CampContext = createContext<CampState | undefined>(undefined);

export const CampProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const queryClient = useQueryClient();
  
  // Load profile from localStorage first (for profile ID persistence)
  const [profileId, setProfileId] = useState<number | null>(() => {
    const saved = localStorage.getItem('bjj_profile_id');
    return saved ? parseInt(saved) : null;
  });

  // Fetch profile from backend
  const { data: profile, isLoading: profileLoading } = useQuery({
    queryKey: ['profile', profileId],
    queryFn: () => profileId ? profileApi.get(profileId) : Promise.resolve(null),
    enabled: !!profileId,
  });

  // Fetch logs for profile
  const { data: logsArray = [], isLoading: logsLoading } = useQuery({
    queryKey: ['logs', profileId],
    queryFn: () => profileId ? logsApi.getAll(profileId) : Promise.resolve([]),
    enabled: !!profileId,
  });

  // Convert logs array to record
  const logs = React.useMemo(() => {
    return logsArray.reduce((acc, log) => {
      acc[log.date] = log;
      return acc;
    }, {} as Record<string, DailyLog>);
  }, [logsArray]);

  // Create profile mutation
  const createProfileMutation = useMutation({
    mutationFn: profileApi.create,
    onSuccess: (newProfile) => {
      setProfileId(newProfile.id);
      localStorage.setItem('bjj_profile_id', newProfile.id.toString());
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
  });

  // Update log mutation
  const updateLogMutation = useMutation({
    mutationFn: ({ profileId, date, updates }: { profileId: number; date: string; updates: Partial<DailyLog> }) => {
      const currentLog = logs[date];
      const logData = {
        profileId,
        date,
        completedItems: currentLog?.completedItems || [],
        journalEntry: currentLog?.journalEntry || '',
        ...updates,
      };
      return logsApi.upsert(logData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['logs', profileId] });
    },
  });

  const setProfile = async (profileData: Omit<Profile, 'id' | 'createdAt' | 'userId'>) => {
    await createProfileMutation.mutateAsync({ ...profileData, userId: null });
  };

  const updateLog = (date: string, updates: Partial<DailyLog>) => {
    if (!profileId) return;
    updateLogMutation.mutate({ profileId, date, updates });
  };

  const toggleItem = (date: string, itemId: string) => {
    if (!profileId) return;
    const current = logs[date] || { date, completedItems: [], journalEntry: '', profileId };
    const isCompleted = current.completedItems.includes(itemId);
    const newItems = isCompleted
      ? current.completedItems.filter((id: string) => id !== itemId)
      : [...current.completedItems, itemId];
    
    updateLog(date, { completedItems: newItems });
  };

  const getDailySchedule = (date: Date) => {
    if (!profile) return { phase: null, daySchedule: undefined, dayNumber: 0, weekNumber: 0 };
    
    const start = startOfDay(new Date(profile.startDate));
    const current = startOfDay(date);
    const diff = differenceInDays(current, start);
    
    if (diff < 0 || diff >= 12 * 7) return { phase: null, daySchedule: undefined, dayNumber: 0, weekNumber: 0 };

    const weekIndex = Math.floor(diff / 7);
    const dayIndex = diff % 7;
    
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
    localStorage.removeItem('bjj_profile_id');
    setProfileId(null);
    queryClient.clear();
  };

  return (
    <CampContext.Provider value={{ 
      profile: profile || null, 
      logs, 
      isLoading: profileLoading || logsLoading,
      setProfile, 
      updateLog, 
      toggleItem, 
      getDailySchedule, 
      resetData 
    }}>
      {children}
    </CampContext.Provider>
  );
};

export const useCampStore = () => {
  const context = useContext(CampContext);
  if (!context) throw new Error("useCampStore must be used within CampProvider");
  return context;
};
