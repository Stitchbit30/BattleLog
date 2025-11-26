import React from 'react';
import { useCampStore } from '@/lib/store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';
import { Share2, Trophy, Scale } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { format, parseISO, subDays } from 'date-fns';

export default function ProgressPage() {
  const { logs, profile } = useCampStore();
  const { toast } = useToast();

  // Generate last 7 days data
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = subDays(new Date(), 6 - i);
    const dateKey = format(d, 'yyyy-MM-dd');
    const log = logs[dateKey];
    const count = log ? log.completedItems.length : 0;
    return {
      name: format(d, 'EEE'),
      completed: count,
      date: dateKey
    };
  });

  const totalSessions = Object.values(logs).reduce((acc, log) => acc + (log.completedItems.length > 0 ? 1 : 0), 0);

  const handleExport = () => {
    const report = `
CAMP REPORT - ${profile?.name}
Week Status: ${totalSessions} Active Days

LAST 7 DAYS:
${last7Days.map(d => `${d.name}: ${d.completed} items`).join('\n')}

Sent via Camp Tracker
    `.trim();

    navigator.clipboard.writeText(report);
    toast({
      title: "Report Copied",
      description: "Weekly summary ready to send to coach.",
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-heading font-bold">Camp Stats</h1>
        <Button onClick={handleExport} variant="outline" size="sm" className="gap-2">
          <Share2 className="w-4 h-4" />
          Coach Update
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Card className="bg-primary/10 border-primary/20">
          <CardContent className="p-4 flex flex-col items-center justify-center text-center">
            <Trophy className="w-8 h-8 text-primary mb-2" />
            <div className="text-2xl font-bold">{totalSessions}</div>
            <p className="text-xs text-muted-foreground uppercase">Active Days</p>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="p-4 flex flex-col items-center justify-center text-center">
            <Scale className="w-8 h-8 text-muted-foreground mb-2" />
            <div className="text-2xl font-bold">{profile?.weight}</div>
            <p className="text-xs text-muted-foreground uppercase">Starting Wgt</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium uppercase tracking-wider">Consistency (Last 7 Days)</CardTitle>
        </CardHeader>
        <CardContent className="h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={last7Days}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
              <XAxis 
                dataKey="name" 
                stroke="hsl(var(--muted-foreground))" 
                fontSize={12} 
                tickLine={false} 
                axisLine={false} 
              />
              <Tooltip 
                cursor={{ fill: 'hsl(var(--muted)/0.2)' }}
                contentStyle={{ borderRadius: '8px', border: 'none', backgroundColor: 'hsl(var(--popover))', color: 'hsl(var(--popover-foreground))', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
              />
              <Bar 
                dataKey="completed" 
                fill="hsl(var(--primary))" 
                radius={[4, 4, 0, 0]} 
                barSize={20}
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="bg-muted/30">
        <CardHeader>
          <CardTitle className="text-sm font-medium uppercase tracking-wider">Competition Countdown</CardTitle>
        </CardHeader>
        <CardContent>
           <div className="flex items-center justify-between">
             <div className="text-sm text-muted-foreground">Target Date</div>
             <div className="font-bold">{profile?.competitionDate}</div>
           </div>
        </CardContent>
      </Card>
    </div>
  );
}
