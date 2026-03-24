'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { Layout } from '@/components/shared/Layout';
import { useAppContext } from '@/context/AppContext';
import { getSubjectsForExam, getTopicsForExam } from '@/services/examService';
import { ApiError } from '@/lib/api/client';
import { ChevronRight, Clock } from 'lucide-react';
import Link from 'next/link';

export default function StudyPage() {
  const { selectedExam } = useAppContext();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [subjectNames, setSubjectNames] = useState<string[]>([]);
  const [topics, setTopics] = useState<Array<{ id: number; name: string; importance_score: number }>>([]);

  useEffect(() => {
    async function loadStudyData() {
      if (!selectedExam) {
        setSubjectNames([]);
        setTopics([]);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const [subjects, backendTopics] = await Promise.all([
          getSubjectsForExam(selectedExam.id),
          getTopicsForExam(selectedExam.id),
        ]);

        setSubjectNames(subjects.map((item) => item.subject_name));
        setTopics(
          backendTopics.map((item) => ({
            id: item.id,
            name: item.name,
            importance_score: item.importance_score,
          }))
        );
      } catch (err) {
        if (err instanceof ApiError) {
          setError(err.message);
        } else {
          setError('Unable to load study material right now.');
        }
        setSubjectNames([]);
        setTopics([]);
      } finally {
        setIsLoading(false);
      }
    }

    loadStudyData();
  }, [selectedExam]);

  const sortedTopics = useMemo(() => {
    return [...topics].sort((a, b) => b.importance_score - a.importance_score);
  }, [topics]);

  return (
    <Layout>
      <div className="space-y-8">
        <div className="animate-slideDown">
          <h1 className="text-3xl font-heading font-bold text-foreground mb-2">Study Materials</h1>
          <p className="text-foreground-secondary">Navigate through real subjects and topics from backend data</p>
        </div>

        {isLoading && <div className="card-premium p-6 text-sm text-foreground-muted">Loading study materials...</div>}

        {error && <div className="card-premium p-6 text-sm text-destructive">{error}</div>}

        {!isLoading && !error && selectedExam && (
          <>
            <div className="card-premium p-6 space-y-3">
              <h2 className="font-heading font-bold text-xl text-foreground">Subjects</h2>
              {subjectNames.length === 0 ? (
                <p className="text-sm text-foreground-muted">No subjects available for this exam yet.</p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {subjectNames.map((subject) => (
                    <span key={subject} className="badge badge-primary">
                      {subject}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="card-premium p-6 space-y-4">
              <h2 className="font-heading font-bold text-xl text-foreground">Topics (by importance)</h2>

              {sortedTopics.length === 0 ? (
                <p className="text-sm text-foreground-muted">No topics available for this exam yet.</p>
              ) : (
                <div className="grid md:grid-cols-2 gap-3">
                  {sortedTopics.map((topic) => (
                    <div
                      key={topic.id}
                      className="p-4 rounded-lg border border-border hover:border-accent hover:shadow-md transition-all group"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="font-medium text-foreground group-hover:text-accent transition-colors">{topic.name}</h3>
                        <span className="text-xs badge badge-gold">{Math.round(topic.importance_score)}%</span>
                      </div>

                      <div className="space-y-2 mb-3">
                        <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-accent to-primary"
                            style={{ width: `${Math.min(Math.max(topic.importance_score, 0), 100)}%` }}
                          />
                        </div>

                        <div className="flex items-center justify-between text-xs text-foreground-muted">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            importance score
                          </span>
                          <span>{Math.round(topic.importance_score)}%</span>
                        </div>
                      </div>

                      <button className="w-full px-3 py-2 rounded text-sm font-medium text-foreground-muted hover:text-foreground hover:bg-muted transition-colors flex items-center justify-center gap-2 group">
                        Start
                        <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}

        {!selectedExam && (
          <div className="text-center py-12">
            <p className="text-lg text-foreground-muted mb-6">Select an exam to view study materials</p>
            <Link href="/exam-selection" className="btn-premium inline-block">
              Choose Exam
            </Link>
          </div>
        )}
      </div>
    </Layout>
  );
}
