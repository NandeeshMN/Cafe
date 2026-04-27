import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Coffee, Lock, AlertCircle, Eye, EyeOff, CheckCircle2 } from 'lucide-react';
import { resetPassword } from '../../services/api';

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState('');
  
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const tokenParam = queryParams.get('token');
    if (!tokenParam) {
      setError('Invalid or missing reset token.');
    } else {
      setToken(tokenParam);
    }
  }, [location]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (newPassword !== confirmPassword) {
      return setError('Passwords do not match');
    }

    if (newPassword.length < 6) {
      return setError('Password must be at least 6 characters long');
    }

    setLoading(true);

    try {
      const response = await resetPassword(token, newPassword);
      setSuccess(response.message);
      setTimeout(() => {
        navigate('/admin/login');
      }, 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reset password. The link may have expired.');
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
          <h1 className="text-3xl font-bold text-[#3e2723]">Set New Password</h1>
          <p className="text-gray-500 mt-2">Enter your new secure password</p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-600 text-sm">
              <AlertCircle size={18} />
              {error}
            </div>
          )}

          {success ? (
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-green-50 text-green-600 rounded-full mb-4">
                <CheckCircle2 size={24} />
              </div>
              <p className="text-[#3e2723] font-medium mb-4">{success}</p>
              <p className="text-gray-500 text-sm mb-6">Redirecting to login page...</p>
              <button
                onClick={() => navigate('/admin/login')}
                className="w-full py-4 bg-[#5a3a22] text-white rounded-2xl font-bold text-lg shadow-lg hover:bg-[#4a2f1b] transition-all"
              >
                Go to Login
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-[#3e2723] mb-2 ml-1">New Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
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

              <div>
                <label className="block text-sm font-semibold text-[#3e2723] mb-2 ml-1">Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full pl-11 pr-12 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-[#5a3a22]/20 focus:border-[#5a3a22] transition-all outline-none text-sm"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || !token}
                className="w-full py-4 bg-[#5a3a22] text-white rounded-2xl font-bold text-lg shadow-lg hover:bg-[#4a2f1b] active:scale-[0.98] transition-all disabled:opacity-70 disabled:active:scale-100 mt-2"
              >
                {loading ? 'Updating Password...' : 'Reset Password'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
