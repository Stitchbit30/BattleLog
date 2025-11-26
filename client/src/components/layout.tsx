import React from 'react';
import { Link, useLocation } from 'wouter';
import { Home, NotebookPen, Activity, BookOpen, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Toaster } from '@/components/ui/toaster';
import { useCampStore } from '@/lib/store';

export default function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const { profile } = useCampStore();

  // If no profile, we are likely on onboarding, hide nav? 
  // Or strictly show nav only if profile exists.
  const showNav = !!profile;

  const navItems = [
    { icon: Home, label: 'Today', href: '/' },
    { icon: NotebookPen, label: 'Journal', href: '/journal' },
    { icon: Activity, label: 'Stats', href: '/stats' },
    { icon: BookOpen, label: 'Program', href: '/program' },
    { icon: User, label: 'Profile', href: '/settings' },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground font-sans pb-20 md:pb-0 relative overflow-x-hidden">
      {/* Mobile Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 md:hidden">
        <div className="flex h-14 items-center px-4">
          <h1 className="font-heading text-xl font-bold tracking-tighter text-primary">CAMP TRACKER</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto max-w-md md:max-w-2xl min-h-[calc(100vh-3.5rem)] p-4 md:pt-8">
        {children}
      </main>

      {/* Bottom Navigation - Mobile First */}
      {showNav && (
        <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-background/95 backdrop-blur pb-safe pt-2 md:hidden">
          <div className="grid grid-cols-5 items-center justify-items-center px-2">
            {navItems.map((item) => {
              const isActive = location === item.href;
              return (
                <Link key={item.href} href={item.href}>
                  <a className={cn(
                    "flex flex-col items-center justify-center gap-1 py-2 w-full transition-colors",
                    isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
                  )}>
                    <item.icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                    <span className="text-[10px] font-medium">{item.label}</span>
                  </a>
                </Link>
              );
            })}
          </div>
        </nav>
      )}

      {/* Desktop Sidebar (Hidden on Mobile) */}
      {showNav && (
        <div className="hidden md:flex fixed top-0 left-0 h-screen w-64 border-r border-border bg-card p-6 flex-col">
          <div className="mb-8">
            <h1 className="font-heading text-2xl font-bold text-primary tracking-tighter">BJJ CAMP<br/>TRACKER</h1>
          </div>
          <nav className="space-y-2 flex-1">
            {navItems.map((item) => {
              const isActive = location === item.href;
              return (
                <Link key={item.href} href={item.href}>
                  <a className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-lg transition-all",
                    isActive 
                      ? "bg-primary/10 text-primary font-semibold translate-x-1" 
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}>
                    <item.icon size={20} />
                    <span>{item.label}</span>
                  </a>
                </Link>
              );
            })}
          </nav>
          <div className="mt-auto pt-6 border-t border-border">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-heading font-bold">
                {profile?.name.charAt(0)}
              </div>
              <div>
                <p className="text-sm font-medium">{profile?.name}</p>
                <p className="text-xs text-muted-foreground">{profile?.belt} Belt</p>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <Toaster />
    </div>
  );
}
