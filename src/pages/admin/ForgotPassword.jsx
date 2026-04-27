import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Coffee, Mail, AlertCircle, ArrowLeft, CheckCircle2, ShieldCheck, Lock, Eye, EyeOff, RefreshCw } from 'lucide-react';
import { sendOTP, verifyOTP, resetPassword } from '../../services/api';

// ─── Step Indicator ───────────────────────────────────────────────────────────
const StepIndicator = ({ currentStep }) => {
  const steps = ['Email', 'OTP', 'Password'];
  return (
    <div className="flex items-center justify-center gap-2 mb-8">
      {steps.map((label, i) => {
        const step = i + 1;
        const isDone = step < currentStep;
        const isActive = step === currentStep;
        return (
          <React.Fragment key={step}>
            <div className="flex flex-col items-center gap-1">
              <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300
                ${isDone ? 'bg-green-500 text-white' : isActive ? 'bg-[#5a3a22] text-white shadow-lg scale-110' : 'bg-gray-100 text-gray-400'}`}>
                {isDone ? <CheckCircle2 size={18} /> : step}
              </div>
              <span className={`text-xs font-medium transition-colors ${isActive ? 'text-[#5a3a22]' : 'text-gray-400'}`}>
                {label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div className={`h-0.5 w-10 mb-4 rounded transition-all duration-300 ${isDone ? 'bg-green-400' : 'bg-gray-200'}`} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

// ─── OTP Input (6 individual boxes) ──────────────────────────────────────────
const OTPInput = ({ value, onChange }) => {
  const inputs = useRef([]);
  const digits = value.split('').concat(Array(6).fill('')).slice(0, 6);

  const handleChange = (e, idx) => {
    const val = e.target.value.replace(/\D/g, '').slice(-1);
    const newDigits = [...digits];
    newDigits[idx] = val;
    onChange(newDigits.join(''));
    if (val && idx < 5) inputs.current[idx + 1]?.focus();
  };

  const handleKeyDown = (e, idx) => {
    if (e.key === 'Backspace' && !digits[idx] && idx > 0) {
      inputs.current[idx - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    onChange(pasted.padEnd(6, '').slice(0, 6));
    if (pasted.length > 0) inputs.current[Math.min(pasted.length, 5)]?.focus();
    e.preventDefault();
  };

  return (
    <div className="flex gap-2 justify-center">
      {digits.map((d, i) => (
        <input
          key={i}
          ref={el => inputs.current[i] = el}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={d}
          onChange={e => handleChange(e, i)}
          onKeyDown={e => handleKeyDown(e, i)}
          onPaste={handlePaste}
          className={`w-11 h-14 text-center text-xl font-bold rounded-xl border-2 outline-none transition-all
            ${d ? 'border-[#5a3a22] bg-[#5a3a22]/5 text-[#3e2723]' : 'border-gray-200 bg-gray-50 text-gray-400'}
            focus:border-[#5a3a22] focus:ring-2 focus:ring-[#5a3a22]/20`}
        />
      ))}
    </div>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────
const ForgotPassword = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const navigate = useNavigate();

  // Countdown for resend button
  useEffect(() => {
    if (resendTimer <= 0) return;
    const id = setInterval(() => setResendTimer(t => t - 1), 1000);
    return () => clearInterval(id);
  }, [resendTimer]);

  const clearError = () => setError('');

  // ── Step 1: Send OTP ──────────────────────────────────────────────────────
  const handleSendOTP = async (e) => {
    e.preventDefault();
    clearError();
    setLoading(true);
    try {
      await sendOTP(email);
      setStep(2);
      setResendTimer(60);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send OTP. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (resendTimer > 0) return;
    clearError();
    setOtp('');
    setLoading(true);
    try {
      await sendOTP(email);
      setResendTimer(60);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to resend OTP.');
    } finally {
      setLoading(false);
    }
  };

  // ── Step 2: Verify OTP ────────────────────────────────────────────────────
  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    clearError();
    if (otp.length < 6) return setError('Please enter the complete 6-digit OTP.');
    setLoading(true);
    try {
      await verifyOTP(email, otp);
      setStep(3);
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid or expired OTP.');
    } finally {
      setLoading(false);
    }
  };

  // ── Step 3: Reset Password ─────────────────────────────────────────────────
  const handleResetPassword = async (e) => {
    e.preventDefault();
    clearError();
    if (newPassword !== confirmPassword) return setError('Passwords do not match.');
    if (newPassword.length < 6) return setError('Password must be at least 6 characters.');
    setLoading(true);
    try {
      await resetPassword(email, otp, newPassword);
      setStep(4); // success state
      setTimeout(() => navigate('/admin/login'), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reset password. OTP may have expired.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#faf9f6] flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-[#5a3a22] rounded-2xl shadow-xl mb-4 text-white">
            <Coffee size={32} />
          </div>
          <h1 className="text-3xl font-bold text-[#3e2723]">Forgot Password</h1>
          <p className="text-gray-500 mt-1 text-sm">We'll send a one-time code to your email</p>
        </div>

        {step < 4 && <StepIndicator currentStep={step} />}

        <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
          {/* Error Alert */}
          {error && (
            <div className="mb-5 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-start gap-3 text-red-600 text-sm">
              <AlertCircle size={18} className="mt-0.5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* ── STEP 1: Email ── */}
          {step === 1 && (
            <form onSubmit={handleSendOTP} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-[#3e2723] mb-2 ml-1">
                  Admin Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    id="forgot-email"
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-[#5a3a22]/20 focus:border-[#5a3a22] transition-all outline-none text-sm"
                    placeholder="admin@cafe.com"
                  />
                </div>
                <p className="text-xs text-gray-400 mt-2 ml-1">
                  A 6-digit OTP will be sent to this email.
                </p>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-[#5a3a22] text-white rounded-2xl font-bold text-base shadow-lg hover:bg-[#4a2f1b] active:scale-[0.98] transition-all disabled:opacity-60"
              >
                {loading ? 'Sending OTP...' : 'Send OTP →'}
              </button>
              <Link
                to="/admin/login"
                className="flex items-center justify-center gap-2 text-sm font-medium text-gray-400 hover:text-[#5a3a22] transition-colors"
              >
                <ArrowLeft size={15} /> Back to Login
              </Link>
            </form>
          )}

          {/* ── STEP 2: OTP ── */}
          {step === 2 && (
            <form onSubmit={handleVerifyOTP} className="space-y-6">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-amber-50 text-[#5a3a22] rounded-full mb-3">
                  <ShieldCheck size={24} />
                </div>
                <p className="text-sm text-gray-500">
                  OTP sent to <span className="font-semibold text-[#3e2723]">{email}</span>
                </p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#3e2723] mb-3 text-center">
                  Enter 6-digit OTP
                </label>
                <OTPInput value={otp} onChange={setOtp} />
              </div>

              <button
                type="submit"
                disabled={loading || otp.length < 6}
                className="w-full py-4 bg-[#5a3a22] text-white rounded-2xl font-bold text-base shadow-lg hover:bg-[#4a2f1b] active:scale-[0.98] transition-all disabled:opacity-60"
              >
                {loading ? 'Verifying...' : 'Verify OTP →'}
              </button>

              {/* Resend */}
              <div className="text-center">
                <span className="text-sm text-gray-400">Didn't receive it? </span>
                <button
                  type="button"
                  onClick={handleResendOTP}
                  disabled={resendTimer > 0 || loading}
                  className="text-sm font-semibold text-[#5a3a22] hover:underline disabled:text-gray-300 disabled:no-underline inline-flex items-center gap-1 transition-colors"
                >
                  <RefreshCw size={13} />
                  {resendTimer > 0 ? `Resend in ${resendTimer}s` : 'Resend OTP'}
                </button>
              </div>

              <button
                type="button"
                onClick={() => { setStep(1); setOtp(''); clearError(); }}
                className="flex items-center justify-center gap-2 w-full text-sm font-medium text-gray-400 hover:text-[#5a3a22] transition-colors"
              >
                <ArrowLeft size={15} /> Change email
              </button>
            </form>
          )}

          {/* ── STEP 3: New Password ── */}
          {step === 3 && (
            <form onSubmit={handleResetPassword} className="space-y-5">
              <div className="text-center mb-2">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-green-50 text-green-600 rounded-full mb-2">
                  <Lock size={22} />
                </div>
                <p className="text-sm text-gray-500">OTP verified! Set your new password.</p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#3e2723] mb-2 ml-1">New Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    id="new-password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                    className="w-full pl-11 pr-12 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-[#5a3a22]/20 focus:border-[#5a3a22] transition-all outline-none text-sm"
                    placeholder="Min. 6 characters"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(s => !s)}
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
                    id="confirm-password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    className={`w-full pl-11 pr-4 py-3.5 bg-gray-50 border-2 rounded-2xl transition-all outline-none text-sm
                      ${confirmPassword && (confirmPassword === newPassword ? 'border-green-400 bg-green-50/30' : 'border-red-300 bg-red-50/30')}
                      ${!confirmPassword ? 'border-gray-200' : ''}
                      focus:ring-2 focus:ring-[#5a3a22]/20 focus:border-[#5a3a22]`}
                    placeholder="Repeat password"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-[#5a3a22] text-white rounded-2xl font-bold text-base shadow-lg hover:bg-[#4a2f1b] active:scale-[0.98] transition-all disabled:opacity-60 mt-2"
              >
                {loading ? 'Resetting...' : 'Reset Password ✓'}
              </button>
            </form>
          )}

          {/* ── STEP 4: Success ── */}
          {step === 4 && (
            <div className="text-center py-4">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-50 text-green-500 rounded-full mb-4">
                <CheckCircle2 size={36} />
              </div>
              <h3 className="text-xl font-bold text-[#3e2723] mb-2">Password Reset!</h3>
              <p className="text-gray-500 text-sm mb-6">
                Your password has been updated successfully. Redirecting to login...
              </p>
              <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                <div className="bg-[#5a3a22] h-1.5 rounded-full animate-[progress_3s_linear_forwards]" style={{ width: '100%', animation: 'shrink 3s linear forwards' }} />
              </div>
              <button
                onClick={() => navigate('/admin/login')}
                className="mt-6 w-full py-4 bg-[#5a3a22] text-white rounded-2xl font-bold text-base shadow-lg hover:bg-[#4a2f1b] transition-all"
              >
                Go to Login
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
