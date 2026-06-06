import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { authApi } from '../api/services';
import { useAuthContext } from '../hooks/AuthContext';
import type { LoginRequest } from '../types';
import axios from 'axios';

export default function LoginPage() {
  const navigate = useNavigate();
  const { saveAuth } = useAuthContext();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginRequest>();

  const { mutate, isPending } = useMutation({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      saveAuth(data);
      navigate('/dashboard');
    },
    onError: (err) => {
      if (axios.isAxiosError(err)) {
        setServerError(err.response?.data?.message || 'Invalid credentials');
      } else {
        setServerError('Something went wrong');
      }
    },
  });

  const onSubmit = (data: LoginRequest) => {
    setServerError(null);
    mutate(data);
  };

  return (
    <div className="min-h-screen bg-paper flex">
      {/* Left panel */}
      <div className="hidden lg:flex flex-col justify-between w-2/5 bg-ink p-12">
        <div>
          <span className="font-mono text-xs text-paper/40 tracking-widest uppercase">RBAC System</span>
        </div>
        <div>
          <p className="font-display text-5xl font-bold text-paper leading-tight mb-6">
            Access<br/>control<br/>simplified.
          </p>
          <p className="font-body text-paper/50 text-sm leading-relaxed max-w-xs">
            Role-based access control with JWT authentication. Secure, stateless, and straightforward.
          </p>
        </div>
        <div className="flex gap-3">
          <span className="tag-accent">JWT</span>
          <span className="tag">Spring Boot</span>
          <span className="tag">React</span>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-sm animate-fade-up">
          <div className="mb-10">
            <h1 className="font-display text-3xl font-bold text-ink mb-2">Sign in</h1>
            <p className="font-body text-muted text-sm">Enter your credentials to continue</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
            <div>
              <label className="font-mono text-xs tracking-wider text-muted uppercase block mb-2">
                Email
              </label>
              <input
                type="email"
                className="input-field"
                placeholder="you@example.com"
                {...register('email', {
                  required: 'Email is required',
                  pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Invalid email' },
                })}
              />
              {errors.email && (
                <p className="mt-1 text-accent font-mono text-xs">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label className="font-mono text-xs tracking-wider text-muted uppercase block mb-2">
                Password
              </label>
              <input
                type="password"
                className="input-field"
                placeholder="••••••••"
                {...register('password', { required: 'Password is required' })}
              />
              {errors.password && (
                <p className="mt-1 text-accent font-mono text-xs">{errors.password.message}</p>
              )}
            </div>

            {serverError && (
              <div className="border border-accent/30 bg-accent/5 px-4 py-3">
                <p className="font-mono text-xs text-accent">{serverError}</p>
              </div>
            )}

            <button type="submit" disabled={isPending} className="btn-primary w-full text-center">
              {isPending ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-3 h-3 border border-paper/40 border-t-paper rounded-full animate-spin" />
                  Signing in...
                </span>
              ) : (
                'Sign in'
              )}
            </button>
          </form>

          <p className="mt-8 font-body text-sm text-muted text-center">
            No account?{' '}
            <Link to="/register" className="text-ink underline underline-offset-2 hover:text-accent transition-colors">
              Register here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
