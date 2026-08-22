import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastProvider } from './context/ToastContext';
import { ModalProvider } from './context/ModalContext';
import { RootLayout } from './layouts/RootLayout';
import { CitizenLayout } from './layouts/CitizenLayout';
import { AuthorityLayout } from './layouts/AuthorityLayout';
import { AdminLayout } from './layouts/AdminLayout';

// Public Pages
import { LandingPage } from './pages/public/LandingPage';
import { ExplorePage } from './pages/public/ExplorePage';
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';

// Citizen Pages
import { Dashboard as CitizenDashboard } from './pages/citizen/Dashboard';
import { ReportIssue } from './pages/citizen/ReportIssue';
import { MyReports } from './pages/citizen/MyReports';
import { MapPage } from './pages/citizen/MapPage';
import { Feed } from './pages/citizen/Feed';
import { Profile } from './pages/citizen/Profile';
import { Saved } from './pages/citizen/Saved';
import { Settings } from './pages/citizen/Settings';
// Authority Pages
import { Dashboard as AuthorityDashboard } from './pages/authority/Dashboard';
import { IssueManagement } from './pages/authority/IssueManagement';
import { Intelligence } from './pages/authority/Intelligence';
import { Analytics as AuthorityAnalytics } from './pages/authority/Analytics';

// Admin Pages
import { UserManagement } from './pages/admin/UserManagement';

// Reusable Placeholder component for unbuilt pages
function Placeholder({ title }: { title: string }) {
  return (
    <div className="p-6 bg-white rounded-lg shadow-sm border border-slate-200">
      <h2 className="text-lg font-medium text-slate-900">{title}</h2>
      <p className="mt-1 text-sm text-slate-500">This feature is under construction.</p>
    </div>
  );
}

function App() {
  return (
    <ToastProvider>
      <ModalProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<RootLayout />}>
              <Route index element={<Navigate to="/login" replace />} />
              <Route path="login" element={<LoginPage />} />
              <Route path="register" element={<RegisterPage />} />
            </Route>
            
            {/* Citizen Routes */}
            <Route path="/citizen" element={<CitizenLayout />}>
              <Route path="dashboard" element={<CitizenDashboard />} />
              <Route path="feed" element={<Feed />} />
              <Route path="report" element={<ReportIssue />} />
              <Route path="reports" element={<MyReports />} />
              <Route path="saved" element={<Saved />} />
              <Route path="settings" element={<Settings />} />
              <Route path="profile" element={<Profile />} />
            </Route>

            {/* Authority Routes */}
            <Route path="/authority" element={<AuthorityLayout />}>
              <Route path="dashboard" element={<AuthorityDashboard />} />
              <Route path="issues" element={<IssueManagement />} />
              <Route path="map" element={<Placeholder title="Authority Map" />} />
              <Route path="intelligence" element={<Intelligence />} />
              <Route path="analytics" element={<AuthorityAnalytics />} />
              <Route path="notifications" element={<Placeholder title="Notifications" />} />
              <Route path="profile" element={<Placeholder title="Authority Profile" />} />
            </Route>

            {/* Admin Routes */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route path="dashboard" element={<Placeholder title="Admin Dashboard" />} />
              <Route path="users" element={<UserManagement />} />
              <Route path="settings" element={<Placeholder title="System Settings" />} />
              <Route path="logs" element={<Placeholder title="Audit Logs" />} />
              <Route path="database" element={<Placeholder title="Database Status" />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </ModalProvider>
    </ToastProvider>
  );
}

export default App;
