'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface ProgressCardProps {
  title: string;
  percentage: number;
  color?: 'primary' | 'gold' | 'success' | 'warning' | 'error';
  subtitle?: string;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

const colorMap = {
  primary: 'from-primary to-primary/60',
  gold: 'from-accent to-accent/60',
  success: 'from-success to-success/60',
  warning: 'from-warning to-warning/60',
  error: 'from-error to-error/60',
};

export function ProgressCard({
  title,
  percentage,
  color = 'primary',
  subtitle,
  size = 'md',
  showLabel = true,
}: ProgressCardProps) {
  const sizeMap = {
    sm: 'w-20 h-20',
    md: 'w-32 h-32',
    lg: 'w-48 h-48',
  };

  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="text-center">
      <div className="flex justify-center mb-4">
        <div className={cn('relative flex items-center justify-center', sizeMap[size])}>
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="50%"
              cy="50%"
              r="45"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              className="text-border"
            />
            <circle
              cx="50%"
              cy="50%"
              r="45"
              fill="none"
              stroke="url(#gradient)"
              strokeWidth="3"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="transition-all duration-1000"
            />
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="var(--accent)" />
                <stop offset="100%" stopColor="var(--primary)" />
              </linearGradient>
            </defs>
          </svg>
          {showLabel && (
            <div className="absolute text-center">
              <p className={cn('font-heading font-bold text-foreground', {
                'text-2xl': size === 'lg',
                'text-xl': size === 'md',
                'text-lg': size === 'sm',
              })}>
                {Math.round(percentage)}%
              </p>
            </div>
          )}
        </div>
      </div>

      <h3 className="font-heading font-semibold text-foreground">{title}</h3>
      {subtitle && <p className="text-sm text-foreground-muted mt-1">{subtitle}</p>}
    </div>
  );
}
