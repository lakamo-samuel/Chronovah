import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, AlertCircle } from 'lucide-react';
import { protectedAxios } from '../../axios';
import { useAuth } from '../hooks/useAuth';

const UpgradePage: React.FC = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>(
    'monthly'
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      navigate('/signin', { state: { from: '/upgrade' } });
    }
  }, [loading, user, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin">
          <div className="w-8 h-8 border-4 border-slate-300 border-t-purple-600 rounded-full"></div>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const amount = billingPeriod === 'yearly' ? 25000 : 2500;
  const amountFormatted = new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
  }).format(amount);

  const handleUpgrade = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await protectedAxios.post('/subscription/initialize', {
        billingPeriod,
      });

      if (response.data.authorizationUrl) {
        // Redirect to Paystack checkout
        window.location.href = response.data.authorizationUrl;
      } else {
        setError('Failed to initialize payment. Please try again.');
      }
    } catch (err: any) {
      console.error('Upgrade error:', err);
      setError(
        err.response?.data?.error ||
          'Failed to initialize payment. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <button
            onClick={() => navigate('/pricing')}
            className="text-purple-600 hover:text-purple-700 font-semibold mb-6 flex items-center gap-2"
          >
            ← Back to pricing
          </button>

          <h1 className="text-4xl font-bold text-slate-900 dark:text-white">
            Unlock Chronovah Pro
          </h1>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Left Column - Order Summary */}
          <div>
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 border border-slate-200 dark:border-slate-800 sticky top-8">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">
                What's being unlocked
              </h2>

              {/* Unlocked sections */}
              <div className="flex gap-6 mb-8">
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-xl flex items-center justify-center mb-2">
                    <svg
                      className="w-8 h-8 text-purple-600"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M4 6h16v2H4zm0 5h16v2H4zm0 5h16v2H4z" />
                    </svg>
                  </div>
                  <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                    Journal
                  </span>
                </div>

                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-xl flex items-center justify-center mb-2">
                    <svg
                      className="w-8 h-8 text-green-600"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                    </svg>
                  </div>
                  <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                    People
                  </span>
                </div>

                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-xl flex items-center justify-center mb-2">
                    <svg
                      className="w-8 h-8 text-blue-600"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
                    </svg>
                  </div>
                  <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                    Places
                  </span>
                </div>
              </div>

              {/* Plan Details */}
              <div className="border-t border-slate-200 dark:border-slate-800 pt-6 mb-6">
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                  Plan
                </p>
                <p className="text-lg font-bold text-slate-900 dark:text-white mb-4">
                  Chronovah Pro
                </p>

                <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                  Billing period
                </p>
                <p className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                  {billingPeriod === 'yearly' ? 'Yearly (Save 17%)' : 'Monthly'}
                </p>

                <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                  Amount
                </p>
                <p className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  {amountFormatted}
                </p>
              </div>

              {/* Features */}
              <div className="border-t border-slate-200 dark:border-slate-800 pt-6">
                <h3 className="font-semibold text-slate-900 dark:text-white mb-4">
                  Includes
                </h3>
                <div className="space-y-3">
                  {[
                    'Unlimited journal entries',
                    'People tracking',
                    'Places tracking',
                    'End-to-end encryption',
                    'Cross-device sync',
                  ].map((feature, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <svg
                        className="w-4 h-4 text-emerald-600"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                      </svg>
                      <span className="text-sm text-slate-600 dark:text-slate-400">
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Trust Badges */}
              <div className="border-t border-slate-200 dark:border-slate-800 pt-6 mt-6 space-y-2 text-xs text-slate-600 dark:text-slate-400">
                <div className="flex items-center gap-2">
                  <Lock className="w-4 h-4" />
                  <span>Secured by Paystack</span>
                </div>
                <p>Cancel anytime · Notes stay free forever</p>
              </div>
            </div>
          </div>

          {/* Right Column - Payment Form */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 border border-slate-200 dark:border-slate-800 h-fit">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-8">
              Unlock the full Chronovah
            </h2>

            {/* Error Alert */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
              </div>
            )}

            {/* Name */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Name
              </label>
              <input
                type="text"
                value={user.name}
                disabled
                className="w-full px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-lg border border-slate-200 dark:border-slate-700"
              />
            </div>

            {/* Email */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Email
              </label>
              <input
                type="email"
                value={user.email}
                disabled
                className="w-full px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-lg border border-slate-200 dark:border-slate-700"
              />
            </div>

            {/* Billing Period Selector */}
            <div className="mb-8">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-4">
                Billing period
              </label>

              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => setBillingPeriod('monthly')}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    billingPeriod === 'monthly'
                      ? 'border-purple-600 bg-purple-50 dark:bg-purple-900/20'
                      : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                  }`}
                >
                  <div className="font-semibold text-slate-900 dark:text-white">
                    Monthly
                  </div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">
                    ₦2,500/month
                  </div>
                </button>

                <button
                  onClick={() => setBillingPeriod('yearly')}
                  className={`p-4 rounded-lg border-2 transition-all relative ${
                    billingPeriod === 'yearly'
                      ? 'border-purple-600 bg-purple-50 dark:bg-purple-900/20'
                      : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                  }`}
                >
                  <div className="font-semibold text-slate-900 dark:text-white">
                    Yearly
                  </div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">
                    ₦25,000/year
                  </div>
                  {billingPeriod === 'yearly' && (
                    <div className="absolute -top-3 -right-2 bg-green-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                      Save 17%
                    </div>
                  )}
                </button>
              </div>
            </div>

            {/* Payment Button */}
            <button
              onClick={handleUpgrade}
              disabled={isLoading}
              className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed mb-4"
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                  <span>Processing...</span>
                </div>
              ) : (
                `Pay ${amountFormatted} with Paystack`
              )}
            </button>

            {/* Info Text */}
            <p className="text-xs text-center text-slate-600 dark:text-slate-400">
              You will be redirected to Paystack to complete your payment securely.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpgradePage;
