import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { HomePage } from './pages/HomePage'
import { AdminPage } from './pages/AdminPage'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/react'
import { AuthProvider } from './contexts/AuthContext'
import { useAnalytics } from './hooks/useAnalytics'

function AppRoutes() {
  useAnalytics() // Track page views
  
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/admin" element={<AdminPage />} />
    </Routes>
  )
}

function App() {
  return (
    <>
      <AuthProvider>
        <Router>
          <AppRoutes />
        </Router>
      </AuthProvider>
      <Analytics />
      <SpeedInsights />
    </>
  )
}

export default App
