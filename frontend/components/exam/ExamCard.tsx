'use client';

import React from 'react';
import Link from 'next/link';
import { Exam } from '@/types/index';
import { cn } from '@/lib/utils';
import { ArrowRight, CheckCircle, BookOpen } from 'lucide-react';
import { useAppContext } from '@/context/AppContext';

interface ExamCardProps {
  exam: Exam;
  isSelected?: boolean;
  onClick?: () => void;
}

export function ExamCard({ exam, isSelected = false, onClick }: ExamCardProps) {
  const { setSelectedExam } = useAppContext();
  
  const difficultyColor = {
    beginner: 'bg-green-100/30 text-green-700 dark:bg-green-900/30 dark:text-green-300',
    intermediate: 'bg-yellow-100/30 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300',
    advanced: 'bg-red-100/30 text-red-700 dark:bg-red-900/30 dark:text-red-300',
  };

  const difficulty = exam.difficulty || 'beginner';

  const handleViewDetails = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedExam(exam);
  };

  return (
    <div
      className={cn(
        'w-full text-left p-6 rounded-lg border-2 transition-all duration-300 hover:shadow-lg group',
        isSelected
          ? 'border-accent bg-accent/5 shadow-lg'
          : 'border-border bg-card hover:border-accent'
      )}
    >
      <button
        onClick={onClick}
        className="w-full text-left focus:outline-none"
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="font-heading font-bold text-lg text-foreground group-hover:text-accent transition-colors">
              {exam.name}
            </h3>
            <p className="text-sm text-foreground-muted mt-1">{exam.description}</p>
          </div>
          {isSelected && (
            <CheckCircle className="w-6 h-6 text-accent flex-shrink-0 ml-3" />
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-4 py-4 border-y border-border">
          <div>
            <p className="text-xs text-foreground-muted">Subjects</p>
            <p className="font-bold text-foreground">{exam.totalSubjects}</p>
          </div>
          <div>
            <p className="text-xs text-foreground-muted">Topics</p>
            <p className="font-bold text-foreground">{exam.totalTopics}</p>
          </div>
          <div>
            <p className="text-xs text-foreground-muted">Est. Hours</p>
            <p className="font-bold text-foreground">{exam.estimatedHours}</p>
          </div>
        </div>

        {/* Difficulty & CTA */}
        <div className="flex items-center justify-between">
          <span
            className={cn(
              'text-xs font-semibold px-3 py-1 rounded-full capitalize',
              difficultyColor[difficulty]
            )}
          >
            {difficulty}
          </span>
          <ArrowRight className="w-4 h-4 text-foreground-muted group-hover:text-accent transition-colors" />
        </div>
      </button>

      {/* View Details Link */}
      <Link
        href="/exam-details"
        onClick={handleViewDetails}
        className="mt-3 flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-muted hover:bg-muted/80 text-foreground hover:text-accent transition-colors text-sm font-medium"
      >
        <BookOpen className="w-4 h-4" />
        View Syllabus & Details
      </Link>
    </div>
  );
}
