import { Switch, Route } from "wouter";
import { CampProvider, useCampStore } from "@/lib/store";
import Layout from "@/components/layout";
import Dashboard from "@/pages/dashboard";
import Onboarding from "@/pages/onboarding";
import Journal from "@/pages/journal";
import Progress from "@/pages/progress";
import Program from "@/pages/program";
import Settings from "@/pages/settings";
import WeekView from "@/pages/week-view";
import NotFound from "@/pages/not-found";

// Wrapper to handle auth redirect logic within context
function AppContent() {
  const { profile } = useCampStore();

  // If no profile, force onboarding unless we are already there
  // This is a simple client-side protection
  const isProfileSet = !!profile;

  return (
    <Layout>
      <Switch>
        <Route path="/">
          {isProfileSet ? <Dashboard /> : <Onboarding />}
        </Route>
        <Route path="/week" component={isProfileSet ? WeekView : Onboarding} />
        <Route path="/journal" component={isProfileSet ? Journal : Onboarding} />
        <Route path="/progress" component={isProfileSet ? Progress : Onboarding} />
        <Route path="/program" component={isProfileSet ? Program : Onboarding} />
        <Route path="/settings" component={isProfileSet ? Settings : Onboarding} />
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function App() {
  return (
    <CampProvider>
      <AppContent />
    </CampProvider>
  );
}

export default App;
