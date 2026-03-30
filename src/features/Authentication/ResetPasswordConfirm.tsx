import React, { useState, useEffect } from 'react';
import { Lock, CheckCircle, AlertCircle } from 'lucide-react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import settingApiCall from '../../services/SettingApiCall';
import Button from '../../ui/Button';
import StrengthMeter from '../profileSetting/PasswordStrengthMeter';

function ResetPasswordConfirm() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const token = searchParams.get('token');
  const email = searchParams.get('email');

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Calculate password strength
  const strength = React.useMemo(() => {
    const pwd = newPassword || '';
    let score = 0;

    if (pwd.length > 0) score += Math.min(30, pwd.length * 2);
    if (/[a-z]/.test(pwd)) score += 10;
    if (/[A-Z]/.test(pwd)) score += 10;
    if (/[0-9]/.test(pwd)) score += 10;
    if (/[^A-Za-z0-9]/.test(pwd)) score += 20;

    return Math.min(100, score);
  }, [newPassword]);

  useEffect(() => {
    if (!token || !email) {
      setErrors({ form: 'Invalid reset link' });
    }
  }, [token, email]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { [key: string]: string } = {};

    if (!newPassword) {
      newErrors.newPassword = 'Please enter a new password';
    } else if (newPassword.length < 8) {
      newErrors.newPassword = 'Password must be at least 8 characters';
    } else if (!/\d/.test(newPassword)) {
      newErrors.newPassword = 'Password must contain at least one number';
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    }

    if (newPassword && confirmPassword && newPassword !== confirmPassword) {
      newErrors.form = 'Passwords do not match';
    }

    if (strength < 40) {
      newErrors.form = 'Password is not strong enough';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) return;

    if (!token) {
      setErrors({ form: 'Invalid reset link' });
      return;
    }

    setIsLoading(true);
    const response = await settingApiCall.confirmPasswordReset(
      token,
      newPassword,
      confirmPassword
    );
    setIsLoading(false);

    if (response.success) {
      setSuccess(true);
      setTimeout(() => {
        navigate('/signin');
      }, 2000);
    } else {
      setErrors({ form: response.error || 'Failed to reset password' });
    }
  };

  if (!token || !email) {
    return (
      <div className="w-full max-w-md mx-auto p-6 bg-card rounded-2xl border border-default shadow-soft">
        <div className="flex items-center justify-center mb-4">
          <AlertCircle size={48} className="text-red-600" />
        </div>
        <h2 className="text-center font-ui-lg-bold text-primary mb-2">
          Invalid Link
        </h2>
        <p className="text-center text-muted mb-6">
          This password reset link is invalid or has expired.
        </p>
        <button
          onClick={() => navigate('/forgot')}
          className="w-full px-4 py-2 rounded-lg bg-primary text-white hover:bg-primary-600 transition-colors"
        >
          Request New Link
        </button>
      </div>
    );
  }

  if (success) {
    return (
      <div className="w-full max-w-md mx-auto p-6 bg-card rounded-2xl border border-default shadow-soft">
        <div className="flex items-center justify-center mb-4">
          <CheckCircle size={48} className="text-green-600" />
        </div>
        <h2 className="text-center font-ui-lg-bold text-primary mb-2">
          Password Reset Successful
        </h2>
        <p className="text-center text-muted mb-6">
          Your password has been successfully reset. Redirecting to login...
        </p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-card rounded-2xl border border-default shadow-soft">
      <h2 className="font-ui-lg-bold text-primary mb-2">Set New Password</h2>
      <p className="text-muted text-sm mb-6">
        Enter your new password for {email}
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* New Password Input */}
        <div>
          <label htmlFor="newPassword" className="block text-sm font-ui-sm-bold text-primary mb-2">
            New Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-3 text-muted" size={18} />
            <input
              id="newPassword"
              type="password"
              value={newPassword}
              onChange={(e) => {
                setNewPassword(e.target.value);
                if (errors.newPassword) {
                  setErrors((prev) => ({ ...prev, newPassword: '' }));
                }
              }}
              placeholder="Enter new password"
              className="w-full pl-10 pr-3 py-3 bg-default border border-default rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/50 text-primary placeholder-muted transition-all"
              disabled={isLoading}
            />
          </div>
          {errors.newPassword && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
              {errors.newPassword}
            </p>
          )}
          {newPassword && <StrengthMeter value={strength} />}
        </div>

        {/* Confirm Password Input */}
        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-ui-sm-bold text-primary mb-2">
            Confirm Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-3 text-muted" size={18} />
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                if (errors.confirmPassword) {
                  setErrors((prev) => ({ ...prev, confirmPassword: '' }));
                }
              }}
              placeholder="Confirm new password"
              className="w-full pl-10 pr-3 py-3 bg-default border border-default rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/50 text-primary placeholder-muted transition-all"
              disabled={isLoading}
            />
          </div>
          {errors.confirmPassword && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
              {errors.confirmPassword}
            </p>
          )}
        </div>

        {/* Error Message */}
        {errors.form && (
          <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-lg">
            <AlertCircle size={18} className="text-red-600 dark:text-red-400 shrink-0" />
            <p className="text-sm text-red-800 dark:text-red-200">{errors.form}</p>
          </div>
        )}

        {/* Submit Button */}
        <div className="flex gap-3 pt-2">
          <Button
            type="submit"
            loading={isLoading}
            className="flex-1"
          >
            Reset Password
          </Button>
        </div>
      </form>
    </div>
  );
}

export default ResetPasswordConfirm;
