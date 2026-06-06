import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { authApi } from '../api/services';
import { useAuthContext } from '../hooks/AuthContext';
import type { RegisterRequest } from '../types';
import axios from 'axios';

export default function RegisterPage() {
  const navigate = useNavigate();
  const { saveAuth } = useAuthContext();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterRequest & { confirmPassword: string }>();

  const password = watch('password');

  const { mutate, isPending } = useMutation({
    mutationFn: (data: RegisterRequest) => authApi.register(data),
    onSuccess: (data) => {
      saveAuth(data);
      navigate('/dashboard');
    },
    onError: (err) => {
      if (axios.isAxiosError(err)) {
        const data = err.response?.data;
        if (typeof data === 'object' && data !== null && !data.message) {
          const firstError = Object.values(data)[0];
          setServerError(String(firstError));
        } else {
          setServerError(data?.message || 'Registration failed');
        }
      } else {
        setServerError('Something went wrong');
      }
    },
  });

  const onSubmit = ({ confirmPassword: _, ...data }: RegisterRequest & { confirmPassword: string }) => {
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
            Create<br/>your<br/>account.
          </p>
          <p className="font-body text-paper/50 text-sm leading-relaxed max-w-xs">
            Choose your role during registration. USER gets standard access. ADMIN gets full system control.
          </p>
        </div>
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <span className="tag">USER</span>
            <span className="font-body text-xs text-paper/50">Standard dashboard access</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="tag-accent">ADMIN</span>
            <span className="font-body text-xs text-paper/50">Full administrative access</span>
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-sm animate-fade-up">
          <div className="mb-10">
            <h1 className="font-display text-3xl font-bold text-ink mb-2">Create account</h1>
            <p className="font-body text-muted text-sm">Fill in the details below to get started</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
            <div>
              <label className="font-mono text-xs tracking-wider text-muted uppercase block mb-2">Full Name</label>
              <input
                className="input-field"
                placeholder="Jane Doe"
                {...register('name', { required: 'Name is required' })}
              />
              {errors.name && <p className="mt-1 text-accent font-mono text-xs">{errors.name.message}</p>}
            </div>

            <div>
              <label className="font-mono text-xs tracking-wider text-muted uppercase block mb-2">Email</label>
              <input
                type="email"
                className="input-field"
                placeholder="you@example.com"
                {...register('email', {
                  required: 'Email is required',
                  pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Invalid email format' },
                })}
              />
              {errors.email && <p className="mt-1 text-accent font-mono text-xs">{errors.email.message}</p>}
            </div>

            <div>
              <label className="font-mono text-xs tracking-wider text-muted uppercase block mb-2">Password</label>
              <input
                type="password"
                className="input-field"
                placeholder="Min. 8 characters"
                {...register('password', {
                  required: 'Password is required',
                  minLength: { value: 8, message: 'Password must be at least 8 characters' },
                  pattern: {
                    value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                    message: 'Must include uppercase, lowercase, and a number',
                  },
                })}
              />
              {errors.password && <p className="mt-1 text-accent font-mono text-xs">{errors.password.message}</p>}
            </div>

            <div>
              <label className="font-mono text-xs tracking-wider text-muted uppercase block mb-2">Confirm Password</label>
              <input
                type="password"
                className="input-field"
                placeholder="Repeat password"
                {...register('confirmPassword', {
                  required: 'Please confirm your password',
                  validate: (val) => val === password || 'Passwords do not match',
                })}
              />
              {errors.confirmPassword && (
                <p className="mt-1 text-accent font-mono text-xs">{errors.confirmPassword.message}</p>
              )}
            </div>

            <div>
              <label className="font-mono text-xs tracking-wider text-muted uppercase block mb-2">Role</label>
              <select
                className="input-field cursor-pointer"
                {...register('role', { required: 'Role is required' })}
              >
                <option value="">Select a role</option>
                <option value="USER">USER — Standard access</option>
                <option value="ADMIN">ADMIN — Full access</option>
              </select>
              {errors.role && <p className="mt-1 text-accent font-mono text-xs">{errors.role.message}</p>}
            </div>

            {serverError && (
              <div className="border border-accent/30 bg-accent/5 px-4 py-3">
                <p className="font-mono text-xs text-accent">{serverError}</p>
              </div>
            )}

            <button type="submit" disabled={isPending} className="btn-primary w-full text-center mt-2">
              {isPending ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-3 h-3 border border-paper/40 border-t-paper rounded-full animate-spin" />
                  Creating account...
                </span>
              ) : (
                'Create account'
              )}
            </button>
          </form>

          <p className="mt-8 font-body text-sm text-muted text-center">
            Already have an account?{' '}
            <Link to="/login" className="text-ink underline underline-offset-2 hover:text-accent transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
