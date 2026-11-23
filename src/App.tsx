import { lazy, Suspense } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router'
import { Ocean } from './components/Ocean'
import { useBubblePuffs } from './lib/useBubblePuffs'
import { InvitationPage } from './pages/InvitationPage'

// Luana never needs the admin code, so it is loaded only on /admin.
const AdminPage = lazy(() => import('./pages/AdminPage'))

export default function App() {
  useBubblePuffs()
  return (
    <BrowserRouter>
      <Ocean />
      <Routes>
        <Route path="/" element={<InvitationPage />} />
        <Route
          path="/admin"
          element={
            <Suspense fallback={null}>
              <AdminPage />
            </Suspense>
          }
        />
        <Route path="*" element={<InvitationPage />} />
      </Routes>
    </BrowserRouter>
  )
}
