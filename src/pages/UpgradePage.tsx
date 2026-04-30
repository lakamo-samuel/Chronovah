import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, AlertCircle, Loader, BookOpen, Users, MapPin, Check, ArrowLeft } from 'lucide-react';
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
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--color-bg)' }}>
        <div className="animate-spin">
          <Loader className="w-8 h-8" style={{ color: 'var(--color-primary)' }} />
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
    <div className="min-h-screen py-12 px-4" style={{ backgroundColor: 'var(--color-bg)' }}>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <button
            onClick={() => navigate('/pricing')}
            className="font-semibold mb-6 flex items-center gap-2 hover:opacity-80 transition-opacity"
            style={{ color: 'var(--color-primary)' }}
          >
            <ArrowLeft size={12}/> Back to pricing
          </button>

          <h1 className="text-4xl font-bold" style={{ color: 'var(--color-text)' }}>
            Unlock Chronovah Pro
          </h1>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Left Column - Order Summary */}
          <div>
            <div className="rounded-2xl p-8 sticky top-8" style={{ backgroundColor: 'var(--color-card)', border: '1px solid var(--color-border)' }}>
              <h2 className="text-xl font-bold mb-6" style={{ color: 'var(--color-text)' }}>
                What's being unlocked
              </h2>

              {/* Unlocked sections */}
              <div className="flex gap-6 mb-8">
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 rounded-xl flex items-center justify-center mb-2" style={{ backgroundColor: 'var(--color-journal-100)', border: '2px solid var(--color-journal-400)' }}>
                    <BookOpen className="w-8 h-8" style={{ color: 'var(--color-journal-600)' }} />
                  </div>
                  <span className="text-xs font-semibold" style={{ color: 'var(--color-text-muted)' }}>
                    Journal
                  </span>
                </div>

                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 rounded-xl flex items-center justify-center mb-2" style={{ backgroundColor: 'var(--color-people-100)', border: '2px solid var(--color-people-400)' }}>
                    <Users className="w-8 h-8" style={{ color: 'var(--color-people-600)' }} />
                  </div>
                  <span className="text-xs font-semibold" style={{ color: 'var(--color-text-muted)' }}>
                    People
                  </span>
                </div>

                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 rounded-xl flex items-center justify-center mb-2" style={{ backgroundColor: 'var(--color-places-100)', border: '2px solid var(--color-places-400)' }}>
                    <MapPin className="w-8 h-8" style={{ color: 'var(--color-places-600)' }} />
                  </div>
                  <span className="text-xs font-semibold" style={{ color: 'var(--color-text-muted)' }}>
                    Places
                  </span>
                </div>
              </div>

              {/* Plan Details */}
              <div className="pt-6 mb-6" style={{ borderTop: '1px solid var(--color-border)' }}>
                <p className="text-sm mb-2" style={{ color: 'var(--color-text-muted)' }}>
                  Plan
                </p>
                <p className="text-lg font-bold mb-4" style={{ color: 'var(--color-text)' }}>
                  Chronovah Pro
                </p>

                <p className="text-sm mb-2" style={{ color: 'var(--color-text-muted)' }}>
                  Billing period
                </p>
                <p className="text-lg font-semibold mb-4" style={{ color: 'var(--color-text)' }}>
                  {billingPeriod === 'yearly' ? 'Yearly (Save 17%)' : 'Monthly'}
                </p>

                <p className="text-sm mb-2" style={{ color: 'var(--color-text-muted)' }}>
                  Amount
                </p>
                <p className="text-2xl font-bold" style={{ background: 'var(--gradient-primary)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                  {amountFormatted}
                </p>
              </div>

              {/* Features */}
              <div className="pt-6" style={{ borderTop: '1px solid var(--color-border)' }}>
                <h3 className="font-semibold mb-4" style={{ color: 'var(--color-text)' }}>
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
                      <Check className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--color-primary)' }} />
                      <span className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Trust Badges */}
              <div className="pt-6 mt-6 space-y-2 text-xs" style={{ borderTop: '1px solid var(--color-border)', color: 'var(--color-text-muted)' }}>
                <div className="flex items-center gap-2">
                  <Lock className="w-4 h-4" />
                  <span>Secured by Paystack</span>
                </div>
                <p>Cancel anytime · Notes stay free forever</p>
              </div>
            </div>
          </div>

          {/* Right Column - Payment Form */}
          <div className="rounded-2xl p-8 h-fit" style={{ backgroundColor: 'var(--color-card)', border: '1px solid var(--color-border)' }}>
            <h2 className="text-2xl font-bold mb-8" style={{ color: 'var(--color-text)' }}>
              Unlock the full Chronovah
            </h2>

            {/* Error Alert */}
            {error && (
              <div className="mb-6 p-4 rounded-lg flex items-start gap-3" style={{ backgroundColor: 'rgba(220, 38, 38, 0.1)', border: '1px solid rgb(220, 38, 38)' }}>
                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: 'rgb(220, 38, 38)' }} />
                <p className="text-sm" style={{ color: 'rgb(220, 38, 38)' }}>{error}</p>
              </div>
            )}

            {/* Name */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-text)' }}>
                Name
              </label>
              <input
                type="text"
                value={user.name}
                disabled
                className="w-full px-4 py-2 rounded-lg border"
                style={{ backgroundColor: 'var(--color-bg)', borderColor: 'var(--color-border)', color: 'var(--color-text-muted)' }}
              />
            </div>

            {/* Email */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-text)' }}>
                Email
              </label>
              <input
                type="email"
                value={user.email}
                disabled
                className="w-full px-4 py-2 rounded-lg border"
                style={{ backgroundColor: 'var(--color-bg)', borderColor: 'var(--color-border)', color: 'var(--color-text-muted)' }}
              />
            </div>

            {/* Billing Period Selector */}
            <div className="mb-8">
              <label className="block text-sm font-medium mb-4" style={{ color: 'var(--color-text)' }}>
                Billing period
              </label>

              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => setBillingPeriod('monthly')}
                  className="p-4 rounded-lg border-2 transition-all"
                  style={{
                    borderColor: billingPeriod === 'monthly' ? 'var(--color-primary)' : 'var(--color-border)',
                    backgroundColor: billingPeriod === 'monthly' ? 'var(--color-bg)' : 'transparent',
                  }}
                >
                  <div className="font-semibold" style={{ color: 'var(--color-text)' }}>
                    Monthly
                  </div>
                  <div className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
                    ₦2,500/month
                  </div>
                </button>

                <button
                  onClick={() => setBillingPeriod('yearly')}
                  className="p-4 rounded-lg border-2 transition-all relative"
                  style={{
                    borderColor: billingPeriod === 'yearly' ? 'var(--color-primary)' : 'var(--color-border)',
                    backgroundColor: billingPeriod === 'yearly' ? 'var(--color-bg)' : 'transparent',
                  }}
                >
                  <div className="font-semibold" style={{ color: 'var(--color-text)' }}>
                    Yearly
                  </div>
                  <div className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
                    ₦25,000/year
                  </div>
                  {billingPeriod === 'yearly' && (
                    <div className="absolute -top-3 -right-2 text-white text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: 'var(--color-primary)' }}>
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
              className="w-full py-3 px-4 text-white font-semibold rounded-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed mb-4"
              style={{ background: isLoading ? 'var(--color-text-muted)' : 'var(--color-primary)' }}
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <Loader className="w-4 h-4 animate-spin" />
                  <span>Processing...</span>
                </div>
              ) : (
                `Pay ${amountFormatted} with Paystack`
              )}
            </button>

            {/* Info Text */}
            <p className="text-xs text-center" style={{ color: 'var(--color-text-muted)' }}>
              You will be redirected to Paystack to complete your payment securely.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpgradePage;
