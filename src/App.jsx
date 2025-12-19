import React, { createContext, useState, useContext, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import OnboardingSurvey from './components/Player/OnboardingSurvey';
import PlayerDashboard from './components/Player/PlayerDashboard';
import PlayerProfile from './components/Player/PlayerProfile';
import CourseList from './components/Courses/CourseList';
import CourseDetail from './components/Courses/CourseDetail';
import VideoList from './components/Videos/VideoList';
import VideoDetail from './components/Videos/VideoDetail';
import VideoUpload from './components/Videos/VideoUpload';
import TrainingPlan from './components/Training/TrainingPlan';
import AdminPanel from './components/Admin/AdminPanel';
import Navigation from './components/Shared/Navigation';
import api from './utils/api';

const ThemeContext = createContext();
const AuthContext = createContext();

export const useTheme = () => useContext(ThemeContext);
export const useAuth = () => useContext(AuthContext);

function App() {
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : false;
  });

  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('currentUser');
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('currentUser', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('currentUser');
    }
  }, [currentUser]);

  const toggleDarkMode = () => setDarkMode(!darkMode);

  const login = (user) => setCurrentUser(user);
  const logout = () => {
    setCurrentUser(null);
    api.logout();
  };

  // Check if player needs onboarding
  const needsOnboarding = currentUser?.user_type === 'player' && currentUser?.onboarding_completed === false;

  return (
    <ThemeContext.Provider value={{ darkMode, toggleDarkMode }}>
      <AuthContext.Provider value={{ currentUser, login, logout }}>
        <Router>
          <div className="min-h-screen">
            {currentUser && <Navigation />}
            <Routes>
              <Route path="/login" element={!currentUser ? <Login /> : (needsOnboarding ? <Navigate to="/onboarding" /> : <Navigate to="/" />)} />
              <Route path="/register" element={!currentUser ? <Register /> : (needsOnboarding ? <Navigate to="/onboarding" /> : <Navigate to="/" />)} />

              <Route path="/onboarding" element={currentUser && needsOnboarding ? <OnboardingSurvey /> : <Navigate to="/" />} />

              <Route path="/" element={currentUser ? (needsOnboarding ? <Navigate to="/onboarding" /> : <PlayerDashboard />) : <Navigate to="/login" />} />
              <Route path="/profile" element={currentUser ? <PlayerProfile /> : <Navigate to="/login" />} />
              <Route path="/courses" element={currentUser ? <CourseList /> : <Navigate to="/login" />} />
              <Route path="/courses/:id" element={currentUser ? <CourseDetail /> : <Navigate to="/login" />} />
              <Route path="/videos" element={currentUser ? <VideoList /> : <Navigate to="/login" />} />
              <Route path="/videos/:id" element={currentUser ? <VideoDetail /> : <Navigate to="/login" />} />
              <Route path="/videos/upload" element={currentUser ? <VideoUpload /> : <Navigate to="/login" />} />
              <Route path="/training" element={currentUser ? <TrainingPlan /> : <Navigate to="/login" />} />
              <Route path="/admin" element={currentUser?.user_type === 'admin' ? <AdminPanel /> : <Navigate to="/" />} />
            </Routes>
          </div>
        </Router>
      </AuthContext.Provider>
    </ThemeContext.Provider>
  );
}

export default App;
