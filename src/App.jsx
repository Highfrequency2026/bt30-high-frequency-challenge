import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';
import ScrollToTop from './components/ScrollToTop';
// Add page imports here
import AppLayout from '@/components/layout/AppLayout';
import Home from './pages/Home';
import Landing from './pages/Landing';
import Membership from './pages/Membership';
import ThankYou from './pages/ThankYou';
import Join from './pages/Join';
import MembershipPlans from './pages/MembershipPlans';
import MemberRegister from './pages/MemberRegister';
import MemberProfileSetup from './pages/MemberProfileSetup';
import MembershipAgreements from './pages/MembershipAgreements';
import MemberPhoto from './pages/MemberPhoto';
import Checkout from './pages/Checkout';
import MembershipActivated from './pages/MembershipActivated';
import MemberDashboard from './pages/MemberDashboard';
import StaffCheckIn from './pages/StaffCheckIn';
import AdminMembershipDashboard from './pages/AdminMembershipDashboard';
import Programs from './pages/Programs';
import ProgramDetail from './pages/ProgramDetail';
import WorkoutDetail from './pages/WorkoutDetail';
import Nutrition from './pages/Nutrition';
import Mindset from './pages/Mindset';
import Progress from './pages/Progress';
import Coaches from './pages/Coaches';
import Store from './pages/Store';
import Community from './pages/Community';
import Podcast from './pages/Podcast';
import LiveTraining from './pages/LiveTraining';
import Events from './pages/Events';

const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings, authError, navigateToLogin } = useAuth();

  // Show loading spinner while checking app public settings or auth
  if (isLoadingPublicSettings || isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
      </div>
    );
  }

  // Handle authentication errors
  if (authError) {
    if (authError.type === 'user_not_registered') {
      return <UserNotRegisteredError />;
    } else if (authError.type === 'auth_required') {
      // Redirect to login automatically
      navigateToLogin();
      return null;
    }
  }

  // Render the main app
  return (
    <Routes>
      {/* Add your page Route elements here */}
      <Route element={<AppLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/landing" element={<Landing />} />
        <Route path="/membership" element={<Membership />} />
        <Route path="/ThankYou" element={<ThankYou />} />
        <Route path="/join" element={<Join />} />
        <Route path="/plans" element={<MembershipPlans />} />
        <Route path="/member-signup" element={<MemberRegister />} />
        <Route path="/profile-setup" element={<MemberProfileSetup />} />
        <Route path="/agreements" element={<MembershipAgreements />} />
        <Route path="/member-photo" element={<MemberPhoto />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/activated" element={<MembershipActivated />} />
        <Route path="/dashboard" element={<MemberDashboard />} />
        <Route path="/staff-checkin" element={<StaffCheckIn />} />
        <Route path="/admin" element={<AdminMembershipDashboard />} />
        <Route path="/programs" element={<Programs />} />
        <Route path="/programs/:programId" element={<ProgramDetail />} />
        <Route path="/workout/:day" element={<WorkoutDetail />} />
        <Route path="/nutrition" element={<Nutrition />} />
        <Route path="/mindset" element={<Mindset />} />
        <Route path="/progress" element={<Progress />} />
        <Route path="/community" element={<Community />} />
        <Route path="/podcast" element={<Podcast />} />
        <Route path="/live" element={<LiveTraining />} />
        <Route path="/events" element={<Events />} />
        <Route path="/coaches" element={<Coaches />} />
        <Route path="/store" element={<Store />} />
      </Route>
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};


function App() {

  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router>
          <ScrollToTop />
          <AuthenticatedApp />
        </Router>
        <Toaster />
      </QueryClientProvider>
    </AuthProvider>
  )
}

export default App