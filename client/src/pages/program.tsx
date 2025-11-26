import React from 'react';
import { PROGRAM_DATA } from '@/lib/program-data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function Program() {
  return (
    <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
      <div className="mb-6">
        <h1 className="text-3xl font-heading font-bold">Full Program</h1>
        <p className="text-muted-foreground">12-Week Competition Preparation</p>
      </div>

      <ScrollArea className="h-[calc(100vh-10rem)] pr-4">
        <div className="space-y-8">
          {/* Phases */}
          <div className="space-y-4">
            {PROGRAM_DATA.map((phase) => (
              <Card key={phase.weekNumber} className="overflow-hidden">
                <div className="bg-muted/50 px-4 py-2 border-b border-border flex items-center justify-between">
                  <span className="font-heading font-bold text-primary">Week {phase.weekNumber}</span>
                  <Badge variant="secondary" className="text-[10px]">{phase.phaseName}</Badge>
                </div>
                <CardContent className="p-0">
                   <Accordion type="single" collapsible className="w-full">
                     <AccordionItem value="details" className="border-b-0">
                       <AccordionTrigger className="px-4 py-3 hover:no-underline">
                         <span className="text-sm font-medium">{phase.focus}</span>
                       </AccordionTrigger>
                       <AccordionContent className="px-4 pb-4 bg-muted/20">
                          <div className="space-y-4 pt-2">
                            {phase.schedule.map(day => (
                              <div key={day.dayOffset} className="grid grid-cols-[3rem_1fr] gap-4 text-sm">
                                <div className="font-bold text-muted-foreground">Day {day.dayOffset + 1}</div>
                                <div className="space-y-1">
                                  {day.training.map(t => (
                                    <div key={t} className="text-foreground font-medium">• {t}</div>
                                  ))}
                                  <div className="text-xs text-muted-foreground mt-1 italic">{day.notes}</div>
                                </div>
                              </div>
                            ))}
                          </div>
                       </AccordionContent>
                     </AccordionItem>
                   </Accordion>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
