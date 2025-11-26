import React from 'react';
import { useRoute } from 'wouter';
import { getAthleteDetails } from '@/lib/mock-coach-data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Activity, Moon, Heart, Calendar } from 'lucide-react';
import { format } from 'date-fns';

export default function CoachAthleteView() {
  const [match, params] = useRoute('/coach/:id');
  const athlete = getAthleteDetails(params?.id || '');

  if (!athlete) return <div className="p-8 text-center">Athlete not found</div>;

  return (
    <div className="space-y-6 animate-in slide-in-from-right-4 duration-500 pb-20">
      {/* Header Profile */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-heading font-bold text-primary leading-none mb-2">{athlete.name}</h1>
          <div className="flex gap-2">
            <Badge variant="outline">{athlete.belt} Belt</Badge>
            <Badge variant="outline">{athlete.weight}</Badge>
            <Badge className={athlete.status === 'Injured' ? 'bg-destructive' : 'bg-green-600'}>
              {athlete.status}
            </Badge>
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold">{athlete.compliance}%</div>
          <p className="text-xs text-muted-foreground uppercase">Adherence</p>
        </div>
      </div>

      {/* Health Metrics Charts */}
      <div className="space-y-4">
        <h2 className="text-lg font-heading font-bold flex items-center gap-2">
          <Activity className="w-5 h-5 text-primary" /> 
          Health Trends
        </h2>
        
        <Card>
          <CardHeader className="p-4 pb-0">
            <CardTitle className="text-sm font-medium text-muted-foreground uppercase">Recovery (HRV)</CardTitle>
          </CardHeader>
          <CardContent className="h-[200px] p-4 pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={athlete.healthTrends}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                <XAxis dataKey="date" hide />
                <YAxis domain={['auto', 'auto']} hide />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', backgroundColor: 'hsl(var(--popover))', color: 'hsl(var(--popover-foreground))' }}
                />
                <Line type="monotone" dataKey="hrv" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <div className="grid grid-cols-2 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <Moon className="w-5 h-5 mx-auto mb-2 text-indigo-400" />
              <div className="text-2xl font-bold">{athlete.avgSleep.toFixed(1)}h</div>
              <p className="text-xs text-muted-foreground uppercase">Avg Sleep</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Heart className="w-5 h-5 mx-auto mb-2 text-rose-400" />
              <div className="text-2xl font-bold">52</div>
              <p className="text-xs text-muted-foreground uppercase">Avg RHR</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Journal Feed */}
      <div className="space-y-4">
        <h2 className="text-lg font-heading font-bold flex items-center gap-2">
          <Calendar className="w-5 h-5 text-primary" /> 
          Journal Logs
        </h2>
        <ScrollArea className="h-[300px] rounded-lg border border-border bg-card/50 p-4">
          <div className="space-y-4">
            {athlete.journalEntries.map((entry, i) => (
              <div key={i} className="pb-4 border-b border-border/50 last:border-0 last:pb-0">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-bold text-muted-foreground">{entry.date}</span>
                  {entry.mood && (
                    <Badge variant="secondary" className="text-[10px]">Mood: {entry.mood}/5</Badge>
                  )}
                </div>
                <p className="text-sm leading-relaxed italic">"{entry.text}"</p>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
