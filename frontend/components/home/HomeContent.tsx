'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAppContext } from '@/context/AppContext';
import { LoginForm } from '@/components/auth/LoginForm';
import { ThemeToggle } from '@/components/shared/ThemeToggle';
import { ArrowRight, BookOpen, Target, Trophy, Users } from 'lucide-react';

export function HomeContent() {
  const { isAuthenticated } = useAppContext();
  const router = useRouter();

  // Redirect to dashboard if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, router]);

  if (isAuthenticated) {
    return null;
  }

  return (
    <>
      {/* Navigation Bar */}
      <nav className="border-b border-border bg-card/50 backdrop-blur-sm animate-slideDown">
        <div className="container-premium py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg overflow-hidden border border-border/60 bg-card flex items-center justify-center">
              <Image
                src="/website icon.png"
                alt="examora logo"
                width={40}
                height={40}
                className="w-full h-full object-cover"
                priority
              />
            </div>
            <h1 className="font-heading font-bold text-xl text-foreground">examora</h1>
          </div>
          <ThemeToggle />
        </div>
      </nav>

      {/* Hero Section */}
      <div className="container-premium py-16 md:py-24">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left - Content */}
          <div className="space-y-6 motion-reveal" style={{ animationDelay: '120ms' }}>
            <h2 className="text-4xl md:text-5xl font-heading font-bold text-foreground leading-tight">
              Study Smart. Score Better.
            </h2>
            <p className="text-lg text-foreground-secondary leading-relaxed">
              Master India's most competitive exams with our sophisticated, AI-powered study platform. Designed for serious students who demand excellence.
            </p>

            {/* Features */}
            <div className="space-y-3 pt-4">
              {[
                { icon: BookOpen, text: 'Comprehensive Curriculum' },
                { icon: Target, text: 'Targeted Practice Questions' },
                { icon: Trophy, text: 'Performance Analytics' },
                { icon: Users, text: 'Community & Leaderboards' },
              ].map((feature, index) => (
                <div key={feature.text} className="flex items-center gap-3 motion-reveal" style={{ animationDelay: `${180 + index * 90}ms` }}>
                  <div className="w-5 h-5 text-accent">
                    <feature.icon className="w-5 h-5" />
                  </div>
                  <span className="text-foreground">{feature.text}</span>
                </div>
              ))}
            </div>

            {/* CTA Button */}
            <div className="pt-4">
              <Link
                href="/auth/register"
                className="group inline-flex items-center gap-2 px-8 py-4 bg-accent text-accent-foreground rounded-lg font-heading font-bold hover:opacity-90 transition-all text-lg motion-cta"
              >
                Get Started
                <ArrowRight className="w-5 h-5 motion-arrow" />
              </Link>
            </div>
          </div>

          {/* Right - Login Form */}
          <div className="card-premium motion-card animate-scaleIn" style={{ animationDelay: '220ms' }}>
            <h3 className="font-heading font-bold text-2xl mb-6 text-foreground">Sign In</h3>
            <LoginForm />
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="border-t border-border bg-muted/30 motion-reveal" style={{ animationDelay: '280ms' }}>
        <div className="container-premium py-16">
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { number: '50K+', label: 'Questions' },
              { number: '100+', label: 'Topics' },
              { number: '18', label: 'Exams' },
              { number: '10K+', label: 'Active Students' },
            ].map((stat, index) => (
              <div key={stat.label} className="text-center motion-reveal" style={{ animationDelay: `${340 + index * 80}ms` }}>
                <p className="text-3xl font-heading font-bold text-accent motion-float">
                  {stat.number}
                </p>
                <p className="text-foreground-muted mt-2">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Exams Showcase */}
      <div className="container-premium py-16 motion-reveal" style={{ animationDelay: '420ms' }}>
        <h2 className="text-3xl font-heading font-bold text-foreground mb-12 text-center">
          Prepare for India's Top Exams
        </h2>

        <div className="grid md:grid-cols-3 gap-4">
          {[
            'JEE Main',
            'UPSC CSE',
            'NEET-UG',
            'IBPS PO',
            'SSC CGL',
            'CLAT',
            'CAT',
            'NDA',
            'BITSAT',
          ].map((exam, index) => (
            <div
              key={exam}
              className="p-4 rounded-lg border border-border bg-card hover:border-accent hover:shadow-md transition-all text-center cursor-pointer motion-card motion-reveal"
              style={{ animationDelay: `${470 + index * 45}ms` }}
            >
              <BookOpen className="w-6 h-6 text-accent mx-auto mb-2" />
              <p className="font-medium text-foreground">{exam}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Footer CTA */}
      <div className="bg-muted/50 border-t border-border motion-reveal" style={{ animationDelay: '560ms' }}>
        <div className="container-premium py-12 text-center">
          <h3 className="text-2xl font-heading font-bold text-foreground mb-4">
            Ready to Start Your Preparation?
          </h3>
          <p className="text-foreground-muted mb-6">
            Join thousands of students preparing for their dream exams
          </p>
          <Link
            href="/auth/login"
            className="group inline-flex items-center gap-2 px-8 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:opacity-90 transition-all motion-cta"
          >
            Login to Continue
            <ArrowRight className="w-4 h-4 motion-arrow" />
          </Link>
        </div>
      </div>
    </>
  );
}
