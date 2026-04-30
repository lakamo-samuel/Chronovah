import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { CheckCircle, AlertCircle, Loader } from 'lucide-react';
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
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--color-bg)' }}>
        <div className="text-center">
          <Loader className="w-12 h-12 animate-spin mx-auto mb-4" style={{ color: 'var(--color-primary)' }} />
          <p style={{ color: 'var(--color-text-muted)' }}>
            Verifying your payment...
          </p>
        </div>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center py-12 px-4" style={{ backgroundColor: 'var(--color-bg)' }}>
        <div className="max-w-2xl w-full">
          {/* Animated Checkmark */}
          <div className="flex justify-center mb-8">
            <CheckCircle className="w-24 h-24 text-green-600 animate-bounce" />
          </div>

          {/* Main Content */}
          <div className="rounded-2xl p-8 text-center mb-8" style={{ backgroundColor: 'var(--color-card)', borderColor: 'var(--color-border)' }}>
            <h1 className="text-4xl font-bold mb-4" style={{ color: 'var(--color-text)' }}>
              Welcome to Chronovah Pro! 🎉
            </h1>

            <p className="text-lg mb-8" style={{ color: 'var(--color-text-muted)' }}>
              Journal, People and Places are now unlocked.
            </p>

            {/* Newly Unlocked Sections */}
            <div className="grid grid-cols-3 gap-4 mb-12">
              {[
                { name: 'Journal', emoji: '📔' },
                { name: 'People', emoji: '👥' },
                { name: 'Places', emoji: '🗺️' },
              ].map((section) => (
                <div
                  key={section.name}
                  className="p-4 rounded-lg border-2"
                  style={{
                    backgroundColor: 'var(--color-bg)',
                    borderColor: 'var(--color-primary)',
                  }}
                >
                  <p className="text-3xl mb-2">{section.emoji}</p>
                  <p className="text-sm font-semibold mb-1" style={{ color: 'var(--color-text)' }}>
                    {section.name}
                  </p>
                  <p className="text-xs font-bold" style={{ color: 'var(--color-text-muted)' }}>Unlocked ✓</p>
                </div>
              ))}
            </div>

            {/* Subscription Details */}
            <div className="rounded-xl p-6 border mb-8" style={{ backgroundColor: 'var(--color-bg)', borderColor: 'var(--color-border)' }}>
              <h2 className="text-lg font-bold mb-4" style={{ color: 'var(--color-text)' }}>
                Your Subscription Details
              </h2>

              <div className="grid grid-cols-2 gap-4 text-left">
                <div>
                  <p className="text-xs mb-1" style={{ color: 'var(--color-text-muted)' }}>
                    Plan
                  </p>
                  <p className="font-semibold" style={{ color: 'var(--color-text)' }}>
                    Chronovah Pro
                  </p>
                </div>

                <div>
                  <p className="text-xs mb-1" style={{ color: 'var(--color-text-muted)' }}>
                    Status
                  </p>
                  <p className="font-semibold text-green-600">Active</p>
                </div>

                <div className="col-span-2">
                  <p className="text-xs mb-1" style={{ color: 'var(--color-text-muted)' }}>
                    Next billing date
                  </p>
                  <p className="font-semibold" style={{ color: 'var(--color-text)' }}>
                    Auto-renews in 30 days
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={() => navigate('/journal')}
                className="w-full py-3 px-4 bg-primary-600 text-white font-semibold rounded-lg hover:shadow-lg transition-shadow"
              >
                Explore Journal →
              </button>

              <button
                onClick={() => navigate('/dashboard')}
                className="w-full py-3 px-4 rounded-lg transition-colors"
                style={{
                  border: '1px solid var(--color-border)',
                  backgroundColor: 'transparent',
                  color: 'var(--color-text)',
                }}
              >
                Go to Dashboard
              </button>
            </div>

            {/* Auto-redirect message */}
            <p className="text-xs mt-6" style={{ color: 'var(--color-text-muted)' }}>
              Redirecting you to Journal in a few seconds...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4" style={{ backgroundColor: 'var(--color-bg)' }}>
      <div className="max-w-2xl w-full">
        {/* Error Icon */}
        <div className="flex justify-center mb-8">
          <AlertCircle className="w-24 h-24 text-red-600" />
        </div>

        {/* Error Content */}
        <div className="rounded-2xl p-8 text-center" style={{ backgroundColor: 'var(--color-card)' }}>
          <h1 className="text-4xl font-bold mb-4" style={{ color: 'var(--color-text)' }}>
            Payment Verification Failed
          </h1>

          <p className="text-lg mb-6" style={{ color: 'var(--color-text-muted)' }}>
            {error ||
              'Your payment may have been processed. Please contact support with your reference number.'}
          </p>

          {reference && (
            <div className="rounded-lg p-4 mb-8 text-left" style={{ backgroundColor: 'var(--color-bg)', border: '1px solid var(--color-border)' }}>
              <p className="text-xs mb-1" style={{ color: 'var(--color-text-muted)' }}>
                Reference Number
              </p>
              <p className="font-mono text-sm break-all" style={{ color: 'var(--color-text)' }}>
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
              className="w-full py-3 px-4 bg-primary-600 text-white font-semibold rounded-lg hover:shadow-lg transition-shadow"
            >
              Try Again
            </button>

            <button
              onClick={() => navigate('/pricing')}
              className="w-full py-3 px-4 rounded-lg transition-colors"
              style={{
                border: '1px solid var(--color-border)',
                backgroundColor: 'transparent',
                color: 'var(--color-text)',
              }}
            >
              Back to Pricing
            </button>

            {/* Support link */}
            <p className="text-sm pt-4" style={{ color: 'var(--color-text-muted)' }}>
              Need help? <span className="cursor-pointer hover:underline" style={{ color: 'var(--color-primary)' }}>Contact support</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccessPage;
