import Link from 'next/link';
import { LoginForm } from '@/components/auth/LoginForm';

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md card-premium">
        <h1 className="font-heading font-bold text-2xl text-foreground mb-2">Login</h1>
        <p className="text-sm text-foreground-muted mb-6">
          Sign in to continue your exam preparation journey.
        </p>

        <LoginForm />

        <div className="mt-6 text-center text-sm text-foreground-muted">
          <Link href="/" className="text-accent hover:underline">
            Back to home
          </Link>
        </div>
      </div>
    </main>
  );
}
