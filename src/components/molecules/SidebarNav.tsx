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
  { name: 'Home', href: '/home', icon: Home },
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
    if (path === '/home' && (location.pathname === '/home' || location.pathname === '/dashboard')) {
      return true;
    }
    if (path === '/threads' && (location.pathname.startsWith('/threads') || location.pathname.startsWith('/learning-path') || location.pathname.startsWith('/thread'))) {
      return true;
    }
    return location.pathname === path;
  };

  return (
    <aside className="nav-sidebar">
      {/* Logo */}
      <Link to="/home" className="nav-logo">
        <Spool className="logo-mark" />
        <span>Spool</span>
      </Link>

      {/* Stats */}
      <div className="p-6 space-y-4" style={{ borderBottom: `1px solid var(--border-color)` }}>
        <div className="flex items-center justify-between">
          <div className="streak-badge">
            <Flame className="streak-icon" />
            <span>{currentStreak} days</span>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Trophy className="h-5 w-5" style={{ color: 'var(--color-warning)' }} />
            <span className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>Points</span>
          </div>
          <span className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>{totalPoints.toLocaleString()}</span>
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
                    'nav-link',
                    active && 'active'
                  )}
                >
                  <Icon />
                  {item.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Profile Link */}
      <div className="p-4" style={{ borderTop: `1px solid var(--border-color)` }}>
        <Link
          to="/profile"
          className={cn(
            'nav-link',
            location.pathname === '/profile' && 'active'
          )}
        >
          <div className="h-8 w-8 rounded-full flex items-center justify-center" style={{ background: 'rgba(79, 209, 197, 0.1)' }}>
            <span className="text-sm font-semibold" style={{ color: 'var(--thread-primary)' }}>
              {userFirstName.charAt(0).toUpperCase()}
            </span>
          </div>
          <span>Profile</span>
        </Link>
      </div>
    </aside>
  );
};