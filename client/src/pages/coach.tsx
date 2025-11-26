import React from 'react';
import { Link } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Users, TrendingUp, AlertCircle, ChevronRight } from 'lucide-react';
import { generateMockAthletes } from '@/lib/mock-coach-data';
import { cn } from '@/lib/utils';

export default function CoachDashboard() {
  const athletes = generateMockAthletes();

  const atRiskCount = athletes.filter(a => a.status === 'At Risk' || a.status === 'Injured').length;
  const avgCompliance = Math.round(athletes.reduce((acc, curr) => acc + curr.compliance, 0) / athletes.length);

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-20">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-heading font-bold">Team Overview</h1>
          <p className="text-muted-foreground">Coach Dashboard</p>
        </div>
        <div className="bg-primary/10 p-2 rounded-full">
          <Users className="w-6 h-6 text-primary" />
        </div>
      </div>

      {/* Team Stats */}
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-4 flex flex-col justify-center">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <TrendingUp className="w-4 h-4" />
              <span className="text-xs uppercase font-bold">Avg Compliance</span>
            </div>
            <div className="text-2xl font-bold">{avgCompliance}%</div>
          </CardContent>
        </Card>
        <Card className={cn(atRiskCount > 0 ? "border-destructive/50 bg-destructive/5" : "")}>
          <CardContent className="p-4 flex flex-col justify-center">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <AlertCircle className={cn("w-4 h-4", atRiskCount > 0 ? "text-destructive" : "")} />
              <span className="text-xs uppercase font-bold">Attention Needed</span>
            </div>
            <div className={cn("text-2xl font-bold", atRiskCount > 0 ? "text-destructive" : "")}>
              {atRiskCount} Athletes
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Athlete List */}
      <div>
        <h2 className="text-lg font-heading font-bold mb-4">Roster</h2>
        <div className="space-y-3">
          {athletes.map((athlete) => (
            <Link key={athlete.id} href={`/coach/${athlete.id}`}>
              <div className="group cursor-pointer">
                <Card className="hover:border-primary/50 transition-colors">
                  <CardContent className="p-4 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center font-heading font-bold text-lg">
                      {athlete.avatarInitial}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-bold truncate">{athlete.name}</h3>
                        <Badge variant={
                          athlete.status === 'On Track' ? 'default' : 
                          athlete.status === 'Injured' ? 'destructive' : 'secondary'
                        } className="text-[10px] uppercase">
                          {athlete.status}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>{athlete.belt} Belt</span>
                        <span>•</span>
                        <span className={cn(
                          athlete.compliance < 80 ? "text-orange-500" : "text-green-500"
                        )}>{athlete.compliance}% Compliance</span>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                  </CardContent>
                </Card>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
