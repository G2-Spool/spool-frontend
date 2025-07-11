import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { QueryProvider } from './providers/QueryProvider';
import { Toaster } from 'react-hot-toast';
import { ErrorBoundary } from './components/organisms/ErrorBoundary';

// Pages (to be created)
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { SignUpPage } from './pages/SignUpPage';
import { VoiceInterviewPage } from './pages/VoiceInterviewPage';
import { StudentDashboard } from './pages/StudentDashboard';
import { LearningPathDetail } from './pages/LearningPathDetail';
import { ConceptPage } from './pages/ConceptPage';
import { ExercisePage } from './pages/ExercisePage';
import { ProfilePage } from './pages/ProfilePage';
import { CoursesPage } from './pages/CoursesPage';
import { ProgressPage } from './pages/ProgressPage';
import { ThreadPage } from './pages/ThreadPage';

// Layouts
import { AuthLayout } from './components/layouts/AuthLayout';
import { DashboardLayout } from './components/layouts/DashboardLayout';
import { ProtectedRoute } from './components/layouts/ProtectedRoute';

// Onboarding
import { OnboardingWizard } from './components/onboarding';

function App() {
  return (
    <ErrorBoundary>
      <QueryProvider>
        <AuthProvider>
          <Router>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<LandingPage />} />
              
              {/* Auth Routes */}
              <Route element={<AuthLayout />}>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignUpPage />} />
              </Route>

              {/* Protected Routes - Student */}
              <Route
                path="/onboarding"
                element={
                  <ProtectedRoute allowedRoles={['student']}>
                    <OnboardingWizard />
                  </ProtectedRoute>
                }
              />
              
              <Route
                element={
                  <ProtectedRoute allowedRoles={['student']}>
                    <DashboardLayout />
                  </ProtectedRoute>
                }
              >
                <Route path="/dashboard" element={<StudentDashboard />} />
                <Route path="/interview" element={<VoiceInterviewPage />} />
                <Route path="/courses" element={<CoursesPage />} />
                <Route path="/progress" element={<ProgressPage />} />
                <Route path="/learning-path/:id" element={<LearningPathDetail />} />
                <Route path="/learn/:conceptId" element={<ConceptPage />} />
                <Route path="/exercise/:exerciseId" element={<ExercisePage />} />
                <Route path="/thread/:threadId" element={<ThreadPage />} />
                <Route path="/profile" element={<ProfilePage />} />
              </Route>


              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Router>
          <Toaster 
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
              },
              success: {
                duration: 3000,
                iconTheme: {
                  primary: '#4ade80',
                  secondary: '#fff',
                },
              },
              error: {
                duration: 5000,
                iconTheme: {
                  primary: '#ef4444',
                  secondary: '#fff',
                },
              },
            }}
          />
        </AuthProvider>
      </QueryProvider>
    </ErrorBoundary>
  );
}

export default App;