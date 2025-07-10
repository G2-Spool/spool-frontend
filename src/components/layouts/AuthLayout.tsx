import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { BookOpen } from 'lucide-react';

export const AuthLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-obsidian flex flex-col">
      {/* Header */}
      <header className="bg-white dark:bg-gray-900 shadow-sm dark:shadow-none dark:border-b dark:border-gray-800">
        <div className="container mx-auto px-4 py-4">
          <Link to="/" className="flex items-center gap-2">
            <BookOpen className="h-8 w-8 text-teal-500" />
            <span className="text-2xl font-bold text-obsidian dark:text-gray-100">Spool</span>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Outlet />
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
        <div className="container mx-auto px-4 py-6">
          <p className="text-center text-sm text-gray-600 dark:text-gray-400">
            © 2024 Spool. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};