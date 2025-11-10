import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ProtectedRoute } from './components/ProtectedRoute'
import { Login } from './pages/Login'
import { Reports } from './pages/Reports'
import { Mutes } from './pages/Mutes'
import { AILogs } from './pages/AILogs'
import { Telemetry } from './pages/Telemetry'
import { Ops } from './pages/Ops'
import { Layout } from './components/Layout'
import { useSupabaseAuth } from './hooks/useSupabaseAuth'

function App() {
  const { isAuthenticated, loading } = useSupabaseAuth()

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={isAuthenticated ? <Navigate to="/" replace /> : <Login />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/reports" replace />} />
          <Route path="reports" element={<Reports />} />
          <Route path="mutes" element={<Mutes />} />
          <Route path="ai-logs" element={<AILogs />} />
          <Route path="telemetry" element={<Telemetry />} />
          <Route path="ops" element={<Ops />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App

