'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useAppContext } from '@/context/AppContext';
import { Menu, X, BookOpen, BarChart3, Trophy, Users, LogOut, Home } from 'lucide-react';

interface NavItem {
  href: string;
  label: string;
  icon: React.ReactNode;
  isTeacherOnly?: boolean;
}

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAppContext();
  const [isOpen, setIsOpen] = useState(false);

  const isTeacher = user?.role === 'teacher';

  const navItems: NavItem[] = [
    {
      href: '/dashboard',
      label: 'Dashboard',
      icon: <Home className="w-5 h-5" />,
    },
    {
      href: '/study',
      label: 'Study',
      icon: <BookOpen className="w-5 h-5" />,
    },
    {
      href: '/quiz',
      label: 'Quiz & Tests',
      icon: <BarChart3 className="w-5 h-5" />,
    },
    {
      href: '/leaderboard',
      label: 'Leaderboard',
      icon: <Trophy className="w-5 h-5" />,
    },
    ...(isTeacher
      ? [
          {
            href: '/teacher',
            label: 'Manage Classes',
            icon: <Users className="w-5 h-5" />,
            isTeacherOnly: true,
          },
        ]
      : []),
  ];

  return (
    <>
      {/* Mobile Menu Toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 md:hidden bg-primary text-primary-foreground p-2 rounded-lg"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Sidebar Overlay (Mobile) */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed left-0 top-0 h-full w-64 bg-card border-r border-border shadow-lg transition-transform duration-300 z-40',
          'md:translate-x-0 md:relative md:shadow-none',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Header */}
        <div className="p-6 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg overflow-hidden border border-border/60 bg-card flex items-center justify-center">
              <Image
                src="/website icon.png"
                alt="examora logo"
                width={40}
                height={40}
                className="w-full h-full object-cover"
                priority
              />
            </div>
            <div>
              <h1 className="font-heading font-bold text-lg text-foreground">examora</h1>
              <p className="text-xs text-foreground-muted">Premium Exam Prep</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');

            return (
              <Link key={item.href} href={item.href}>
                <div
                  className={cn(
                    'flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200',
                    isActive
                      ? 'bg-primary text-primary-foreground shadow-md'
                      : 'text-foreground-secondary hover:bg-muted'
                  )}
                  onClick={() => setIsOpen(false)}
                >
                  {item.icon}
                  <span className="font-medium">{item.label}</span>
                </div>
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-border space-y-3">
          {/* User Info */}
          {user && (
            <div className="px-4 py-3 rounded-lg bg-muted">
              <p className="text-sm font-medium text-foreground">{user.name}</p>
              <p className="text-xs text-foreground-muted capitalize">{user.role}</p>
            </div>
          )}

          {/* Logout Button */}
          <button
            onClick={() => {
              logout();
              router.push('/auth/login');
            }}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors font-medium"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}
