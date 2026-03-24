'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppContext } from '@/context/AppContext';
import { Layout } from '@/components/shared/Layout';
import { SearchInput } from '@/components/shared/SearchInput';
import { Exam } from '@/types/index';
import { listExams } from '@/services/examService';
import { ApiError } from '@/lib/api/client';

export default function ExamSelectionPage() {
  const router = useRouter();
  const { setSelectedExam } = useAppContext();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedExamId, setSelectedExamId] = useState<number | null>(null);
  const [exams, setExams] = useState<Exam[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadExams() {
      setIsLoading(true);
      setError(null);

      try {
        const apiExams = await listExams();
        const normalized: Exam[] = apiExams.map((exam) => ({
          id: exam.id,
          name: exam.name,
          category: exam.category,
          description: exam.description,
        }));
        setExams(normalized);
      } catch (err) {
        if (err instanceof ApiError) {
          setError(err.message);
        } else {
          setError('Unable to load exams right now.');
        }
      } finally {
        setIsLoading(false);
      }
    }

    loadExams();
  }, []);

  // Filter exams based on search query
  const filteredExams = useMemo(() => {
    if (!searchQuery.trim()) {
      return exams;
    }

    const normalizedQuery = searchQuery.toLowerCase();
    return exams.filter((exam) => {
      return (
        exam.name.toLowerCase().includes(normalizedQuery) ||
        exam.description.toLowerCase().includes(normalizedQuery)
      );
    });
  }, [searchQuery, exams]);

  const handleSelectExam = (examId: number) => {
    setSelectedExamId(examId);
  };

  const handleContinue = () => {
    if (!selectedExamId) return;

    const selectedExam = exams.find((exam) => exam.id === selectedExamId);

    if (selectedExam) {
      setSelectedExam(selectedExam);
      router.push('/dashboard');
    }
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-heading font-bold text-foreground mb-4">
            Choose Your Exam
          </h1>
          <p className="text-lg text-foreground-secondary">
            Select the exam you want to prepare for and start your journey to success
          </p>
        </div>

        {/* Search */}
        <div className="mb-8">
          <SearchInput
            placeholder="Search exams..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onClear={() => setSearchQuery('')}
          />
        </div>

        {isLoading && (
          <div className="card-premium p-6 text-sm text-foreground-muted">Loading exams...</div>
        )}

        {error && (
          <div className="card-premium p-6 text-sm text-destructive">{error}</div>
        )}

        {/* Exams */}
        {!isLoading && !error && filteredExams.length > 0 ? (
          <div className="grid md:grid-cols-2 gap-4 mb-12">
            {filteredExams.map((exam) => (
              <button
                key={exam.id}
                onClick={() => handleSelectExam(Number(exam.id))}
                className={`text-left p-5 rounded-lg border transition-all ${
                  selectedExamId === Number(exam.id)
                    ? 'border-accent bg-accent/5'
                    : 'border-border hover:border-accent'
                }`}
              >
                <h3 className="font-heading font-bold text-lg text-foreground">{exam.name}</h3>
                <p className="text-sm text-foreground-muted mt-2">{exam.description}</p>
                <p className="text-xs text-foreground-muted mt-3 uppercase tracking-wide">{exam.category}</p>
              </button>
            ))}
          </div>
        ) : (
          !isLoading && !error && <div className="text-center py-12">
            <p className="text-lg text-foreground-muted mb-4">
              No exams found for "{searchQuery}"
            </p>
            <button
              onClick={() => setSearchQuery('')}
              className="text-primary hover:text-primary/80 underline"
            >
              Clear search
            </button>
          </div>
        )}

        {/* CTA */}
        {selectedExamId && (
          <div className="sticky bottom-0 left-0 right-0 bg-background pt-6 pb-4">
            <div className="max-w-4xl mx-auto px-4 flex gap-4">
              <button
                onClick={() => setSelectedExamId(null)}
                className="flex-1 px-6 py-3 rounded-lg border border-border text-foreground hover:bg-muted transition-colors font-medium"
              >
                Clear Selection
              </button>
              <button
                onClick={handleContinue}
                className="flex-1 btn-premium"
              >
                Continue to Dashboard
              </button>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
