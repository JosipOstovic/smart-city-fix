import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import NotificationBell from './NotificationBell';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/');
    setMobileMenuOpen(false);
  };

  const closeMenu = () => setMobileMenuOpen(false);

  return (
    <nav className="bg-primary text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 text-xl font-bold tracking-tight">
            <span
              role="img"
              aria-label="SmartCityFix"
              className="block h-9 w-9 rounded-md bg-white bg-no-repeat"
              style={{
                backgroundImage: "url('/logo.jpg')",
                backgroundSize: 'auto 50px',
                backgroundPosition: 'center top',
              }}
            />
            SmartCityFix
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {!user && (
              <>
                <Link to="/" className="hover:text-gray-200 px-3 py-2 rounded-md text-sm font-medium">
                  Pocetna
                </Link>
                <Link to="/map" className="hover:text-gray-200 px-3 py-2 rounded-md text-sm font-medium">
                  Karta problema
                </Link>
                <Link to="/login" className="hover:text-gray-200 px-3 py-2 rounded-md text-sm font-medium">
                  Prijava
                </Link>
                <Link to="/register" className="hover:text-gray-200 px-3 py-2 rounded-md text-sm font-medium">
                  Registracija
                </Link>
              </>
            )}

            {user && user.role !== 'admin' && (
              <>
                <Link to="/" className="hover:text-gray-200 px-3 py-2 rounded-md text-sm font-medium">
                  Pocetna
                </Link>
                <Link to="/map" className="hover:text-gray-200 px-3 py-2 rounded-md text-sm font-medium">
                  Karta problema
                </Link>
                <Link to="/dashboard" className="hover:text-gray-200 px-3 py-2 rounded-md text-sm font-medium">
                  Moje prijave
                </Link>
                <Link to="/issues/new" className="hover:text-gray-200 px-3 py-2 rounded-md text-sm font-medium">
                  Nova prijava
                </Link>
                <NotificationBell />
                <button
                  onClick={handleLogout}
                  className="hover:text-gray-200 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Odjava
                </button>
              </>
            )}

            {user && user.role === 'admin' && (
              <>
                <Link to="/admin" className="hover:text-gray-200 px-3 py-2 rounded-md text-sm font-medium">
                  Admin panel
                </Link>
                <Link to="/admin/issues" className="hover:text-gray-200 px-3 py-2 rounded-md text-sm font-medium">
                  Sve prijave
                </Link>
                <Link to="/map" className="hover:text-gray-200 px-3 py-2 rounded-md text-sm font-medium">
                  Karta
                </Link>
                <Link to="/admin/statistics" className="hover:text-gray-200 px-3 py-2 rounded-md text-sm font-medium">
                  Statistika
                </Link>
                <button
                  onClick={handleLogout}
                  className="hover:text-gray-200 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Odjava
                </button>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden inline-flex items-center justify-center p-2 rounded-md hover:text-gray-200 focus:outline-none"
          >
            <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden px-2 pt-2 pb-3 space-y-1">
          {!user && (
            <>
              <Link to="/" onClick={closeMenu} className="block px-3 py-2 rounded-md text-base font-medium hover:bg-blue-700">
                Pocetna
              </Link>
              <Link to="/map" onClick={closeMenu} className="block px-3 py-2 rounded-md text-base font-medium hover:bg-blue-700">
                Karta problema
              </Link>
              <Link to="/login" onClick={closeMenu} className="block px-3 py-2 rounded-md text-base font-medium hover:bg-blue-700">
                Prijava
              </Link>
              <Link to="/register" onClick={closeMenu} className="block px-3 py-2 rounded-md text-base font-medium hover:bg-blue-700">
                Registracija
              </Link>
            </>
          )}

          {user && user.role !== 'admin' && (
            <>
              <Link to="/" onClick={closeMenu} className="block px-3 py-2 rounded-md text-base font-medium hover:bg-blue-700">
                Pocetna
              </Link>
              <Link to="/map" onClick={closeMenu} className="block px-3 py-2 rounded-md text-base font-medium hover:bg-blue-700">
                Karta problema
              </Link>
              <Link to="/dashboard" onClick={closeMenu} className="block px-3 py-2 rounded-md text-base font-medium hover:bg-blue-700">
                Moje prijave
              </Link>
              <Link to="/issues/new" onClick={closeMenu} className="block px-3 py-2 rounded-md text-base font-medium hover:bg-blue-700">
                Nova prijava
              </Link>
              <button
                onClick={handleLogout}
                className="block w-full text-left px-3 py-2 rounded-md text-base font-medium hover:bg-blue-700"
              >
                Odjava
              </button>
            </>
          )}

          {user && user.role === 'admin' && (
            <>
              <Link to="/admin" onClick={closeMenu} className="block px-3 py-2 rounded-md text-base font-medium hover:bg-blue-700">
                Admin panel
              </Link>
              <Link to="/admin/issues" onClick={closeMenu} className="block px-3 py-2 rounded-md text-base font-medium hover:bg-blue-700">
                Sve prijave
              </Link>
              <Link to="/map" onClick={closeMenu} className="block px-3 py-2 rounded-md text-base font-medium hover:bg-blue-700">
                Karta
              </Link>
              <Link to="/admin/statistics" onClick={closeMenu} className="block px-3 py-2 rounded-md text-base font-medium hover:bg-blue-700">
                Statistika
              </Link>
              <button
                onClick={handleLogout}
                className="block w-full text-left px-3 py-2 rounded-md text-base font-medium hover:bg-blue-700"
              >
                Odjava
              </button>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
