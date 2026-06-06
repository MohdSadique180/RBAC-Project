import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { contentApi } from '../api/services';
import { useAuthContext } from '../hooks/AuthContext';

function ContentCard({
  title,
  tag,
  tagAccent,
  message,
  isLoading,
  isError,
  errorMsg,
}: {
  title: string;
  tag: string;
  tagAccent?: boolean;
  message?: string;
  isLoading: boolean;
  isError: boolean;
  errorMsg?: string;
}) {
  return (
    <div className="card animate-fade-up">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-display font-semibold text-lg text-ink">{title}</h3>
        <span className={tagAccent ? 'tag-accent' : 'tag'}>{tag}</span>
      </div>
      {isLoading && (
        <div className="flex items-center gap-2 text-muted">
          <span className="w-3 h-3 border border-muted/40 border-t-muted rounded-full animate-spin" />
          <span className="font-mono text-xs">Loading...</span>
        </div>
      )}
      {isError && (
        <p className="font-mono text-xs text-accent">{errorMsg || 'Access denied or request failed'}</p>
      )}
      {!isLoading && !isError && message && (
        <p className="font-body text-sm text-muted leading-relaxed">{message}</p>
      )}
    </div>
  );
}

export default function DashboardPage() {
  const navigate = useNavigate();
  const { user, isAdmin, logout } = useAuthContext();

  const publicQuery = useQuery({
    queryKey: ['public'],
    queryFn: contentApi.getPublic,
  });

  const userQuery = useQuery({
    queryKey: ['user-content'],
    queryFn: contentApi.getUserContent,
  });

  const adminQuery = useQuery({
    queryKey: ['admin-content'],
    queryFn: contentApi.getAdminContent,
    enabled: isAdmin,
  });

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-paper">
      {/* Top nav */}
      <header className="border-b border-ink/10 bg-paper sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="font-display font-bold text-ink text-lg">Dashboard</span>
            <span className={isAdmin ? 'tag-accent' : 'tag'}>{user?.role}</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="font-display text-sm font-semibold text-ink">{user?.name}</p>
              <p className="font-mono text-xs text-muted">{user?.email}</p>
            </div>
            <button onClick={handleLogout} className="btn-ghost text-sm py-2 px-4">
              Sign out
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-12">
        {/* Welcome */}
        <div className="mb-12 animate-fade-up">
          <p className="font-mono text-xs text-muted tracking-widest uppercase mb-2">
            Welcome back
          </p>
          <h1 className="font-display text-4xl font-bold text-ink">
            {user?.name}
          </h1>
          <p className="font-body text-muted mt-2 text-sm">
            You are signed in as{' '}
            <span className="font-semibold text-ink">{user?.role}</span>. 
            Below is your authorized content.
          </p>
        </div>

        {/* Content grid */}
        <div className="space-y-4">
          {/* Public */}
          <ContentCard
            title="Public Content"
            tag="PUBLIC"
            message={publicQuery.data?.message}
            isLoading={publicQuery.isLoading}
            isError={publicQuery.isError}
            errorMsg="Could not load public content"
          />

          {/* User */}
          <ContentCard
            title="User Content"
            tag="USER"
            message={userQuery.data?.message}
            isLoading={userQuery.isLoading}
            isError={userQuery.isError}
            errorMsg="You do not have access to user content"
          />

          {/* Admin — only shown to admins */}
          {isAdmin && (
            <ContentCard
              title="Admin Content"
              tag="ADMIN"
              tagAccent
              message={adminQuery.data?.message}
              isLoading={adminQuery.isLoading}
              isError={adminQuery.isError}
              errorMsg="You do not have access to admin content"
            />
          )}

          {/* Info card for non-admins */}
          {!isAdmin && (
            <div className="card border-dashed opacity-50">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-display font-semibold text-lg text-ink">Admin Content</h3>
                <span className="tag-accent">ADMIN</span>
              </div>
              <p className="font-body text-sm text-muted">
                This section is only visible to users with the ADMIN role.
              </p>
            </div>
          )}
        </div>

        {/* Token info */}
        <div className="mt-12 pt-8 border-t border-ink/10">
          <p className="font-mono text-xs text-muted uppercase tracking-widest mb-3">Session info</p>
          <div className="flex flex-wrap gap-3">
            <div className="card flex-1 min-w-[200px]">
              <p className="font-mono text-xs text-muted mb-1">Email</p>
              <p className="font-body text-sm text-ink">{user?.email}</p>
            </div>
            <div className="card flex-1 min-w-[200px]">
              <p className="font-mono text-xs text-muted mb-1">Role</p>
              <p className="font-body text-sm text-ink">{user?.role}</p>
            </div>
            <div className="card flex-1 min-w-[200px]">
              <p className="font-mono text-xs text-muted mb-1">Auth Method</p>
              <p className="font-body text-sm text-ink">JWT Bearer Token</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
