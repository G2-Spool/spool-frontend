import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '../../utils/cn';
import { 
  Home, 
  AudioWaveform, 
  TrendingUp, 
  Flame,
  Trophy,
  Spool,
} from 'lucide-react';

interface NavItem {
  name: string;
  href: string;
  icon: React.FC<{ className?: string }>;
}

const navItems: NavItem[] = [
  { name: 'Home', href: '/dashboard', icon: Home },
  { name: 'Threads', href: '/threads', icon: AudioWaveform },
  { name: 'Progress', href: '/progress', icon: TrendingUp },
];

interface SidebarNavProps {
  currentStreak?: number;
  totalPoints?: number;
  userFirstName?: string;
}

export const SidebarNav: React.FC<SidebarNavProps> = ({
  currentStreak = 0,
  totalPoints = 0,
  userFirstName = 'Student',
}) => {
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === '/dashboard' && location.pathname === '/dashboard') {
      return true;
    }
    if (path === '/threads' && (location.pathname.startsWith('/threads') || location.pathname.startsWith('/learning-path') || location.pathname.startsWith('/thread'))) {
      return true;
    }
    return location.pathname === path;
  };

  return (
    <aside className="w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 h-full flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <Link to="/dashboard" className="flex items-center gap-2">
          <Spool className="h-8 w-8 text-teal-500" />
          <span className="text-2xl font-bold text-obsidian dark:text-gray-100">Spool</span>
        </Link>
      </div>

      {/* Stats */}
      <div className="p-6 space-y-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Flame className="h-5 w-5 text-orange-500" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Streak</span>
          </div>
          <span className="text-sm font-bold text-obsidian dark:text-gray-100">{currentStreak} days</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-yellow-500" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Points</span>
          </div>
          <span className="text-sm font-bold text-obsidian dark:text-gray-100">{totalPoints.toLocaleString()}</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            
            return (
              <li key={item.name}>
                <Link
                  to={item.href}
                  className={cn(
                    'flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all duration-normal',
                    active
                      ? 'bg-teal-50 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100'
                  )}
                >
                  <Icon className={cn('h-5 w-5', active ? 'text-teal-600 dark:text-teal-400' : 'text-gray-500 dark:text-gray-400')} />
                  {item.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Profile Link */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <Link
          to="/profile"
          className={cn(
            'flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all duration-normal',
            location.pathname === '/profile'
              ? 'bg-teal-50 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400'
              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100'
          )}
        >
          <div className="h-8 w-8 rounded-full bg-teal-100 dark:bg-teal-900/30 flex items-center justify-center">
            <span className="text-sm font-semibold text-teal-700 dark:text-teal-400">
              {userFirstName.charAt(0).toUpperCase()}
            </span>
          </div>
          <span>Profile</span>
        </Link>
      </div>
    </aside>
  );
};