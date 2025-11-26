import React from 'react';
import { useCampStore } from '@/lib/store';
import { format, addDays, startOfDay, isSameDay } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { CheckCircle2, Circle, Calendar as CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

export default function WeekView() {
  const { getDailySchedule, logs, profile } = useCampStore();
  const today = new Date();
  const { weekNumber } = getDailySchedule(today);

  // If camp hasn't started or is over, weekNumber might be 0 or out of bounds.
  // We'll assume we want to show the "current" week relative to today.
  
  // Find the start of the current week of the program
  // We can just iterate 0-6 for the current weekNumber
  // But we need the actual dates to check logs.
  
  const currentSchedule = getDailySchedule(today);
  
  // If we are not in a valid week, just show empty or something?
  // Or calculate the dates for the current week starting from... when?
  // The store calculates week based on start date.
  
  const days = [];
  if (profile && currentSchedule.weekNumber > 0) {
     const startDate = new Date(profile.startDate);
     const startOfCurrentWeek = addDays(startDate, (currentSchedule.weekNumber - 1) * 7);
     
     for (let i = 0; i < 7; i++) {
       const date = addDays(startOfCurrentWeek, i);
       const schedule = getDailySchedule(date);
       const dateKey = format(date, 'yyyy-MM-dd');
       const log = logs[dateKey];
       const isToday = isSameDay(date, today);
       
       // Calculate status
       const totalItems = (schedule.daySchedule?.training?.length || 0) + 
                          (schedule.daySchedule?.nutrition?.length || 0) + 
                          (schedule.daySchedule?.recovery?.length || 0);
       const completedItems = log?.completedItems?.length || 0;
       
       let status = 'pending';
       if (totalItems > 0 && completedItems === totalItems) status = 'completed';
       else if (completedItems > 0) status = 'in-progress';
       
       const isRest = schedule.daySchedule?.training?.[0]?.includes("Rest");

       days.push({
         date,
         dayName: format(date, 'EEEE'),
         shortDate: format(date, 'MMM d'),
         schedule: schedule.daySchedule,
         log,
         status,
         isToday,
         isRest
       });
     }
  }

  return (
    <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-heading font-bold">Week {weekNumber || '-'}</h1>
          <p className="text-muted-foreground">Weekly Overview</p>
        </div>
        <CalendarIcon className="w-8 h-8 text-primary/20" />
      </div>

      <ScrollArea className="h-[calc(100vh-10rem)] pr-4">
        <div className="space-y-4">
          {days.map((day) => (
            <Card key={day.date.toISOString()} className={cn(
              "overflow-hidden transition-all",
              day.isToday ? "border-primary ring-1 ring-primary/20" : "border-border",
              day.status === 'completed' ? "bg-primary/5" : ""
            )}>
              <div className="flex items-center p-4 gap-4">
                <div className={cn(
                  "flex flex-col items-center justify-center w-14 h-14 rounded-lg border",
                  day.isToday ? "bg-primary text-primary-foreground border-primary" : "bg-muted border-border"
                )}>
                  <span className="text-xs font-bold uppercase">{format(day.date, 'EEE')}</span>
                  <span className="text-lg font-bold">{format(day.date, 'd')}</span>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className={cn("font-heading text-lg truncate", day.isToday && "text-primary")}>
                      {day.isRest ? "Rest Day" : "Training Day"}
                    </h3>
                    {day.status === 'completed' && (
                      <Badge variant="secondary" className="text-[10px] bg-green-500/10 text-green-600 hover:bg-green-500/20 border-green-500/20">
                        Done
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground truncate">
                    {day.schedule?.training?.[0] || "No training scheduled"}
                  </p>
                </div>

                <div>
                  {day.status === 'completed' ? (
                    <CheckCircle2 className="w-6 h-6 text-green-500" />
                  ) : day.status === 'in-progress' ? (
                    <div className="w-6 h-6 rounded-full border-2 border-primary/40 border-t-primary animate-spin" />
                  ) : (
                    <Circle className="w-6 h-6 text-muted-foreground/20" />
                  )}
                </div>
              </div>
              
              {/* Expanded details for today or if needed could go here */}
              {day.schedule?.notes && (
                <div className="px-4 pb-3 text-xs text-muted-foreground italic">
                  "{day.schedule.notes}"
                </div>
              )}
            </Card>
          ))}
          
          {days.length === 0 && (
            <div className="text-center py-10 text-muted-foreground">
              <p>Schedule not available.</p>
              <p className="text-sm">Please ensure your start date is set correctly in settings.</p>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
