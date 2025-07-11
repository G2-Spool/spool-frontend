import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
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

  const getDashboardHref = () => {
    switch (user?.role) {
      case 'student':
        return '/dashboard';
      case 'parent':
        return '/parent-dashboard';
      case 'educator':
        return '/educator-dashboard';
      default:
        return '/dashboard';
    }
  };

  const navigation = user?.role === 'student'
    ? [
        { name: 'Home', href: '/dashboard', icon: Home },
        { name: 'Voice Interview', href: '/interview', icon: MessageCircle },
        { name: 'Profile', href: '/profile', icon: User },
      ]
    : user?.role === 'parent'
    ? [
        { name: 'Home', href: '/parent-dashboard', icon: Home },
        { name: 'Analytics', href: '/analytics', icon: BarChart3 },
        { name: 'Profile', href: '/profile', icon: User },
      ]
    : [
        { name: 'Home', href: '/educator-dashboard', icon: Home },
        { name: 'Analytics', href: '/analytics', icon: BarChart3 },
        { name: 'Profile', href: '/profile', icon: User },
      ];

  const isActive = (path: string) => location.pathname === path;

  // For students, use sidebar layout
  if (user?.role === 'student') {
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
        <div className="flex-1 lg:ml-64">
          {/* Top Bar */}
          <header className="bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40">
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
                    {location.pathname === '/courses' && 'My Learning Paths'}
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
          <main className="px-4 sm:px-6 lg:px-8 py-8">
            <Outlet />
          </main>
        </div>
      </div>
    );
  }

  // For parents and educators, use top navigation
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-obsidian">
      {/* Navigation Header */}
      <header className="bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-8">
              <Link to={getDashboardHref()} className="flex items-center gap-2">
                <Spool className="h-8 w-8 text-teal-500" />
                <span className="text-2xl font-bold text-obsidian dark:text-gray-100">Spool</span>
              </Link>

              {/* Desktop Navigation */}
              <nav className="hidden lg:flex items-center gap-6">
                {navigation.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                        isActive(item.href)
                          ? 'text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-900/30'
                          : 'text-gray-700 dark:text-gray-300 hover:text-teal-600 dark:hover:text-teal-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      {item.name}
                    </Link>
                  );
                })}
              </nav>
            </div>

            {/* Right side */}
            <div className="flex items-center gap-4">
              {/* Streak Badge (for students) - Currently disabled */}
              {/* TODO: Enable when student features are ready
              {studentProfile && (
                <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-teal-50 dark:bg-teal-900/30 rounded-full">
                  <Flame className="h-4 w-4 text-warning" />
                  <span className="text-sm font-medium text-teal-700 dark:text-teal-400">
                    {studentProfile?.currentStreakDays} day streak
                  </span>
                </div>
              )}
              */}

              {/* Points (for students) - Currently disabled */}
              {/* TODO: Enable when student features are ready
              {studentProfile && (
                <div className="hidden sm:flex items-center gap-2">
                  <Trophy className="h-4 w-4 text-teal-600" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {studentProfile?.totalPoints.toLocaleString()} pts
                  </span>
                </div>
              )}
              */}

              {/* User Menu */}
              <div className="flex items-center gap-3">
                <div className="hidden md:block text-right">
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {user?.email}
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400 capitalize">{user?.role}</p>
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="hidden lg:flex"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </Button>

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
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-gray-900/50" onClick={() => setIsMobileMenuOpen(false)}>
          <div
            className="fixed right-0 top-0 h-full w-64 bg-white dark:bg-gray-900 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Menu</h2>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            <nav className="p-4 space-y-2">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive(item.href)
                        ? 'text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-900/30'
                        : 'text-gray-700 dark:text-gray-300 hover:text-teal-600 dark:hover:text-teal-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    {item.name}
                  </Link>
                );
              })}

              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 w-full px-3 py-2 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-teal-600 dark:hover:text-teal-400 hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  <LogOut className="h-5 w-5" />
                  Logout
                </button>
              </div>
            </nav>

            {/* Mobile Stats - Currently disabled */}
            {/* TODO: Enable when student features are ready
            {studentProfile && (
              <div className="p-4 border-t border-gray-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Streak</span>
                  <div className="flex items-center gap-2">
                    <Flame className="h-4 w-4 text-warning" />
                    <span className="text-sm font-medium">
                      {studentProfile?.currentStreakDays} days
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Points</span>
                  <div className="flex items-center gap-2">
                    <Trophy className="h-4 w-4 text-teal-600" />
                    <span className="text-sm font-medium">
                      {studentProfile?.totalPoints.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            )}
            */}
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
};