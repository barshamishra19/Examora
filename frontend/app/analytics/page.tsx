'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { Layout } from '@/components/shared/Layout';
import { TrendingUp, BarChart3, PieChart, Target } from 'lucide-react';
import { useAppContext } from '@/context/AppContext';
import { getTopicsForExam } from '@/services/examService';
import { getMyPerformance, getWeakTopics } from '@/services/performanceService';
import { ApiError } from '@/lib/api/client';

type AnalyticsTopicRow = {
  topicId: number;
  topicName: string;
  accuracy: number;
  total: number;
  correct: number;
};

export default function AnalyticsPage() {
  const { accessToken, selectedExam } = useAppContext();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [overallAccuracy, setOverallAccuracy] = useState<number | null>(null);
  const [totalQuestions, setTotalQuestions] = useState<number>(0);
  const [weakCount, setWeakCount] = useState<number>(0);
  const [rows, setRows] = useState<AnalyticsTopicRow[]>([]);

  useEffect(() => {
    async function loadAnalytics() {
      if (!accessToken) {
        setError('Please login to view analytics.');
        return;
      }

      if (!selectedExam) {
        setRows([]);
        setOverallAccuracy(null);
        setTotalQuestions(0);
        setWeakCount(0);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const [performance, weakTopics, examTopics] = await Promise.all([
          getMyPerformance(accessToken),
          getWeakTopics(accessToken),
          getTopicsForExam(selectedExam.id),
        ]);

        const topicMap = new Map<number, string>(
          examTopics.map((item) => [item.id, item.name])
        );

        const mappedRows: AnalyticsTopicRow[] = performance.by_topic.map((item) => ({
          topicId: item.topic_id,
          topicName: topicMap.get(item.topic_id) || `Topic ${item.topic_id}`,
          accuracy: item.accuracy,
          total: item.total,
          correct: item.correct,
        }));

        setRows(mappedRows.sort((a, b) => b.accuracy - a.accuracy));
        setOverallAccuracy(performance.overall_accuracy);
        setTotalQuestions(performance.total_questions_attempted);
        setWeakCount(weakTopics.length);
      } catch (err) {
        if (err instanceof ApiError) {
          setError(err.message);
        } else {
          setError('Unable to load analytics right now.');
        }
        setRows([]);
      } finally {
        setIsLoading(false);
      }
    }

    loadAnalytics();
  }, [accessToken, selectedExam]);

  const avgTimePlaceholder = useMemo(() => {
    if (rows.length === 0) {
      return '--';
    }

    return 'N/A';
  }, [rows]);

  return (
    <Layout>
      <div className="space-y-8">
        <div className="animate-slideDown">
          <h1 className="text-3xl font-heading font-bold text-foreground mb-2">Analytics & Progress</h1>
          <p className="text-foreground-secondary">Track your learning journey and identify improvement areas</p>
        </div>

        {isLoading && (
          <div className="card-premium p-6 text-sm text-foreground-muted animate-slideUp">Loading analytics...</div>
        )}

        {error && (
          <div className="card-premium p-6 text-sm text-destructive animate-slideUp">{error}</div>
        )}

        {!isLoading && !error && (
          <>
            <div className="grid md:grid-cols-4 gap-4 animate-slideUp">
              {[
                {
                  icon: Target,
                  label: 'Accuracy',
                  value: overallAccuracy !== null ? `${overallAccuracy}%` : '--',
                  change: 'From backend performance records',
                },
                {
                  icon: BarChart3,
                  label: 'Topics Attempted',
                  value: String(rows.length),
                  change: 'Computed from quiz performance',
                },
                {
                  icon: TrendingUp,
                  label: 'Avg Time/Q',
                  value: avgTimePlaceholder,
                  change: 'Backend does not expose this yet',
                },
                {
                  icon: PieChart,
                  label: 'Questions',
                  value: String(totalQuestions),
                  change: `${weakCount} weak topics detected`,
                },
              ].map((metric) => (
                <div key={metric.label} className="card-premium p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <metric.icon className="w-6 h-6 text-accent" />
                    </div>
                    <p className="text-sm text-foreground-muted">{metric.label}</p>
                  </div>
                  <p className="text-3xl font-bold text-foreground mb-2">{metric.value}</p>
                  <p className="text-xs text-foreground-muted">{metric.change}</p>
                </div>
              ))}
            </div>

            <div className="card-premium p-6 animate-slideUp">
              <h3 className="font-heading font-bold text-lg text-foreground mb-6">Topic-wise Performance</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-2 px-3 text-sm font-medium text-foreground-muted">Topic</th>
                      <th className="text-center py-2 px-3 text-sm font-medium text-foreground-muted">Correct</th>
                      <th className="text-center py-2 px-3 text-sm font-medium text-foreground-muted">Total</th>
                      <th className="text-center py-2 px-3 text-sm font-medium text-foreground-muted">Accuracy</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.length === 0 && (
                      <tr>
                        <td colSpan={4} className="py-4 px-3 text-center text-sm text-foreground-muted">
                          No analytics data yet. Attempt quizzes to generate stats.
                        </td>
                      </tr>
                    )}
                    {rows.map((row) => (
                      <tr key={row.topicId} className="border-b border-border hover:bg-muted transition-colors">
                        <td className="py-3 px-3 font-medium text-foreground">{row.topicName}</td>
                        <td className="py-3 px-3 text-center text-success font-bold">{row.correct}</td>
                        <td className="py-3 px-3 text-center text-foreground font-bold">{row.total}</td>
                        <td className="py-3 px-3 text-center text-accent font-bold">{row.accuracy}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </Layout>
  );
}
