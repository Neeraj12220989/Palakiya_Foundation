import { useState } from 'react';
import { useNavigate, Navigate, Link } from 'react-router-dom';
import { Heart, Lock, Mail, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';

const AdminLogin = () => {
  const { login, admin } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: 'admin@ngo.org', password: 'admin123' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (admin) return <Navigate to="/admin" replace />;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(form.email, form.password);
      navigate('/admin');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-hero-grid p-5">
      <div className="pointer-events-none absolute -top-32 right-0 h-96 w-96 rounded-full bg-brand-200/40 blur-3xl" />
      <div className="relative w-full max-w-md">
        <div className="mb-6 text-center">
          <Link to="/" className="inline-flex items-center gap-3">
  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white shadow-md dark:bg-ink-800">
    <img
      src="/favicon.svg"
      alt="Logo"
      className="h-8 w-8 object-contain"
    />
  </div>
  <span className="font-display text-xl font-extrabold text-ink-900 dark:text-white">
    Palakiya
  </span>
</Link>
        </div>

        <div className="card p-8">
          <h1 className="text-2xl font-extrabold text-ink-900">Admin Login</h1>
          <p className="mt-1 text-sm text-ink-500">Sign in to manage your website content.</p>

          {error && (
            <p className="mt-5 rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
              {error}
            </p>
          )}

          <form onSubmit={handleSubmit} className="mt-6 space-y-5">
            <div>
              <label className="label">Email</label>
              <div className="relative">
                <Mail size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400" />
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                  className="input pl-11"
                  placeholder="admin@ngo.org"
                />
              </div>
            </div>
            <div>
              <label className="label">Password</label>
              <div className="relative">
                <Lock size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400" />
                <input
                  type="password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  required
                  className="input pl-11"
                  placeholder="â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢"
                />
              </div>
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full">
              {loading ? 'Signing in...' : 'Sign In'}
              {!loading && <ArrowRight size={18} />}
            </button>
          </form>

          <p className="mt-5 rounded-xl bg-ink-50 px-4 py-3 text-center text-xs text-ink-500">
            Demo credentials are pre-filled admin@ngo.org / admin123
          </p>
        </div>

        <p className="mt-5 text-center text-sm">
          <Link to="/" className="font-semibold text-ink-500 hover:text-brand-600">
             Back to website
          </Link>
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;

