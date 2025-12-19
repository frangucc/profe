import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../App';
import { LogIn } from 'lucide-react';
import api from '../../utils/api';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = await api.login(email, password);
      login(data.user);
    } catch (err) {
      setError(err.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  const quickLogin = (userType) => {
    const demoUsers = {
      player: { email: 'player@profe.com', password: 'player123' },
      coach: { email: 'coach@profe.com', password: 'coach123' },
      admin: { email: 'admin@profe.com', password: 'admin123' }
    };
    const user = demoUsers[userType];
    setEmail(user.email);
    setPassword(user.password);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-primary-500 to-primary-700">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">ProFe</h1>
          <p className="text-primary-100">Soccer Mentorship Platform</p>
        </div>

        <div className="card">
          <div className="flex items-center justify-center mb-6">
            <LogIn className="w-12 h-12 text-primary-600" />
          </div>

          <h2 className="text-2xl font-bold text-center mb-6">Welcome Back</h2>

          {error && (
            <div className="bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 p-3 rounded-lg mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <input
                type="email"
                className="input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Password</label>
              <input
                type="password"
                className="input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-50">
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-6">
            <p className="text-sm text-gray-600 dark:text-gray-400 text-center mb-3">
              Quick Login (Demo):
            </p>
            <div className="flex flex-col gap-2">
              <button
                onClick={() => quickLogin('player')}
                className="btn-secondary text-sm"
              >
                Login as Player
              </button>
              <button
                onClick={() => quickLogin('coach')}
                className="btn-secondary text-sm"
              >
                Login as Coach
              </button>
              <button
                onClick={() => quickLogin('admin')}
                className="btn-secondary text-sm"
              >
                Login as Admin
              </button>
            </div>
          </div>

          <p className="text-center mt-6 text-sm">
            Don't have an account?{' '}
            <Link to="/register" className="text-primary-600 hover:text-primary-700 font-medium">
              Register here
            </Link>
          </p>
        </div>

        <div className="mt-6 text-center text-sm text-primary-100">
          <p>Demo Credentials:</p>
          <p>Player: player@profe.com / player123</p>
          <p>Coach: coach@profe.com / coach123</p>
          <p>Admin: admin@profe.com / admin123</p>
        </div>
      </div>
    </div>
  );
}

export default Login;
