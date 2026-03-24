'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { Layout } from '@/components/shared/Layout';
import { ProgressCard } from '@/components/dashboard/ProgressCard';
import {
  UpcomingTests,
  WeakAreasWidget,
  StrongAreasWidget,
  TopicFocusWidget,
} from '@/components/dashboard/DashboardWidgets';
import { useAppContext } from '@/context/AppContext';
import { getMyPerformance, getWeakTopics } from '@/services/performanceService';
import { getTopicsForExam } from '@/services/examService';
import { ApiError } from '@/lib/api/client';
import { BookOpen, Award, Clock } from 'lucide-react';
import Link from 'next/link';

type DashboardData = {
  overallProgress: number;
  totalTopicsCompleted: number;
  totalTopicsFocused: number;
  weakAreas: Array<{
    subjectId: string;
    subjectName: string;
    accuracy: number;
    questionsAttempted: number;
  }>;
  strongAreas: Array<{
    subjectId: string;
    subjectName: string;
    accuracy: number;
    questionsAttempted: number;
  }>;
  upcomingTests: Array<{
    id: string;
    examId: string;
    title: string;
    date: Date;
    duration: number;
    type: 'mock' | 'actual' | 'assignment';
    completed: boolean;
  }>;
  streak: number;
};

export default function DashboardPage() {
  const { selectedExam, accessToken } = useAppContext();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<DashboardData | null>(null);

  useEffect(() => {
    async function loadDashboard() {
      if (!selectedExam) {
        setProgress(null);
        return;
      }

      if (!accessToken) {
        setError('Please login again to load dashboard data.');
        setProgress(null);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const [perf, weak, topics] = await Promise.all([
          getMyPerformance(accessToken),
          getWeakTopics(accessToken),
          getTopicsForExam(selectedExam.id),
        ]);

        const topicNameById = new Map<number, string>(
          topics.map((topic) => [topic.id, topic.name])
        );

        const strongAreas = perf.by_topic
          .filter((item) => item.accuracy >= 70)
          .sort((a, b) => b.accuracy - a.accuracy)
          .slice(0, 5)
          .map((item) => ({
            subjectId: String(item.topic_id),
            subjectName: topicNameById.get(item.topic_id) || `Topic ${item.topic_id}`,
            accuracy: item.accuracy,
            questionsAttempted: item.total,
          }));

        const weakAreas = weak.slice(0, 5).map((item) => ({
          subjectId: String(item.topic_id),
          subjectName: item.topic_name,
          accuracy: item.accuracy,
          questionsAttempted: item.total_questions,
        }));

        setProgress({
          overallProgress: perf.overall_accuracy,
          totalTopicsCompleted: perf.by_topic.filter((item) => item.accuracy >= 70).length,
          totalTopicsFocused: perf.by_topic.length,
          weakAreas,
          strongAreas,
          upcomingTests: [],
          streak: 0,
        });
      } catch (err) {
        if (err instanceof ApiError) {
          setError(err.message);
        } else {
          setError('Unable to load dashboard data right now.');
        }
        setProgress(null);
      } finally {
        setIsLoading(false);
      }
    }

    loadDashboard();
  }, [selectedExam, accessToken]);

  const estimatedHoursLeft = useMemo(() => {
    if (!selectedExam || !progress) {
      return 0;
    }

    return Math.round(
      ((100 - progress.overallProgress) * (selectedExam.estimatedHours || 0)) / 100
    );
  }, [selectedExam, progress]);

  if (!selectedExam) {
    return (
      <Layout>
        <div className="text-center py-12">
          <p className="text-lg text-foreground-muted mb-6">Please select an exam first</p>
          <Link href="/exam-selection" className="btn-premium inline-block">
            Choose Exam
          </Link>
        </div>
      </Layout>
    );
  }

  if (isLoading) {
    return (
      <Layout>
        <div className="card-premium p-6 text-sm text-foreground-muted">Loading dashboard...</div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="card-premium p-6 text-sm text-destructive">{error}</div>
      </Layout>
    );
  }

  if (!progress || progress.totalTopicsFocused === 0) {
    return (
      <Layout>
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-heading font-bold text-foreground mb-2">{selectedExam.name}</h1>
            <p className="text-foreground-secondary">No progress data yet. Start a quiz to build your dashboard.</p>
          </div>
          <div className="card-premium p-6 text-sm text-foreground-muted">No live performance records found.</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-8">
        <div className="flex items-center justify-between motion-reveal" style={{ animationDelay: '60ms' }}>
          <div>
            <h1 className="text-3xl font-heading font-bold text-foreground mb-2">{selectedExam.name}</h1>
            <p className="text-foreground-secondary">{selectedExam.description}</p>
          </div>
          <Link href="/exam-selection" className="text-primary hover:text-primary/80 underline text-sm font-medium">
            Change Exam
          </Link>
        </div>

        <div className="grid md:grid-cols-4 gap-6">
          <div className="card-premium motion-card motion-reveal flex flex-col items-center justify-center p-8 text-center" style={{ animationDelay: '120ms' }}>
            <ProgressCard title="Overall Accuracy" percentage={progress.overallProgress} color="gold" size="lg" />
          </div>

          <div className="card-premium motion-card motion-reveal p-6 space-y-4" style={{ animationDelay: '190ms' }}>
            <div className="flex items-center gap-3">
              <BookOpen className="w-6 h-6 text-accent" />
              <div>
                <p className="text-xs text-foreground-muted">Topics Completed</p>
                <p className="text-2xl font-bold text-foreground">{progress.totalTopicsCompleted}</p>
              </div>
            </div>
            <p className="text-xs text-foreground-muted">of {progress.totalTopicsFocused} attempted topics</p>
          </div>

          <div className="card-premium motion-card motion-reveal p-6 space-y-4" style={{ animationDelay: '260ms' }}>
            <div className="flex items-center gap-3">
              <Clock className="w-6 h-6 text-primary" />
              <div>
                <p className="text-xs text-foreground-muted">Estimated Time Left</p>
                <p className="text-2xl font-bold text-foreground">{estimatedHoursLeft}h</p>
              </div>
            </div>
            <p className="text-xs text-foreground-muted">at current pace</p>
          </div>

          <div className="card-premium motion-card motion-reveal p-6 space-y-4" style={{ animationDelay: '330ms' }}>
            <div className="flex items-center gap-3">
              <Award className="w-6 h-6 text-success" />
              <div>
                <p className="text-xs text-foreground-muted">Streak</p>
                <p className="text-2xl font-bold text-foreground">{progress.streak || '—'} days</p>
              </div>
            </div>
            <p className="text-xs text-foreground-muted">{progress.streak ? 'Keep it going!' : 'No data yet'}</p>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6 motion-reveal" style={{ animationDelay: '380ms' }}>
          <div className="md:col-span-2 space-y-6">
            {progress.upcomingTests.length > 0 && <UpcomingTests tests={progress.upcomingTests} />}
            {progress.weakAreas.length > 0 && <WeakAreasWidget areas={progress.weakAreas} />}
          </div>

          <div className="space-y-6">
            <TopicFocusWidget />
            {progress.strongAreas.length > 0 && <StrongAreasWidget areas={progress.strongAreas} />}
          </div>
        </div>

        <div className="card-premium motion-card motion-reveal space-y-4" style={{ animationDelay: '460ms' }}>
          <h3 className="font-heading font-bold text-lg text-foreground">Quick Actions</h3>
          <div className="grid md:grid-cols-4 gap-4">
            <Link href="/study" className="p-4 rounded-lg border border-border hover:border-accent hover:shadow-md transition-all text-center motion-card">
              <p className="font-medium text-foreground">📚 Study Topics</p>
              <p className="text-xs text-foreground-muted mt-2">Continue learning</p>
            </Link>
            <Link href="/quiz" className="p-4 rounded-lg border border-border hover:border-accent hover:shadow-md transition-all text-center motion-card">
              <p className="font-medium text-foreground">🎯 Take Quiz</p>
              <p className="text-xs text-foreground-muted mt-2">Test yourself</p>
            </Link>
            <Link href="/analytics" className="p-4 rounded-lg border border-border hover:border-accent hover:shadow-md transition-all text-center motion-card">
              <p className="font-medium text-foreground">📊 Analytics</p>
              <p className="text-xs text-foreground-muted mt-2">View insights</p>
            </Link>
            <Link href="/leaderboard" className="p-4 rounded-lg border border-border hover:border-accent hover:shadow-md transition-all text-center motion-card">
              <p className="font-medium text-foreground">🏆 Leaderboard</p>
              <p className="text-xs text-foreground-muted mt-2">See rankings</p>
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
}
