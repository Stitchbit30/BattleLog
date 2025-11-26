import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCampStore } from '@/lib/store';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Dumbbell } from 'lucide-react';
import generatedHero from '@assets/generated_images/subtle_dark_geometric_texture_for_athletic_app_background.png';

const profileSchema = z.object({
  name: z.string().min(2, "Name is required"),
  weight: z.string().min(1, "Weight is required"),
  height: z.string().min(1, "Height is required"),
  belt: z.string().min(1, "Belt rank is required"),
  startDate: z.string().refine((date) => !isNaN(Date.parse(date)), "Invalid date"),
  competitionDate: z.string().refine((date) => !isNaN(Date.parse(date)), "Invalid date"),
});

export default function Onboarding() {
  const { setProfile } = useCampStore();
  const [, setLocation] = useLocation();

  const form = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: "",
      weight: "",
      height: "",
      belt: "White",
      startDate: new Date().toISOString().split('T')[0],
      competitionDate: new Date(Date.now() + 12 * 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    },
  });

  function onSubmit(values: z.infer<typeof profileSchema>) {
    setProfile(values);
    setLocation('/');
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 z-0 opacity-10 pointer-events-none" style={{ backgroundImage: `url(${generatedHero})`, backgroundSize: 'cover' }}></div>
      
      <Card className="w-full max-w-md z-10 border-primary/10 shadow-2xl backdrop-blur-sm bg-card/95">
        <CardHeader className="text-center space-y-4 pb-2">
          <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-2">
            <Dumbbell className="w-8 h-8 text-primary" />
          </div>
          <CardTitle className="text-3xl font-heading uppercase tracking-wide text-primary">Camp Tracker</CardTitle>
          <CardDescription>
            Initialize your 12-week BJJ competition camp. 
            Track training, nutrition, and recovery.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Athlete Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John Danaher" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="weight"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Current Weight (kg/lbs)</FormLabel>
                      <FormControl>
                        <Input placeholder="85kg" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="height"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Height</FormLabel>
                      <FormControl>
                        <Input placeholder="180cm" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="belt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Belt Rank</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select belt" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="White">White</SelectItem>
                        <SelectItem value="Blue">Blue</SelectItem>
                        <SelectItem value="Purple">Purple</SelectItem>
                        <SelectItem value="Brown">Brown</SelectItem>
                        <SelectItem value="Black">Black</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="startDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Camp Start</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="competitionDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Competition</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Button type="submit" className="w-full text-lg font-heading uppercase tracking-wider mt-4" size="lg">
                Start Camp
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
