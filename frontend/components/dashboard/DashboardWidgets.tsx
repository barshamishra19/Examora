'use client';

import React from 'react';
import { Test, WeakArea, StrongArea } from '@/types/index';
import { formatDate, formatTime, getAccuracyColor, getAccuracyLevel } from '@/lib/utils';
import { Clock, CheckCircle, AlertCircle, TrendingUp } from 'lucide-react';

export function UpcomingTests({ tests }: { tests: Test[] }) {
  return (
    <div className="card-premium motion-card space-y-4">
      <h3 className="font-heading font-bold text-lg text-foreground">Upcoming Tests</h3>

      <div className="space-y-3">
        {tests.map((test) => (
          <div key={test.id} className="flex items-start justify-between p-3 rounded-lg bg-muted hover:bg-muted/80 transition-colors motion-card">
            <div className="flex-1">
              <p className="font-medium text-foreground">{test.title}</p>
              <div className="flex items-center gap-4 mt-2 text-xs text-foreground-muted">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {formatDate(test.date)}
                </span>
                <span className="flex items-center gap-1">
                  {formatTime(test.duration)}
                </span>
                <span className="badge badge-primary capitalize">{test.type}</span>
              </div>
            </div>
            <button className="px-3 py-1.5 bg-primary text-primary-foreground rounded text-xs font-medium hover:opacity-90 transition-opacity motion-cta">
              Start
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export function WeakAreasWidget({ areas }: { areas: WeakArea[] }) {
  return (
    <div className="card-premium motion-card space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-heading font-bold text-lg text-foreground">Areas to Focus</h3>
        <AlertCircle className="w-5 h-5 text-error" />
      </div>

      <div className="space-y-3">
        {areas.map((area) => (
          <div key={area.subjectId} className="space-y-2 motion-reveal">
            <div className="flex items-center justify-between">
              <p className="font-medium text-foreground text-sm">{area.subjectName}</p>
              <span className={`text-sm font-bold ${getAccuracyColor(area.accuracy)}`}>
                {Math.round(area.accuracy)}%
              </span>
            </div>
            <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-error to-warning transition-all duration-500"
                style={{ width: `${area.accuracy}%` }}
              />
            </div>
            <p className="text-xs text-foreground-muted">{area.questionsAttempted} questions</p>
          </div>
        ))}
      </div>

      <button className="w-full mt-4 px-4 py-2 rounded-lg border border-border text-foreground hover:bg-muted transition-colors text-sm font-medium motion-cta">
        Create Focus Plan
      </button>
    </div>
  );
}

export function StrongAreasWidget({ areas }: { areas: StrongArea[] }) {
  return (
    <div className="card-premium motion-card space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-heading font-bold text-lg text-foreground">Your Strengths</h3>
        <TrendingUp className="w-5 h-5 text-success" />
      </div>

      <div className="space-y-3">
        {areas.map((area) => (
          <div key={area.subjectId} className="space-y-2 motion-reveal">
            <div className="flex items-center justify-between">
              <p className="font-medium text-foreground text-sm">{area.subjectName}</p>
              <span className={`text-sm font-bold ${getAccuracyColor(area.accuracy)}`}>
                {Math.round(area.accuracy)}%
              </span>
            </div>
            <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-success to-primary transition-all duration-500"
                style={{ width: `${area.accuracy}%` }}
              />
            </div>
            <p className="text-xs text-foreground-muted">{area.questionsAttempted} questions</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export function TopicFocusWidget() {
  return (
    <div className="card-premium motion-card space-y-4">
      <h3 className="font-heading font-bold text-lg text-foreground">Current Focus</h3>

      <div className="bg-muted rounded-lg p-4 space-y-3">
        <p className="font-medium text-foreground">Rotational Motion</p>
        <p className="text-sm text-foreground-muted">40% complete - Keep it up!</p>

        <div className="w-full h-2 bg-background rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-warning to-error transition-all duration-500"
            style={{ width: '40%' }}
          />
        </div>

        <div className="flex gap-2 pt-2">
          <button className="flex-1 px-3 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-medium hover:opacity-90 transition-opacity motion-cta">
            Resume
          </button>
          <button className="flex-1 px-3 py-2 rounded-lg border border-border text-foreground text-xs font-medium hover:bg-muted transition-colors">
            Change
          </button>
        </div>
      </div>
    </div>
  );
}
