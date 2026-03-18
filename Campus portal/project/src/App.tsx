import { useState, useEffect } from 'react';
import { Page } from './types';
import { initializeStorage, updateDriveStatuses } from './utils/storage';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import StudentLogin from './pages/StudentLogin';
import AdminLogin from './pages/AdminLogin';
import CampusDrives from './pages/CampusDrives';
import DriveDetails from './pages/DriveDetails';
import StudentDashboard from './pages/StudentDashboard';
import AdminDashboard from './pages/AdminDashboard';
import AdminResumes from './pages/AdminResumes';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [selectedDriveId, setSelectedDriveId] = useState<string>('');
  const [isStudent, setIsStudent] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    initializeStorage();
    updateDriveStatuses();
  }, []);

  const handleNavigation = (page: Page, driveId?: string) => {
    setCurrentPage(page);
    if (driveId) {
      setSelectedDriveId(driveId);
    }
  };

  const handleStudentLogin = () => {
    setIsStudent(true);
    setIsAdmin(false);
  };

  const handleAdminLogin = () => {
    setIsAdmin(true);
    setIsStudent(false);
  };

  const handleLogout = () => {
    setIsStudent(false);
    setIsAdmin(false);
    setCurrentPage('home');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {currentPage !== 'student-login' && currentPage !== 'admin-login' && (
        <Navbar
          currentPage={currentPage}
          onNavigate={handleNavigation}
          isStudent={isStudent}
          isAdmin={isAdmin}
          onLogout={handleLogout}
        />
      )}

      {currentPage === 'home' && <HomePage onNavigate={handleNavigation} />}

      {currentPage === 'student-login' && (
        <StudentLogin onNavigate={handleNavigation} onLogin={handleStudentLogin} />
      )}

      {currentPage === 'admin-login' && (
        <AdminLogin onNavigate={handleNavigation} onLogin={handleAdminLogin} />
      )}

      {currentPage === 'drives' && <CampusDrives onNavigate={handleNavigation} />}

      {currentPage === 'drive-details' && (
        <DriveDetails driveId={selectedDriveId} onNavigate={handleNavigation} />
      )}

      {currentPage === 'student-dashboard' && isStudent && (
        <StudentDashboard onNavigate={handleNavigation} />
      )}

      {currentPage === 'admin-dashboard' && isAdmin && <AdminDashboard />}

      {currentPage === 'admin-resumes' && isAdmin && <AdminResumes />}
    </div>
  );
}

export default App;
