import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Coffee, Mail, Lock, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { adminLogin } from '../../services/api';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  React.useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      navigate('/admin/dashboard');
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await adminLogin(email, password);
      localStorage.setItem('adminToken', response.token);
      navigate('/admin/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#faf9f6] flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-[#5a3a22] rounded-2xl shadow-xl mb-4 text-white">
            <Coffee size={32} />
          </div>
          <h1 className="text-3xl font-bold text-[#3e2723]">Admin Portal</h1>
          <p className="text-gray-500 mt-2">Sign in to manage your cafe</p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-600 text-sm">
              <AlertCircle size={18} />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-[#3e2723] mb-2 ml-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-[#5a3a22]/20 focus:border-[#5a3a22] transition-all outline-none text-sm"
                  placeholder="admin@cafe.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#3e2723] mb-2 ml-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-12 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-[#5a3a22]/20 focus:border-[#5a3a22] transition-all outline-none text-sm"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-end">
              <button type="button" className="text-sm font-medium text-[#5a3a22] hover:underline">
                Forgot Password?
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-[#5a3a22] text-white rounded-2xl font-bold text-lg shadow-lg hover:bg-[#4a2f1b] active:scale-[0.98] transition-all disabled:opacity-70 disabled:active:scale-100 mt-2"
            >
              {loading ? 'Authenticating...' : 'Sign In'}
            </button>
          </form>
        </div>

        <button 
          onClick={() => navigate('/')}
          className="w-full mt-8 text-center text-gray-500 font-medium hover:text-[#5a3a22] transition-colors"
        >
          Back to Menu
        </button>
      </div>
    </div>
  );
};

export default Login;
