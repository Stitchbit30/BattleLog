import React from 'react';
import { useCampStore } from '@/lib/store';
import { format, parseISO } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ClipboardCopy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

export default function Journal() {
  const { logs, profile } = useCampStore();
  const { toast } = useToast();

  // Sort logs by date desc
  const sortedDates = Object.keys(logs).sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
  const journalEntries = sortedDates.filter(date => logs[date].journalEntry.trim().length > 0);

  const handleCopyJournal = (date: string, text: string) => {
    navigator.clipboard.writeText(`Journal - ${date}:\n${text}`);
    toast({
      title: "Copied to clipboard",
      description: "Journal entry ready to share.",
    });
  };

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-heading font-bold">Training Log</h1>
        <span className="text-sm text-muted-foreground">{journalEntries.length} Entries</span>
      </div>

      <ScrollArea className="h-[calc(100vh-12rem)] pr-4">
        <div className="space-y-4">
          {journalEntries.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground">
              <p>No journal entries yet.</p>
              <p className="text-sm mt-2">Write in your daily dashboard to see logs here.</p>
            </div>
          ) : (
            journalEntries.map(date => {
              const log = logs[date];
              return (
                <Card key={date} className="bg-card/50 border-border/60">
                  <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
                    <div className="space-y-1">
                      <CardTitle className="text-base font-heading tracking-wide">
                        {format(parseISO(date), 'EEEE, MMMM do')}
                      </CardTitle>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8"
                      onClick={() => handleCopyJournal(date, log.journalEntry)}
                    >
                      <ClipboardCopy className="w-4 h-4" />
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm whitespace-pre-wrap text-muted-foreground leading-relaxed">
                      {log.journalEntry}
                    </p>
                    {log.completedItems.length > 0 && (
                      <div className="mt-4 pt-4 border-t border-border/50">
                        <p className="text-xs font-bold uppercase text-primary mb-1">Completed</p>
                        <div className="flex flex-wrap gap-2">
                          {log.completedItems.length} items checked
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )
            })
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
