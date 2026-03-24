'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAppContext } from '@/context/AppContext';
import { ThemeToggle } from '@/components/shared/ThemeToggle';
import { Search, ChevronDown, Bell } from 'lucide-react';

export function Topbar() {
  const { user, selectedExam } = useAppContext();
  const [showExamDropdown, setShowExamDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <header className="sticky top-0 z-30 bg-card border-b border-border shadow-sm">
      <div className="flex items-center justify-between px-4 md:px-8 py-3 gap-4">
        {/* Left - Exam Selector */}
        <div className="flex items-center gap-4 flex-1">
          <div className="relative hidden md:block">
            <button
              onClick={() => setShowExamDropdown(!showExamDropdown)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-muted hover:bg-muted/80 transition-colors"
            >
              <span className="font-medium text-foreground text-sm truncate">
                {selectedExam?.name || 'Select Exam'}
              </span>
              <ChevronDown className="w-4 h-4 text-foreground-muted" />
            </button>

            {/* Dropdown */}
            {showExamDropdown && (
              <div className="absolute top-full left-0 mt-2 w-48 bg-card border border-border rounded-lg shadow-lg p-2 z-50">
                <p className="text-xs text-foreground-muted px-3 py-2 uppercase font-semibold">Exam</p>
                {selectedExam ? (
                  <div className="px-3 py-2 text-sm text-foreground">{selectedExam.name}</div>
                ) : (
                  <p className="px-3 py-2 text-sm text-foreground-muted">
                    No exam selected yet.
                  </p>
                )}
                <Link
                  href="/exam-selection"
                  className="block mt-2 px-3 py-2 rounded hover:bg-muted text-sm text-accent transition-colors"
                  onClick={() => setShowExamDropdown(false)}
                >
                  Choose exam
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Middle - Search */}
        <div className="hidden md:flex flex-1 max-w-md items-center gap-2 px-4 py-2 rounded-lg bg-muted">
          <Search className="w-4 h-4 text-foreground-muted" />
          <input
            type="text"
            placeholder="Search topics, tests..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 bg-transparent outline-none text-sm text-foreground placeholder-foreground-muted"
          />
        </div>

        {/* Right - Notifications & Profile */}
        <div className="flex items-center gap-3">
          <ThemeToggle />

          {/* Notifications */}
          <button className="relative p-2 rounded-lg hover:bg-muted transition-colors">
            <Bell className="w-5 h-5 text-foreground-muted hover:text-foreground" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full" />
          </button>

          {/* Profile Avatar */}
          {user && (
            <div className="w-8 h-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center font-medium text-sm cursor-pointer hover:opacity-80 transition-opacity">
              {user.name.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
