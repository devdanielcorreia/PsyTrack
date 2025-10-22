import { Navigate, Route, Routes } from 'react-router-dom'

import AdminLayout from '@/layouts/AdminLayout.tsx'
import Dashboard from '@/pages/admin/Dashboard.tsx'
import Traits from '@/pages/admin/Traits.tsx'
import Quizzes from '@/pages/admin/Quizzes.tsx'
import Assessments from '@/pages/admin/Assessments.tsx'
import { useAuth } from '@/context/AuthContext.tsx'
import Login from '@/pages/auth/Login.tsx'

export default function App() {
  const { user, loading } = useAuth()

  if (loading) {
    return <p>Carregando...</p>
  }

  if (!user) {
    return <Login />
  }

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/admin" replace />} />
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="traits" element={<Traits />} />
        <Route path="quizzes" element={<Quizzes />} />
        <Route path="assessments" element={<Assessments />} />
      </Route>
      <Route path="*" element={<Navigate to="/admin" replace />} />
    </Routes>
  )
}
