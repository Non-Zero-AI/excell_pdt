import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './hooks/useAuth'
import Header from './components/Header'
import Footer from './components/Footer'

// Pages
import Home from './pages/index'
import Login from './pages/login'
import Register from './pages/register'
import Dashboard from './pages/dashboard'
import Courses from './pages/courses'
import CourseDetail from './pages/course/[id]'
import ChapterViewer from './pages/course/chapter/[chapterId]'
import Certification from './pages/certification'

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900 transition-colors">
          <Header />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/courses" element={<Courses />} />
              <Route path="/course/:id" element={<CourseDetail />} />
              <Route path="/course/:courseId/chapter/:chapterId" element={<ChapterViewer />} />
              <Route path="/certification" element={<Certification />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  )
}

export default App

