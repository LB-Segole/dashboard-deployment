import React, { Suspense } from 'react';
import { ToastProvider } from '@/components/ui/Toaster';
import { BrowserRouter as Router, Routes, Route
  , Navigate } from 'react-router-dom';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { Spinner } from '@/components/ui/Spinner';

// Lazy load layouts and pages
const DashboardLayout = React.lazy(() => import('@/layouts/DashboardLayout'));
const AuthLayout = React.lazy(() => import('@/layouts/AuthLayout'));

// Lazy load pages
const DashboardPage = React.lazy(() => import('@/pages/DashboardPage'));
const UsersPage = React.lazy(() => import('@/pages/UsersPage'));
const UserDetailsPage = React.lazy(() => import('@/pages/users/UserDetails'));
const AgentsPage = React.lazy(() => import('@/pages/AgentsPage'));
const CallsPage = React.lazy(() => import('@/pages/CallsPage'));
const CallDetailsPage = React.lazy(() => import('@/pages/calls/CallDetails'));
const AnalyticsPage = React.lazy(() => import('@/pages/AnalyticsPage'));
const SettingsPage = React.lazy(() => import('@/pages/SettingsPage'));
const LoginPage = React.lazy(() => import('@/pages/LoginPage'));
const UnauthorizedPage = React.lazy(() => import('@/pages/UnauthorizedPage'));
const NotFoundPage = React.lazy(() => import('@/pages/NotFoundPage'));

// Loading fallback component
const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center">
    <Spinner size="lg" />
  </div>
);

// Protected Route wrapper
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, loading } = useAdminAuth();

  if (loading) {
    return <LoadingFallback />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default function App() {
  return (
    <ErrorBoundary>
      <ToastProvider>
        <Router>
          <Suspense fallback={<LoadingFallback />}>
            <Routes>
              {/* Public routes */}
              <Route element={<AuthLayout />}>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/unauthorized" element={<UnauthorizedPage />} />
              </Route>

              {/* Protected routes */}
              <Route
                element={
                  <ProtectedRoute>
                    <DashboardLayout />
                  </ProtectedRoute>
                }
              >
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/users" element={<UsersPage />} />
                <Route path="/users/:id" element={<UserDetailsPage />} />
                <Route path="/agents" element={<AgentsPage />} />
                <Route path="/calls" element={<CallsPage />} />
                <Route path="/calls/:id" element={<CallDetailsPage />} />
                <Route path="/analytics" element={<AnalyticsPage />} />
                <Route path="/settings" element={<SettingsPage />} />
              </Route>

              {/* Catch all route */}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Suspense>
        </Router>
      </ToastProvider>
    </ErrorBoundary>
  );
}