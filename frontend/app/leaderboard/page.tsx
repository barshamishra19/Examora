'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { Layout } from '@/components/shared/Layout';
import { getRelativeTime } from '@/lib/utils';
import { LeaderboardEntry } from '@/types/index';
import { Trophy, Flame, Target } from 'lucide-react';
import { getLeaderboard } from '@/services/performanceService';
import { useAppContext } from '@/context/AppContext';
import { ApiError } from '@/lib/api/client';

export default function LeaderboardPage() {
  const { selectedExam, user } = useAppContext();
  const [timePeriod, setTimePeriod] = useState<'week' | 'month' | 'all'>('all');
  const [sortBy, setSortBy] = useState<'score' | 'accuracy' | 'streak'>('score');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);

  useEffect(() => {
    async function loadLeaderboard() {
      setIsLoading(true);
      setError(null);

      try {
        const response = await getLeaderboard({
          examId: selectedExam?.id,
          limit: 25,
        });

        const mapped: LeaderboardEntry[] = response.leaderboard.map((item) => ({
          rank: item.rank,
          userId: String(item.user_id),
          userName: item.user_name,
          score: item.total_questions > 0 ? Number(((item.total_correct / item.total_questions) * 100).toFixed(2)) : 0,
          accuracy: item.accuracy,
          topicsCompleted: 0,
          streakDays: 0,
          lastAttemptDate: new Date(),
        }));

        setLeaderboard(mapped);
      } catch (err) {
        if (err instanceof ApiError) {
          setError(err.message);
        } else {
          setError('Unable to load leaderboard right now.');
        }
        setLeaderboard([]);
      } finally {
        setIsLoading(false);
      }
    }

    loadLeaderboard();
  }, [selectedExam?.id]);

  const sortedLeaderboard = useMemo(() => {
    const list = [...leaderboard];

    if (sortBy === 'accuracy') {
      list.sort((a, b) => b.accuracy - a.accuracy);
    } else if (sortBy === 'streak') {
      list.sort((a, b) => b.streakDays - a.streakDays);
    } else {
      list.sort((a, b) => b.score - a.score);
    }

    return list.map((entry, idx) => ({ ...entry, rank: idx + 1 }));
  }, [leaderboard, sortBy]);

  const getMedalIcon = (rank: number) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return null;
  };

  const getRankColor = (rank: number) => {
    if (rank === 1) return 'from-yellow-400 to-yellow-600';
    if (rank === 2) return 'from-gray-300 to-gray-500';
    if (rank === 3) return 'from-orange-300 to-orange-600';
    return '';
  };

  return (
    <Layout>
      <div className="space-y-8">
        <div className="animate-slideDown">
          <h1 className="text-3xl font-heading font-bold text-foreground mb-2">Leaderboard</h1>
          <p className="text-foreground-secondary">See how you rank against other students</p>
        </div>

        <div className="flex flex-col md:flex-row gap-4 card-premium p-6">
          <div className="flex gap-2">
            {(['week', 'month', 'all'] as const).map((period) => (
              <button
                key={period}
                onClick={() => setTimePeriod(period)}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                  timePeriod === period
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-foreground hover:bg-muted/80'
                }`}
              >
                {period === 'week' ? 'This Week' : period === 'month' ? 'This Month' : 'All Time'}
              </button>
            ))}
          </div>

          <div className="flex gap-2 ml-auto">
            {(['score', 'accuracy', 'streak'] as const).map((sort) => (
              <button
                key={sort}
                onClick={() => setSortBy(sort)}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition-all flex items-center gap-2 ${
                  sortBy === sort
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-foreground hover:bg-muted/80'
                }`}
              >
                {sort === 'score' && <Target className="w-4 h-4" />}
                {sort === 'accuracy' && '📊'}
                {sort === 'streak' && <Flame className="w-4 h-4" />}
                {sort === 'score' ? 'Score' : sort === 'accuracy' ? 'Accuracy' : 'Streak'}
              </button>
            ))}
          </div>
        </div>

        {isLoading && (
          <div className="card-premium p-6 text-sm text-foreground-muted animate-slideUp">Loading leaderboard...</div>
        )}

        {error && (
          <div className="card-premium p-6 text-sm text-destructive animate-slideUp">{error}</div>
        )}

        {!isLoading && !error && sortedLeaderboard.length === 0 && (
          <div className="card-premium p-6 text-sm text-foreground-muted animate-slideUp">
            No leaderboard data available yet.
          </div>
        )}

        <div className="space-y-2 animate-slideUp">
          {sortedLeaderboard.map((entry) => {
            const medalIcon = getMedalIcon(entry.rank);
            const rankColor = getRankColor(entry.rank);
            const isMe = user ? String(user.id) === entry.userId : false;

            return (
              <div
                key={entry.userId}
                className={`card-premium p-4 flex items-center justify-between hover:shadow-lg transition-all ${
                  isMe ? 'ring-2 ring-accent' : ''
                }`}
              >
                <div className="flex items-center gap-4 flex-1">
                  {medalIcon ? (
                    <div className="text-2xl">{medalIcon}</div>
                  ) : (
                    <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${rankColor || 'from-muted to-muted'} flex items-center justify-center font-bold text-sm ${rankColor ? 'text-white' : 'text-foreground'}`}>
                      {entry.rank}
                    </div>
                  )}

                  <div>
                    <p className="font-medium text-foreground">
                      {entry.userName}
                      {isMe && <span className="ml-2 text-xs badge badge-gold">You</span>}
                    </p>
                    <p className="text-xs text-foreground-muted">Active {getRelativeTime(entry.lastAttemptDate)}</p>
                  </div>
                </div>

                <div className="hidden md:flex items-center gap-8">
                  <div className="text-center">
                    <p className="text-sm font-bold text-foreground">{entry.score}</p>
                    <p className="text-xs text-foreground-muted">Score</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-bold text-accent">{entry.accuracy}%</p>
                    <p className="text-xs text-foreground-muted">Accuracy</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center gap-1 justify-center">
                      <Flame className="w-4 h-4 text-warning" />
                      <p className="text-sm font-bold text-foreground">{entry.streakDays}</p>
                    </div>
                    <p className="text-xs text-foreground-muted">Streak</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-bold text-foreground">{entry.topicsCompleted}</p>
                    <p className="text-xs text-foreground-muted">Topics</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Layout>
  );
}
