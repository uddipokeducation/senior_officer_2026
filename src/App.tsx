import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import RegistrationPage from './pages/RegistrationPage'
import ExamPage from './pages/ExamPage'
import ResultPage from './pages/ResultPage'
import AdminLogin from './pages/AdminLogin'
import AdminDashboard from './pages/AdminDashboard'
import { ProtectedAdminRoute } from './components/ProtectedAdminRoute'

export default function App() {
  return (
    <BrowserRouter basename="/senior_officer_2026">
      <Routes>
        <Route path="/" element={<RegistrationPage />} />
        <Route path="/exam/:attemptId" element={<ExamPage />} />
        <Route path="/result/:attemptId" element={<ResultPage />} />
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={
          <ProtectedAdminRoute>
            <AdminDashboard />
          </ProtectedAdminRoute>
        } />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
