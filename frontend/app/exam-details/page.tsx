'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, BookOpen } from 'lucide-react';
import { useAppContext } from '@/context/AppContext';
import { getExamById } from '@/data/exams';
import ExamDetailsView from '@/components/exam/ExamDetailsView';
import { Layout } from '@/components/shared/Layout';

export default function ExamDetailsPage() {
  const { selectedExam } = useAppContext();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(false);
    if (!selectedExam) {
      router.push('/exam-selection');
    }
  }, [selectedExam, router]);

  if (isLoading || !selectedExam) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center space-y-4">
            <div className="w-8 h-8 border-3 border-accent border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-foreground-muted">Loading exam details...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <main className="min-h-screen bg-background">
        {/* Header */}
        <div className="sticky top-16 z-20 bg-background border-b border-border">
          <div className="container-premium py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Link
                  href="/exam-selection"
                  className="p-2 rounded-lg hover:bg-muted transition-colors"
                  aria-label="Go back"
                >
                  <ArrowLeft className="w-5 h-5 text-foreground" />
                </Link>
                <div>
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-6 h-6 text-accent" />
                    <h1 className="font-heading font-bold text-3xl text-foreground">
                      {selectedExam.name}
                    </h1>
                  </div>
                  <p className="text-foreground-muted mt-1">{selectedExam.description}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="container-premium py-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-3">
              <ExamDetailsView examId={selectedExam.id} examName={selectedExam.name} />
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-4">
              {/* Quick Stats */}
              <div className="card-premium">
                <h3 className="font-heading font-bold text-lg mb-4">Quick Stats</h3>
                <div className="space-y-3">
                  <div className="p-3 bg-muted rounded-lg">
                    <p className="text-xs text-foreground-muted font-medium">Total Subjects</p>
                    <p className="text-2xl font-bold text-accent">{selectedExam.totalSubjects ?? '--'}</p>
                  </div>
                  <div className="p-3 bg-muted rounded-lg">
                    <p className="text-xs text-foreground-muted font-medium">Total Topics</p>
                    <p className="text-2xl font-bold text-accent">{selectedExam.totalTopics ?? '--'}</p>
                  </div>
                  <div className="p-3 bg-muted rounded-lg">
                    <p className="text-xs text-foreground-muted font-medium">Est. Study Hours</p>
                    <p className="text-2xl font-bold text-accent">{selectedExam.estimatedHours ?? '--'}</p>
                  </div>
                  <div className="p-3 bg-muted rounded-lg">
                    <p className="text-xs text-foreground-muted font-medium">Difficulty</p>
                    <p className="text-sm font-bold text-foreground capitalize">
                      {selectedExam.difficulty || 'Not set'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2">
                <Link
                  href="/dashboard"
                  className="w-full py-3 bg-accent text-accent-foreground rounded-lg font-medium hover:opacity-90 transition-all text-center block"
                >
                  Start Learning
                </Link>
                <Link
                  href="/study"
                  className="w-full py-3 bg-card border border-border text-foreground rounded-lg font-medium hover:bg-muted transition-all text-center block"
                >
                  View Syllabus
                </Link>
              </div>

              {/* Exam Info Card */}
              <div className="card-premium text-center">
                <BookOpen className="w-8 h-8 text-accent mx-auto mb-3" />
                <h4 className="font-semibold text-foreground mb-2">Ready to Prepare?</h4>
                <p className="text-xs text-foreground-muted mb-4">
                  Access comprehensive study materials, mock tests, and performance analytics
                </p>
                <div className="space-y-2 text-xs text-foreground-muted">
                  <p>✓ Structured syllabus breakdown</p>
                  <p>✓ Topic-wise practice questions</p>
                  <p>✓ Performance analytics</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </Layout>
  );
}
