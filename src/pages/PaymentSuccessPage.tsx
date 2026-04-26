import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { CheckCircle, XCircle } from 'lucide-react';
import { protectedAxios } from '../../axios';
import { useSubscriptionStore } from '../store/subscriptionStore';

const PaymentSuccessPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reference, setReference] = useState<string | null>(null);
  const { fetchStatus } = useSubscriptionStore();

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        const ref = searchParams.get('reference');
        if (!ref) {
          setError('No payment reference found. Please try again.');
          setIsLoading(false);
          return;
        }

        setReference(ref);

        // Verify the payment
        const response = await protectedAxios.post('/subscription/verify', {
          reference: ref,
        });

        if (response.data.isProActive) {
          // Update subscription store
          await fetchStatus();
          setIsSuccess(true);
          setIsLoading(false);

          // Auto-redirect after 3 seconds
          setTimeout(() => {
            navigate('/journal');
          }, 3000);
        } else {
          setError(' Payment verification completed but subscription not activated.');
          setIsLoading(false);
        }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        console.error('Payment verification error:', err);
        setError(
          err.response?.data?.error ||
            'Payment verification failed. Please contact support.'
        );
        setIsLoading(false);
      }
    };

    verifyPayment();
  }, [searchParams, fetchStatus, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="text-center">
          <div className="animate-spin mb-4">
            <div className="w-12 h-12 border-4 border-slate-300 border-t-purple-600 rounded-full mx-auto"></div>
          </div>
          <p className="text-slate-600 dark:text-slate-400">
            Verifying your payment...
          </p>
        </div>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-emerald-50 to-slate-50 dark:from-emerald-900/20 dark:to-slate-950 py-12 px-4">
        <div className="max-w-2xl w-full">
          {/* Animated Checkmark */}
          <div className="flex justify-center mb-8">
            <div className="relative w-24 h-24">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-green-500 rounded-full opacity-20 animate-pulse"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <CheckCircle className="w-24 h-24 text-emerald-600 animate-bounce" />
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 text-center mb-8">
            <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
              Welcome to Chronovah Pro! 🎉
            </h1>

            <p className="text-lg text-slate-600 dark:text-slate-400 mb-8">
              Journal, People and Places are now unlocked.
            </p>

            {/* Newly Unlocked Sections */}
            <div className="grid grid-cols-3 gap-4 mb-12">
              {[
                { name: 'Journal', color: 'purple' },
                { name: 'People', color: 'green' },
                { name: 'Places', color: 'blue' },
              ].map((section, index) => (
                <div
                  key={section.name}
                  className={`opacity-0 animate-[fadeInUp_0.5s_ease_forwards] p-4 rounded-lg border-2`}
                  style={{
                    borderColor:
                      section.color === 'purple'
                        ? '#c084fc'
                        : section.color === 'green'
                          ? '#4ade80'
                          : '#60a5fa',
                    animationDelay: `${index * 0.1}s`,
                  }}
                >
                  <p
                    className={`text-sm font-semibold mb-1 ${
                      section.color === 'purple'
                        ? 'text-purple-600'
                        : section.color === 'green'
                          ? 'text-green-600'
                          : 'text-blue-600'
                    }`}
                  >
                    {section.name}
                  </p>
                  <p className="text-xs text-emerald-600 font-bold">Unlocked ✓</p>
                </div>
              ))}
            </div>

            {/* Subscription Details */}
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl p-6 border border-purple-200 dark:border-purple-800 mb-8">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
                Your Subscription Details
              </h2>

              <div className="grid grid-cols-2 gap-4 text-left">
                <div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">
                    Plan
                  </p>
                  <p className="font-semibold text-slate-900 dark:text-white">
                    Chronovah Pro
                  </p>
                </div>

                <div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">
                    Status
                  </p>
                  <p className="font-semibold text-emerald-600">Active</p>
                </div>

                <div className="col-span-2">
                  <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">
                    Next billing date
                  </p>
                  <p className="font-semibold text-slate-900 dark:text-white">
                    Auto-renews in 30 days
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={() => navigate('/journal')}
                className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg hover:shadow-lg transition-shadow"
              >
                Explore Journal →
              </button>

              <button
                onClick={() => navigate('/dashboard')}
                className="w-full py-3 px-4 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 font-semibold rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                Go to Dashboard
              </button>
            </div>

            {/* Auto-redirect message */}
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-6">
              Redirecting you to Journal in a few seconds...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-red-50 to-slate-50 dark:from-red-900/20 dark:to-slate-950 py-12 px-4">
      <div className="max-w-2xl w-full">
        {/* Error Icon */}
        <div className="flex justify-center mb-8">
          <XCircle className="w-24 h-24 text-red-600" />
        </div>

        {/* Error Content */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 text-center">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
            Payment Verification Failed
          </h1>

          <p className="text-lg text-slate-600 dark:text-slate-400 mb-6">
            {error ||
              'Your payment may have been processed. Please contact support with your reference number.'}
          </p>

          {reference && (
            <div className="bg-slate-100 dark:bg-slate-800 rounded-lg p-4 mb-8 text-left">
              <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">
                Reference Number
              </p>
              <p className="font-mono text-sm text-slate-900 dark:text-white break-all">
                {reference}
              </p>
            </div>
          )}

          <div className="space-y-3">
            <button
              onClick={() => {
                setIsLoading(true);
                setError(null);
                window.location.reload();
              }}
              className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg hover:shadow-lg transition-shadow"
            >
              Try Again
            </button>

            <button
              onClick={() => navigate('/pricing')}
              className="w-full py-3 px-4 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 font-semibold rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              Back to Pricing
            </button>

            {/* Support link */}
            <p className="text-sm text-slate-600 dark:text-slate-400 pt-4">
              Need help? <span className="text-purple-600 cursor-pointer hover:underline">Contact support</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccessPage;
