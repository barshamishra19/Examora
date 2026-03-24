'use client';

import React, { useEffect, useState } from 'react';
import { Layout } from '@/components/shared/Layout';
import { useAppContext } from '@/context/AppContext';
import { Users, Plus, BarChart3 } from 'lucide-react';
import { ApiError } from '@/lib/api/client';
import { createServer, listServerMembers, listServers } from '@/services/serverService';

type ClassBatch = {
  id: number;
  name: string;
  description?: string;
  studentCount: number;
};

export default function TeacherPage() {
  const { user, accessToken } = useAppContext();
  const [showNewBatch, setShowNewBatch] = useState(false);
  const [batchName, setBatchName] = useState('');
  const [batchDescription, setBatchDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [classBatches, setClassBatches] = useState<ClassBatch[]>([]);

  useEffect(() => {
    async function loadTeacherData() {
      if (user?.role !== 'teacher') {
        return;
      }

      if (!accessToken) {
        setError('Please login again to load your classes.');
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const servers = await listServers(accessToken);

        const batches = await Promise.all(
          servers.map(async (server) => {
            const members = await listServerMembers(server.id, accessToken);
            const studentCount = members.filter((m) => m.role === 'student').length;

            return {
              id: server.id,
              name: server.name,
              description: server.description,
              studentCount,
            } satisfies ClassBatch;
          })
        );

        setClassBatches(batches);
      } catch (err) {
        if (err instanceof ApiError) {
          setError(err.message);
        } else {
          setError('Unable to load classes right now.');
        }
      } finally {
        setIsLoading(false);
      }
    }

    loadTeacherData();
  }, [user?.role, accessToken]);

  async function handleCreateBatch() {
    if (!accessToken) {
      setError('Please login again to create a class.');
      return;
    }

    if (!batchName.trim()) {
      setError('Batch name is required.');
      return;
    }

    setIsCreating(true);
    setError(null);

    try {
      const created = await createServer(
        {
          name: batchName.trim(),
          description: batchDescription.trim(),
        },
        accessToken
      );

      setClassBatches((prev) => [
        ...prev,
        {
          id: created.id,
          name: created.name,
          description: created.description,
          studentCount: 0,
        },
      ]);

      setBatchName('');
      setBatchDescription('');
      setShowNewBatch(false);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError('Unable to create class right now.');
      }
    } finally {
      setIsCreating(false);
    }
  }

  if (user?.role !== 'teacher') {
    return (
      <Layout>
        <div className="text-center py-12">
          <p className="text-lg text-foreground-muted mb-6">Teacher access only</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-8">
        <div className="flex items-center justify-between animate-slideDown">
          <div>
            <h1 className="text-3xl font-heading font-bold text-foreground mb-2">Class Management</h1>
            <p className="text-foreground-secondary">Manage your batches and student performance</p>
          </div>
          <button onClick={() => setShowNewBatch(true)} className="btn-premium flex items-center gap-2">
            <Plus className="w-5 h-5" />
            New Batch
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-6 animate-slideUp">
          {isLoading && (
            <div className="card-premium p-6 text-sm text-foreground-muted">Loading classes...</div>
          )}

          {error && (
            <div className="card-premium p-6 text-sm text-destructive">{error}</div>
          )}

          {!isLoading && !error && classBatches.length === 0 && (
            <div className="card-premium p-6 text-sm text-foreground-muted">
              No classes yet. Create your first batch.
            </div>
          )}

          {classBatches.map((batch) => (
            <div key={batch.id} className="card-premium p-6 space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-heading font-bold text-lg text-foreground">{batch.name}</h3>
                  <p className="text-sm text-foreground-muted mt-1">{batch.description || 'No description'}</p>
                </div>
                <Users className="w-5 h-5 text-accent flex-shrink-0" />
              </div>

              <div className="py-4 border-y border-border">
                <p className="text-2xl font-bold text-foreground">{batch.studentCount}</p>
                <p className="text-xs text-foreground-muted">Students</p>
              </div>

              <div className="flex gap-2">
                <button className="flex-1 px-4 py-2 rounded-lg border border-border text-foreground hover:bg-muted transition-colors text-sm font-medium">
                  View Students
                </button>
                <button className="flex-1 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition-opacity text-sm font-medium flex items-center justify-center gap-2">
                  <BarChart3 className="w-4 h-4" />
                  Analytics
                </button>
              </div>
            </div>
          ))}
        </div>

        {showNewBatch && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="card-premium p-8 max-w-md w-full space-y-4">
              <h2 className="font-heading font-bold text-xl text-foreground">Create New Batch</h2>

              <div className="space-y-3">
                <input
                  value={batchName}
                  onChange={(e) => setBatchName(e.target.value)}
                  placeholder="Batch name"
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
                />
                <textarea
                  value={batchDescription}
                  onChange={(e) => setBatchDescription(e.target.value)}
                  placeholder="Description (optional)"
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm min-h-24"
                />
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setShowNewBatch(false)}
                  className="w-full px-4 py-2 rounded-lg border border-border text-foreground hover:bg-muted transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateBatch}
                  disabled={isCreating}
                  className="w-full px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition-opacity disabled:opacity-70"
                >
                  {isCreating ? 'Creating...' : 'Create'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
