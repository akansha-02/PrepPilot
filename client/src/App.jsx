import { Navigate, Route, Routes } from 'react-router-dom';
import AppShell from './components/layout/AppShell';
import LandingPage from './pages/LandingPage';
import DashboardPage from './pages/DashboardPage';
import NewSessionPage from './pages/NewSessionPage';
import InterviewPage from './pages/InterviewPage';
import HistoryPage from './pages/HistoryPage';
import NotFoundPage from './pages/NotFoundPage';

export default function App() {
  return (
    <AppShell>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/interview/new" element={<NewSessionPage />} />
        <Route path="/interview/:sessionId" element={<InterviewPage />} />
        <Route path="/history" element={<HistoryPage />} />
        <Route path="/start" element={<Navigate to="/interview/new" replace />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </AppShell>
  );
}