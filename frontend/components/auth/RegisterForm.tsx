'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { isValidEmail } from '@/lib/utils';
import { registerAndLogin } from '@/services/authService';
import { useAppContext } from '@/context/AppContext';
import { ApiError } from '@/lib/api/client';

interface RegisterFormState {
  name: string;
  email: string;
  password: string;
  role: 'student' | 'teacher';
}

interface FormErrors {
  name?: string;
  email?: string;
  password?: string;
}

export function RegisterForm() {
  const router = useRouter();
  const { setAuthSession } = useAppContext();

  const [form, setForm] = useState<RegisterFormState>({
    name: '',
    email: '',
    password: '',
    role: 'student',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const validate = (): boolean => {
    const nextErrors: FormErrors = {};

    if (!form.name.trim()) {
      nextErrors.name = 'Name is required';
    }

    if (!form.email.trim()) {
      nextErrors.email = 'Email is required';
    } else if (!isValidEmail(form.email)) {
      nextErrors.email = 'Please enter a valid email';
    }

    if (!form.password.trim()) {
      nextErrors.password = 'Password is required';
    } else if (form.password.length < 8) {
      nextErrors.password = 'Password must be at least 8 characters';
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const updateField = <K extends keyof RegisterFormState>(key: K, value: RegisterFormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [key]: undefined }));
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    setServerError(null);
    setSuccessMessage(null);

    try {
      const session = await registerAndLogin({
        name: form.name,
        email: form.email,
        password: form.password,
        role: form.role,
      });

      setAuthSession(session);
      setSuccessMessage('Account created successfully. Redirecting...');
      router.push('/exam-selection');
    } catch (error) {
      if (error instanceof ApiError) {
        setServerError(error.message);
      } else {
        setServerError('Unable to register right now. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">Full Name</label>
        <input
          type="text"
          value={form.name}
          onChange={(event) => updateField('name', event.target.value)}
          placeholder="Your full name"
          className="input-premium"
          disabled={isLoading}
        />
        {errors.name && <p className="text-xs text-destructive mt-1">{errors.name}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-2">Email Address</label>
        <input
          type="email"
          value={form.email}
          onChange={(event) => updateField('email', event.target.value)}
          placeholder="you@example.com"
          className="input-premium"
          disabled={isLoading}
        />
        {errors.email && <p className="text-xs text-destructive mt-1">{errors.email}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-2">Password</label>
        <input
          type="password"
          value={form.password}
          onChange={(event) => updateField('password', event.target.value)}
          placeholder="Minimum 8 characters"
          className="input-premium"
          disabled={isLoading}
        />
        {errors.password && <p className="text-xs text-destructive mt-1">{errors.password}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-2">Role</label>
        <select
          value={form.role}
          onChange={(event) => updateField('role', event.target.value as 'student' | 'teacher')}
          className="input-premium"
          disabled={isLoading}
        >
          <option value="student">Student</option>
          <option value="teacher">Teacher</option>
        </select>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full btn-premium disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? 'Creating account...' : 'Create Account'}
      </button>

      {serverError && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {serverError}
        </div>
      )}

      {successMessage && (
        <div className="rounded-lg border border-success/30 bg-success/10 px-3 py-2 text-sm text-success">
          {successMessage}
        </div>
      )}

      <div className="text-sm text-foreground-muted text-center pt-4 border-t border-border">
        <span>Already have an account? </span>
        <Link href="/auth/login" className="text-accent hover:underline font-medium">
          Login
        </Link>
      </div>
    </form>
  );
}
