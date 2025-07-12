import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useSidebar } from '../../contexts/SidebarContext';
import {
  Home,
  User,
  LogOut,
  Menu,
  X,
  // Flame, // TODO: Uncomment when student features are enabled
  // Trophy, // TODO: Uncomment when student features are enabled
  MessageCircle,
  BarChart3,
  Spool,
} from 'lucide-react';
import { Button } from '../atoms/Button';
import { SidebarNav } from '../molecules/SidebarNav';

export const DashboardLayout: React.FC = () => {
  const { user, studentProfile, logout } = useAuth();
  const { isLeftSidebarVisible } = useSidebar();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };


  const navigation = [
    { name: 'Home', href: '/dashboard', icon: Home },
    { name: 'Voice Interview', href: '/interview', icon: MessageCircle },
    { name: 'Profile', href: '/profile', icon: User },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen flex" style={{ background: 'var(--surface-ground)' }}>
      {/* Sidebar Navigation */}
      <div 
        className={`hidden lg:block fixed h-full z-30 transition-transform duration-300 ease-in-out ${
          isLeftSidebarVisible ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="h-full">
          <SidebarNav
            currentStreak={studentProfile?.currentStreakDays}
            totalPoints={studentProfile?.totalPoints}
            userFirstName={studentProfile?.firstName}
          />
        </div>
      </div>

      {/* Main Content Area */}
      <div 
        className={`flex-1 transition-all duration-300 ease-in-out ${
          isLeftSidebarVisible ? 'lg:ml-64' : 'lg:ml-0'
        }`}
      >
        {/* Top Bar */}
        <header className="nav-header">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              {/* Mobile menu button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 rounded-md transition-colors"
                style={{ color: 'var(--text-secondary)' }}
              >
                {isMobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>

              {/* Page Title or Search can go here */}
              <div className="hidden lg:block">
                <h1 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
                  {location.pathname === '/dashboard' && 'Home'}
                  {location.pathname.startsWith('/learning-path') && 'Learning Path'}
                  {location.pathname === '/threads' && 'Threads'}
                  {location.pathname === '/progress' && 'My Progress'}
                  {location.pathname === '/profile' && 'Profile'}
                </h1>
              </div>

              {/* Right side actions */}
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </Button>
              </div>
            </div>
          </div>
        </header>

        {/* Mobile Sidebar */}
        {isMobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 z-50" style={{ background: 'rgba(0, 0, 0, 0.5)' }} onClick={() => setIsMobileMenuOpen(false)}>
            <div
              className="fixed left-0 top-0 h-full shadow-xl"
              style={{ background: 'var(--surface-base)' }}
              onClick={(e) => e.stopPropagation()}
            >
              <SidebarNav
                currentStreak={studentProfile?.currentStreakDays}
                totalPoints={studentProfile?.totalPoints}
                userFirstName={studentProfile?.firstName}
              />
            </div>
          </div>
        )}

        {/* Page Content */}
        <main className="px-4 sm:px-6 lg:px-8 py-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};