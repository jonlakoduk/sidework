// ── SIDEWORK APP ROUTER ───────────────────────────────────────────────
// All routes live here. Adding a new page = add one line.
// The _redirects file in /public ensures Cloudflare Pages
// sends all URLs to index.html for client-side routing.
// ─────────────────────────────────────────────────────────────────────
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ROUTES } from './constants'

// Pages — lazy loaded so each route only loads what it needs
import { lazy, Suspense } from 'react'
const Home      = lazy(() => import('./pages/Home'))
const Auth      = lazy(() => import('./pages/Auth'))
const Evaluator = lazy(() => import('./pages/Evaluator'))
const Profile   = lazy(() => import('./pages/Profile'))
const Browse    = lazy(() => import('./pages/Browse'))
const Dashboard = lazy(() => import('./pages/Dashboard'))
const Messages  = lazy(() => import('./pages/Messages'))
const Employer  = lazy(() => import('./pages/Employer'))
const Pricing   = lazy(() => import('./pages/Pricing'))

// Simple full-screen loader shown between route transitions
function PageLoader() {
  return (
    <div style={{
      height: '100vh', display: 'flex', alignItems: 'center',
      justifyContent: 'center', background: '#0F1923',
      fontFamily: 'DM Mono, monospace', fontSize: '0.65rem',
      color: '#8A9BB0', letterSpacing: '0.15em',
    }}>
      LOADING...
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* Public */}
          <Route path={ROUTES.home}      element={<Home />} />
          <Route path={ROUTES.auth}      element={<Auth />} />
          <Route path={ROUTES.evaluator} element={<Evaluator />} />
          <Route path={ROUTES.pricing}   element={<Pricing />} />

          {/* Candidate */}
          <Route path={ROUTES.profile}   element={<Profile />} />
          <Route path={ROUTES.browse}    element={<Browse />} />
          <Route path={ROUTES.dashboard} element={<Dashboard />} />
          <Route path={ROUTES.messages}  element={<Messages />} />

          {/* Employer */}
          <Route path={ROUTES.employer}  element={<Employer />} />

          {/* Catch-all → home */}
          <Route path="*" element={<Navigate to={ROUTES.home} replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}
