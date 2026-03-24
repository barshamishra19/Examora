'use client';

import React, { useState } from 'react';
import { Category } from '@/types/index';
import { ExamCard } from './ExamCard';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CategorySectionProps {
  category: Category;
  selectedExamId?: string;
  onSelectExam?: (examId: string) => void;
  isExpanded?: boolean;
  defaultExpanded?: boolean;
}

export function CategorySection({
  category,
  selectedExamId,
  onSelectExam,
  isExpanded: controlledExpanded,
  defaultExpanded = true,
}: CategorySectionProps) {
  const [internalExpanded, setInternalExpanded] = useState(defaultExpanded);
  const isExpanded = controlledExpanded !== undefined ? controlledExpanded : internalExpanded;

  const toggleExpand = () => {
    if (controlledExpanded === undefined) {
      setInternalExpanded(!isExpanded);
    }
  };

  return (
    <div className="space-y-4 animate-slideUp">
      {/* Category Header */}
      <button
        onClick={toggleExpand}
        className="w-full group"
      >
        <div className="flex items-center justify-between p-4 rounded-lg bg-card border border-border hover:border-accent hover:shadow-md transition-all duration-300">
          <div className="text-left">
            <h2 className="font-heading font-bold text-lg text-foreground group-hover:text-accent transition-colors">
              {category.name}
            </h2>
            <p className="text-sm text-foreground-muted mt-1">{category.description}</p>
          </div>
          <ChevronDown
            className={cn(
              'w-5 h-5 text-foreground-muted transition-transform duration-300 flex-shrink-0',
              isExpanded && 'rotate-180'
            )}
          />
        </div>
      </button>

      {/* Exams Grid */}
      {isExpanded && (
        <div className="grid md:grid-cols-2 gap-4 pl-4 animate-slideDown">
          {category.exams.map((exam) => (
            <ExamCard
              key={exam.id}
              exam={exam}
              isSelected={selectedExamId === exam.id}
              onClick={() => onSelectExam?.(exam.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
