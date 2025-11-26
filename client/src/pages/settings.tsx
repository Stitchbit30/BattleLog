import React from 'react';
import { useForm } from 'react-hook-form';
import { useCampStore } from '@/lib/store';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';

export default function Settings() {
  const { profile, setProfile, resetData } = useCampStore();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [isDarkMode, setIsDarkMode] = React.useState(false);

  React.useEffect(() => {
    if (document.documentElement.classList.contains('dark')) {
      setIsDarkMode(true);
    }
  }, []);

  const toggleTheme = (checked: boolean) => {
    setIsDarkMode(checked);
    if (checked) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const handleReset = () => {
    if (confirm("Are you sure you want to delete all progress? This cannot be undone.")) {
      resetData();
      setLocation('/');
    }
  };

  if (!profile) return null;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <h1 className="text-3xl font-heading font-bold">Profile & Settings</h1>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Athlete Profile</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <Label>Name</Label>
            <Input value={profile.name} disabled className="bg-muted" />
          </div>
          <div className="grid grid-cols-2 gap-4">
             <div className="grid gap-2">
              <Label>Belt</Label>
              <Input value={profile.belt} disabled className="bg-muted" />
            </div>
            <div className="grid gap-2">
              <Label>Weight</Label>
              <Input value={profile.weight} disabled className="bg-muted" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Preferences</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Dark Mode</Label>
              <p className="text-xs text-muted-foreground">Switch to dark theme</p>
            </div>
            <Switch checked={isDarkMode} onCheckedChange={toggleTheme} />
          </div>
          
          <div className="pt-4 border-t border-border">
            <Button variant="destructive" className="w-full" onClick={handleReset}>
              Reset All Data
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
