import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';
import Layout from '@/components/layout/Layout';
import Dashboard from '@/pages/Dashboard';
import Habits from '@/pages/Habits';
import Fitness from '@/pages/Fitness';
import Prayer from '@/pages/Prayer';
import Scripture from '@/pages/Scripture';
import Journal from '@/pages/Journal';
import BattleMode from '@/pages/BattleMode';
import Accountability from '@/pages/Accountability';
import Analytics from '@/pages/Analytics';
import WeeklyReport from '@/pages/WeeklyReport';
import Goals from '@/pages/Goals';
import AccessGate from '@/pages/AccessGate';
import Account from '@/pages/Account';
import Privacy from '@/pages/Privacy';
import Subscribe from '@/pages/Subscribe';

const PageWrapper = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, x: 16 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: -16 }}
    transition={{ duration: 0.2, ease: "easeInOut" }}
  >
    {children}
  </motion.div>
);

const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings, authError, isAuthenticated, user } = useAuth();
  const location = useLocation();

  if (isLoadingPublicSettings || isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-4 border-muted border-t-gold rounded-full animate-spin"></div>
      </div>
    );
  }

  // Show AccessGate for unauthenticated users, UserNotRegisteredError for registered but not in app
  if (!isAuthenticated) {
    if (authError?.type === 'user_not_registered') {
      return <UserNotRegisteredError />;
    }
    return <AccessGate />;
  }

  if (authError && authError.type === 'user_not_registered') {
    return <UserNotRegisteredError />;
  }

  // Gate non-admin users without an active subscription
  if (user?.role !== 'admin' && user?.subscription_status !== 'active') {
    return <Subscribe />;
  }

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route element={<Layout />}>
          <Route path="/" element={<PageWrapper><Dashboard /></PageWrapper>} />
          <Route path="/habits" element={<PageWrapper><Habits /></PageWrapper>} />
          <Route path="/fitness" element={<PageWrapper><Fitness /></PageWrapper>} />
          <Route path="/prayer" element={<PageWrapper><Prayer /></PageWrapper>} />
          <Route path="/scripture" element={<PageWrapper><Scripture /></PageWrapper>} />
          <Route path="/journal" element={<PageWrapper><Journal /></PageWrapper>} />
          <Route path="/battle" element={<PageWrapper><BattleMode /></PageWrapper>} />
          <Route path="/accountability" element={<PageWrapper><Accountability /></PageWrapper>} />
          <Route path="/analytics" element={<PageWrapper><Analytics /></PageWrapper>} />
          <Route path="/weekly" element={<PageWrapper><WeeklyReport /></PageWrapper>} />
          <Route path="/goals" element={<PageWrapper><Goals /></PageWrapper>} />
          <Route path="/account" element={<PageWrapper><Account /></PageWrapper>} />
        </Route>
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/subscribe" element={<Subscribe />} />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </AnimatePresence>
  );
};


function App() {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router>
          <AuthenticatedApp />
        </Router>
        <Toaster />
      </QueryClientProvider>
    </AuthProvider>
  )
}

export default App