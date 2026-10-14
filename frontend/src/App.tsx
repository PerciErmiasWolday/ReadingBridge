import { lazy, Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { AppShell } from './components/AppShell'
import { ReaderLayout } from './components/ReaderLayout'
import { AddReadingPage } from './pages/AddReadingPage'
import { LibraryPage } from './pages/LibraryPage'
import { MyReadingPage } from './pages/MyReadingPage'
import { NotFoundPage } from './pages/NotFoundPage'
import { ProgressPage } from './pages/ProgressPage'
import { ReaderPage } from './pages/ReaderPage'
import { SettingsPage } from './pages/SettingsPage'

// Development only: the styleguide is excluded from production builds.
const StyleguidePage = import.meta.env.DEV ? lazy(() => import('./pages/StyleguidePage')) : null

export function App() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route index element={<Navigate to="/library" replace />} />
        <Route path="library" element={<LibraryPage />} />
        <Route path="add-reading" element={<AddReadingPage />} />
        <Route path="my-reading" element={<MyReadingPage />} />
        <Route path="progress" element={<ProgressPage />} />
        <Route path="settings" element={<SettingsPage />} />
        {StyleguidePage && (
          <Route
            path="styleguide"
            element={
              <Suspense fallback={null}>
                <StyleguidePage />
              </Suspense>
            }
          />
        )}
        <Route path="*" element={<NotFoundPage />} />
      </Route>
      <Route element={<ReaderLayout />}>
        <Route path="read/:storyId" element={<ReaderPage />} />
      </Route>
    </Routes>
  )
}
