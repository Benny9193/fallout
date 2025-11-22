import { Suspense, lazy } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Navigation, ErrorBoundary, Loading } from './components'
import { ROUTES } from './constants/routes'
import './App.css'

// Lazy load route components for code splitting
const Home = lazy(() => import('./pages/Home'))
const About = lazy(() => import('./pages/About'))
const Dashboard = lazy(() => import('./pages/Dashboard'))
const Profile = lazy(() => import('./pages/Profile'))
const Settings = lazy(() => import('./pages/Settings'))
const Posts = lazy(() => import('./pages/Posts'))
const InfinitePosts = lazy(() => import('./pages/InfinitePosts'))
const NotFound = lazy(() => import('./pages/NotFound'))

function App() {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <div className="app">
          <Navigation />
          <main className="app-main" id="main-content" tabIndex={-1}>
            <Suspense fallback={<Loading message="Loading page..." fullScreen />}>
              <Routes>
                <Route path={ROUTES.HOME} element={<Home />} />
                <Route path={ROUTES.DASHBOARD} element={<Dashboard />} />
                <Route path={ROUTES.POSTS} element={<Posts />} />
                <Route path={ROUTES.POSTS_INFINITE} element={<InfinitePosts />} />
                <Route path={ROUTES.PROFILE} element={<Profile />} />
                <Route path={ROUTES.SETTINGS} element={<Settings />} />
                <Route path={ROUTES.ABOUT} element={<About />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </main>
        </div>
      </ErrorBoundary>
    </BrowserRouter>
  )
}

export default App
