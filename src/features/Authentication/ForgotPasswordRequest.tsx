import React, { useState } from 'react';
import { Mail, CheckCircle, AlertCircle } from 'lucide-react';
import settingApiCall from '../../services/SettingApiCall';
import Button from '../../ui/Button';

function ForgotPasswordRequest() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }

    setIsLoading(true);
    const response = await settingApiCall.requestPasswordReset(email);
    setIsLoading(false);

    if (response.success) {
      setSubmitted(true);
      setEmail('');
    } else {
      setError(response.error || 'Failed to request password reset');
    }
  };

  if (submitted) {
    return (
      <div className="w-full max-w-md mx-auto p-6 bg-card rounded-2xl border border-default shadow-soft">
        <div className="flex items-center justify-center mb-4">
          <CheckCircle size={48} className="text-green-600" />
        </div>
        <h2 className="text-center font-ui-lg-bold text-primary mb-2">
          Check Your Email
        </h2>
        <p className="text-center text-muted mb-6">
          We've sent a password reset link to <strong>{email}</strong>. It will expire in 1 hour.
        </p>
        <p className="text-center text-sm text-muted mb-6">
          If you don't see the email, check your spam folder.
        </p>
        <button
          onClick={() => setSubmitted(false)}
          className="w-full px-4 py-2 text-center rounded-lg border border-default hover:bg-default transition-colors"
        >
          Back
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-card rounded-2xl border border-default shadow-soft">
      <h2 className="font-ui-lg-bold text-primary mb-4">Reset Password</h2>
      <p className="text-muted text-sm mb-6">
        Enter your email address and we'll send you a link to reset your password.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email Input */}
        <div>
          <label htmlFor="email" className="block text-sm font-ui-sm-bold text-primary mb-2">
            Email Address
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-3 text-muted" size={18} />
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError(null);
              }}
              placeholder="Enter your email"
              className="w-full pl-10 pr-3 py-3 bg-default border border-default rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/50 text-primary placeholder-muted transition-all"
              disabled={isLoading}
            />
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-lg">
            <AlertCircle size={18} className="text-red-600 dark:text-red-400 shrink-0" />
            <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
          </div>
        )}

        {/* Submit Button */}
        <div className="flex gap-3 pt-2">
          <Button
            type="submit"
            loading={isLoading}
            className="flex-1"
          >
            Send Reset Link
          </Button>
        </div>
      </form>

      <div className="mt-6 pt-6 border-t border-default">
        <p className="text-center text-sm text-muted">
          Remember your password?{' '}
          <a href="/signin" className="text-primary hover:underline">
            Sign in
          </a>
        </p>
      </div>
    </div>
  );
}

export default ForgotPasswordRequest;
