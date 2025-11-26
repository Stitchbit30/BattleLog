import React, { useState, useEffect } from 'react';
import { useCampStore } from '@/lib/store';
import { format } from 'date-fns';
import { CheckCircle2, Circle, Flame, Utensils, Moon, ChevronRight, Calendar, Scale, Activity, Heart, Zap, BedDouble } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

export default function Dashboard() {
  const { getDailySchedule, logs, updateLog, toggleItem, profile } = useCampStore();
  const { toast } = useToast();
  const [today, setToday] = useState(new Date());
  const [showHealth, setShowHealth] = useState(false);
  
  const scheduleData = getDailySchedule(today);
  const dateKey = format(today, 'yyyy-MM-dd');
  const currentLog = logs[dateKey] || { completedItems: [], journalEntry: '', weight: '' };

  const { phase, daySchedule, dayNumber, weekNumber } = scheduleData;

  const hasStarted = dayNumber > 0;
  
  // Safe access for isRestDay
  const isRestDay = daySchedule?.training?.[0]?.includes("Rest");

  const categories = [
    { id: 'training', label: 'Training', icon: Flame, color: 'text-orange-500', items: daySchedule?.training || [] },
    { id: 'nutrition', label: 'Nutrition', icon: Utensils, color: 'text-emerald-500', items: daySchedule?.nutrition || [] },
    { id: 'recovery', label: 'Recovery', icon: Moon, color: 'text-indigo-500', items: daySchedule?.recovery || [] },
  ];

  // Calculate completion for today
  const totalItems = (daySchedule?.training?.length || 0) + (daySchedule?.nutrition?.length || 0) + (daySchedule?.recovery?.length || 0);
  const completedCount = currentLog.completedItems.length;
  const progress = totalItems > 0 ? (completedCount / totalItems) * 100 : 0;

  const handleJournalSave = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    updateLog(dateKey, { journalEntry: e.target.value });
  };

  const handleWeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateLog(dateKey, { weight: e.target.value });
  };

  const handleHealthUpdate = (field: string, value: string) => {
    updateLog(dateKey, { [field]: value });
  };

  const handleCheck = (itemId: string) => {
    toggleItem(dateKey, itemId);
  };

  if (!hasStarted) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center space-y-4">
        <Calendar className="w-16 h-16 text-muted-foreground" />
        <h2 className="text-2xl font-heading">Camp hasn't started yet</h2>
        <p className="text-muted-foreground">Prepare yourself. Day 1 begins on {profile?.startDate ? format(new Date(profile.startDate), 'MMMM do') : '...'}.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-24 animate-in fade-in duration-500">
      {/* Header Section */}
      <div className="flex items-end justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
            Week {weekNumber} • Day {dayNumber}
          </p>
          <h1 className="text-3xl font-heading font-bold text-foreground leading-none mt-1">
            {format(today, 'EEEE')}
          </h1>
          <p className="text-sm text-primary font-medium mt-1">{phase?.phaseName}</p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold font-heading">{Math.round(progress)}%</div>
          <p className="text-xs text-muted-foreground">Daily Goal</p>
        </div>
      </div>

      {/* Progress Bar */}
      <Progress value={progress} className="h-2" />

      {/* Focus Card */}
      <Card className="bg-card/50 border-primary/20 overflow-hidden">
        <div className="absolute top-0 left-0 w-1 h-full bg-primary"></div>
        <CardContent className="p-4">
          <p className="text-xs text-muted-foreground uppercase font-bold mb-1">Daily Focus</p>
          <p className="text-sm font-medium italic">"{daySchedule?.notes}"</p>
        </CardContent>
      </Card>

      {/* Daily Metrics & Health Data */}
      <div className="space-y-4">
         <div className="grid grid-cols-2 gap-4">
          <Card className="bg-card/50">
            <CardHeader className="p-3 pb-0">
              <div className="flex items-center gap-2">
                <Scale className="w-3 h-3 text-muted-foreground" />
                <CardTitle className="text-xs uppercase text-muted-foreground">Morning Weight</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-3 pt-1">
              <div className="flex items-baseline gap-1">
                <Input 
                  className="h-8 text-lg font-bold p-0 border-0 border-b rounded-none focus-visible:ring-0 w-full bg-transparent" 
                  placeholder="0.0" 
                  value={currentLog.weight || ''}
                  onChange={handleWeightChange}
                />
              </div>
            </CardContent>
          </Card>
           <Card className="bg-card/50" onClick={() => setShowHealth(!showHealth)}>
            <CardHeader className="p-3 pb-0">
              <div className="flex items-center justify-between w-full">
                 <div className="flex items-center gap-2">
                  <Activity className="w-3 h-3 text-muted-foreground" />
                  <CardTitle className="text-xs uppercase text-muted-foreground">Health Data</CardTitle>
                </div>
                <ChevronRight className={cn("w-3 h-3 text-muted-foreground transition-transform", showHealth && "rotate-90")} />
              </div>
            </CardHeader>
            <CardContent className="p-3 pt-1">
               <div className="flex items-center h-8">
                 <span className="text-sm font-medium text-primary cursor-pointer">
                    {showHealth ? "Hide Details" : "Add Metrics"}
                 </span>
               </div>
            </CardContent>
          </Card>
        </div>

        <Collapsible open={showHealth} onOpenChange={setShowHealth}>
          <CollapsibleContent className="space-y-4 animate-in slide-in-from-top-2">
            <Card className="bg-muted/30 border-primary/10">
               <CardContent className="p-4 grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs text-muted-foreground flex items-center gap-1">
                      <BedDouble className="w-3 h-3" /> Sleep (Hrs)
                    </label>
                    <Input 
                      type="number" 
                      placeholder="8.0" 
                      className="h-8 bg-card" 
                      value={currentLog.sleepHours || ''}
                      onChange={(e) => handleHealthUpdate('sleepHours', e.target.value)}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs text-muted-foreground flex items-center gap-1">
                      <Zap className="w-3 h-3" /> HRV (ms)
                    </label>
                    <Input 
                      type="number" 
                      placeholder="50" 
                      className="h-8 bg-card"
                      value={currentLog.hrv || ''}
                      onChange={(e) => handleHealthUpdate('hrv', e.target.value)}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs text-muted-foreground flex items-center gap-1">
                      <Heart className="w-3 h-3" /> RHR (bpm)
                    </label>
                    <Input 
                      type="number" 
                      placeholder="60" 
                      className="h-8 bg-card"
                      value={currentLog.restingHR || ''}
                      onChange={(e) => handleHealthUpdate('restingHR', e.target.value)}
                    />
                  </div>
                   <div className="space-y-1">
                    <label className="text-xs text-muted-foreground flex items-center gap-1">
                      <Flame className="w-3 h-3" /> Active Cals
                    </label>
                    <Input 
                      type="number" 
                      placeholder="500" 
                      className="h-8 bg-card"
                      value={currentLog.activeCalories || ''}
                      onChange={(e) => handleHealthUpdate('activeCalories', e.target.value)}
                    />
                  </div>
                   <div className="col-span-2 space-y-1">
                    <label className="text-xs text-muted-foreground">Sleep Quality</label>
                     <Select 
                       value={currentLog.sleepQuality || ''} 
                       onValueChange={(val) => handleHealthUpdate('sleepQuality', val)}
                     >
                      <SelectTrigger className="h-8 bg-card">
                        <SelectValue placeholder="Select quality" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Poor">Poor</SelectItem>
                        <SelectItem value="Fair">Fair</SelectItem>
                        <SelectItem value="Good">Good</SelectItem>
                        <SelectItem value="Excellent">Excellent</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
               </CardContent>
            </Card>
          </CollapsibleContent>
        </Collapsible>
      </div>

      {/* Checklists */}
      <div className="space-y-6">
        {categories.map((cat) => (
          <div key={cat.id} className="space-y-3">
            <div className="flex items-center gap-2">
              <cat.icon className={cn("w-5 h-5", cat.color)} />
              <h3 className="font-heading text-lg tracking-wide">{cat.label}</h3>
            </div>
            <div className="space-y-2">
              {cat.items.map((item: string, idx: number) => {
                const itemId = `${cat.id}-${idx}`; // Simple ID generation
                const isChecked = currentLog.completedItems.includes(itemId);
                
                return (
                  <div 
                    key={itemId}
                    onClick={() => handleCheck(itemId)}
                    className={cn(
                      "group flex items-center gap-3 p-3 rounded-lg border transition-all cursor-pointer active:scale-[0.99]",
                      isChecked 
                        ? "bg-primary/5 border-primary/30" 
                        : "bg-card border-border hover:border-primary/20"
                    )}
                  >
                    <div className={cn(
                      "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors",
                      isChecked ? "border-primary bg-primary text-primary-foreground" : "border-muted-foreground/30 group-hover:border-primary/50"
                    )}>
                      {isChecked && <CheckCircle2 className="w-4 h-4" />}
                    </div>
                    <span className={cn(
                      "text-sm font-medium flex-1 transition-opacity",
                      isChecked ? "opacity-50 line-through" : "opacity-100"
                    )}>
                      {item}
                    </span>
                  </div>
                );
              })}
              {cat.items.length === 0 && (
                <p className="text-sm text-muted-foreground italic pl-9">No items for today.</p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Journal Section */}
      <div className="space-y-3 pt-4">
        <div className="flex items-center justify-between">
          <h3 className="font-heading text-lg tracking-wide">Daily Journal</h3>
          <Badge variant="outline" className="text-[10px]">Auto-Saved</Badge>
        </div>
        <Textarea 
          placeholder="How did training feel? Any injuries? Rate your RPE..."
          className="min-h-[120px] bg-card/50 resize-none focus:bg-card transition-colors"
          value={currentLog.journalEntry}
          onChange={handleJournalSave}
        />
      </div>
    </div>
  );
}
