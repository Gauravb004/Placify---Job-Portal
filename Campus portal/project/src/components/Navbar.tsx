import { Page } from '../types';

interface NavbarProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
  isStudent: boolean;
  isAdmin: boolean;
  onLogout: () => void;
}

export default function Navbar({
  currentPage,
  onNavigate,
  isStudent,
  isAdmin,
  onLogout,
}: NavbarProps) {
  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center space-x-8">
            <button
              onClick={() => onNavigate('home')}
              className="text-xl font-semibold text-gray-900"
            >
              PLACIFY
            </button>

            <div className="hidden md:flex space-x-6">
              <button
                onClick={() => onNavigate('home')}
                className={`${
                  currentPage === 'home'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-600 hover:text-gray-900'
                } px-3 py-2 text-sm font-medium transition-colors`}
              >
                Home
              </button>

              <button
                onClick={() => onNavigate('drives')}
                className={`${
                  currentPage === 'drives'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-600 hover:text-gray-900'
                } px-3 py-2 text-sm font-medium transition-colors`}
              >
                Campus Drives
              </button>

              {isStudent && (
                <button
                  onClick={() => onNavigate('student-dashboard')}
                  className={`${
                    currentPage === 'student-dashboard'
                      ? 'text-blue-600 border-b-2 border-blue-600'
                      : 'text-gray-600 hover:text-gray-900'
                  } px-3 py-2 text-sm font-medium transition-colors`}
                >
                  Student Dashboard
                </button>
              )}

              {isAdmin && (
                <>
                  <button
                    onClick={() => onNavigate('admin-dashboard')}
                    className={`${
                      currentPage === 'admin-dashboard'
                        ? 'text-blue-600 border-b-2 border-blue-600'
                        : 'text-gray-600 hover:text-gray-900'
                    } px-3 py-2 text-sm font-medium transition-colors`}
                  >
                    Admin Dashboard
                  </button>
                  <button
                    onClick={() => onNavigate('admin-resumes')}
                    className={`${
                      currentPage === 'admin-resumes'
                        ? 'text-blue-600 border-b-2 border-blue-600'
                        : 'text-gray-600 hover:text-gray-900'
                    } px-3 py-2 text-sm font-medium transition-colors`}
                  >
                    Resume Management
                  </button>
                </>
              )}
            </div>
          </div>

          <div className="flex items-center">
            {(isStudent || isAdmin) && (
              <button
                onClick={onLogout}
                className="text-sm text-gray-600 hover:text-gray-900 font-medium"
              >
                Logout
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
