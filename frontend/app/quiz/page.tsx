'use client';

import React, { useEffect, useState } from 'react';
import { Layout } from '@/components/shared/Layout';
import { Clock, BookOpen } from 'lucide-react';
import { useAppContext } from '@/context/AppContext';
import { listServers, listServerQuizzes } from '@/services/serverService';
import { getLatestQuizResult, startQuiz } from '@/services/quizService';
import { ApiError } from '@/lib/api/client';

type QuizListItem = {
  id: number;
  title: string;
  duration: number;
  serverName: string;
  completed: boolean;
  score: number | null;
};

export default function QuizPage() {
  const { accessToken } = useAppContext();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [actionMessage, setActionMessage] = useState<string | null>(null);
  const [quizzes, setQuizzes] = useState<QuizListItem[]>([]);

  useEffect(() => {
    async function loadQuizzes() {
      if (!accessToken) {
        setError('Please login to load quizzes.');
        setQuizzes([]);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const servers = await listServers(accessToken);

        const quizCollections = await Promise.all(
          servers.map(async (server) => {
            const serverQuizzes = await listServerQuizzes(server.id, accessToken);

            const withResults = await Promise.all(
              serverQuizzes.map(async (quiz) => {
                const result = await getLatestQuizResult(quiz.id, accessToken);
                return {
                  id: quiz.id,
                  title: quiz.title,
                  duration: quiz.duration_mins,
                  serverName: server.name,
                  completed: Boolean(result && result.status === 'submitted'),
                  score: result ? Number(result.score.toFixed(2)) : null,
                } satisfies QuizListItem;
              })
            );

            return withResults;
          })
        );

        setQuizzes(quizCollections.flat());
      } catch (err) {
        if (err instanceof ApiError) {
          setError(err.message);
        } else {
          setError('Unable to load quizzes right now.');
        }
        setQuizzes([]);
      } finally {
        setIsLoading(false);
      }
    }

    loadQuizzes();
  }, [accessToken]);

  async function handleStartQuiz(quizId: number) {
    if (!accessToken) {
      setError('Please login to start a quiz.');
      return;
    }

    setActionMessage(null);

    try {
      const started = await startQuiz(quizId, accessToken);
      setActionMessage(
        `Quiz started: ${started.quiz_title}. Session #${started.session_id} with ${started.questions.length} questions.`
      );
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError('Unable to start quiz.');
      }
    }
  }

  return (
    <Layout>
      <div className="space-y-8">
        <div className="animate-slideDown">
          <h1 className="text-3xl font-heading font-bold text-foreground mb-2">Quiz & Tests</h1>
          <p className="text-foreground-secondary">Practice with real quizzes from your joined servers.</p>
        </div>

        {isLoading && (
          <div className="card-premium p-6 text-sm text-foreground-muted animate-slideUp">Loading quizzes...</div>
        )}

        {error && (
          <div className="card-premium p-6 text-sm text-destructive animate-slideUp">{error}</div>
        )}

        {actionMessage && (
          <div className="card-premium p-6 text-sm text-success animate-slideUp">{actionMessage}</div>
        )}

        {!isLoading && !error && quizzes.length === 0 && (
          <div className="card-premium p-6 text-sm text-foreground-muted animate-slideUp">
            No quizzes available yet. Join a server or ask a teacher to create server quizzes.
          </div>
        )}

        {!isLoading && !error && quizzes.length > 0 && (
          <div className="space-y-4 animate-slideUp">
            {quizzes.map((quiz) => (
              <div key={quiz.id} className="card-premium p-6 flex items-center justify-between hover:shadow-lg transition-all group">
                <div className="flex-1">
                  <h3 className="font-heading font-bold text-lg text-foreground group-hover:text-accent transition-colors mb-2">
                    {quiz.title}
                  </h3>
                  <div className="flex flex-wrap gap-4 text-sm text-foreground-muted">
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {quiz.duration} minutes
                    </span>
                    <span className="flex items-center gap-1">
                      <BookOpen className="w-4 h-4" />
                      Server: {quiz.serverName}
                    </span>
                    {quiz.completed && quiz.score !== null && (
                      <span className="badge badge-success">Completed • {quiz.score}%</span>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => handleStartQuiz(quiz.id)}
                  className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 transition-opacity"
                >
                  {quiz.completed ? 'Retake' : 'Start'}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
