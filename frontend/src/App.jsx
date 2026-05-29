import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';

import HomePage from './pages/HomePage';
import MapPage from './pages/MapPage';
import IssueDetailPage from './pages/IssueDetailPage';
import Login from './pages/Login';
import Register from './pages/Register';
import DashboardPage from './pages/DashboardPage';
import NewIssuePage from './pages/NewIssuePage';
import EditIssuePage from './pages/EditIssuePage';
import NotFoundPage from './pages/NotFoundPage';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminIssuesPage from './pages/admin/AdminIssuesPage';
import AdminIssueDetailPage from './pages/admin/AdminIssueDetailPage';
import AdminStatisticsPage from './pages/admin/AdminStatisticsPage';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <NotificationProvider>
          <Layout>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/map" element={<MapPage />} />
              <Route path="/issues/:id" element={<IssueDetailPage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <DashboardPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/issues/new"
                element={
                  <ProtectedRoute>
                    <NewIssuePage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/issues/:id/edit"
                element={
                  <ProtectedRoute>
                    <EditIssuePage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin"
                element={
                  <AdminRoute>
                    <AdminDashboardPage />
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/issues"
                element={
                  <AdminRoute>
                    <AdminIssuesPage />
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/issues/:id"
                element={
                  <AdminRoute>
                    <AdminIssueDetailPage />
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/statistics"
                element={
                  <AdminRoute>
                    <AdminStatisticsPage />
                  </AdminRoute>
                }
              />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Layout>
        </NotificationProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
