import React, { useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
  LogOut,
  Menu,
  X,
} from 'lucide-react';
import { Button } from '../atoms/Button';
import { SidebarNav } from '../molecules/SidebarNav';
import { cn } from '../../utils/cn';

export const DashboardLayout: React.FC = () => {
  const { studentProfile, logout } = useAuth();
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


  // Navigation items available for future use
  // const navigation = [
  //   { name: 'Home', href: '/dashboard', icon: Home },
  //   { name: 'Text Interview', href: '/interview', icon: MessageCircle },
  //   { name: 'Profile', href: '/profile', icon: User },
  // ];

  // Helper function available for future use
  // const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-obsidian flex">
      {/* Sidebar Navigation */}
      <div className="hidden lg:block">
        <div className="fixed h-full">
          <SidebarNav
            currentStreak={studentProfile?.currentStreakDays}
            totalPoints={studentProfile?.totalPoints}
            userFirstName={studentProfile?.firstName}
          />
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 lg:ml-64 h-screen overflow-hidden flex flex-col">
        {/* Top Bar */}
        <header className="bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40 flex-shrink-0">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              {/* Mobile menu button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                {isMobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>

              {/* Page Title or Search can go here */}
              <div className="hidden lg:block">
                <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
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
          <div className="lg:hidden fixed inset-0 z-50 bg-gray-900/50" onClick={() => setIsMobileMenuOpen(false)}>
            <div
              className="fixed left-0 top-0 h-full bg-white dark:bg-gray-900 shadow-xl"
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
        <main className={cn(
          "flex-1 overflow-hidden",
          location.pathname.includes('/thread/') ? '' : 'px-4 sm:px-6 lg:px-8 py-8'
        )}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};