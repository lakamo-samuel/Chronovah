import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, Lock } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

const PricingPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>(
    'monthly'
  );

  const handleUpgrade = () => {
    if (!user) {
      navigate('/signin', { state: { from: '/pricing' } });
      return;
    }
    navigate('/upgrade');
  };

  const features = [
    { name: 'Unlimited notes', free: true, pro: true },
    { name: 'Basic sync', free: true, pro: true },
    { name: 'Offline access', free: true, pro: true },
    { name: 'Journal', free: false, pro: true },
    { name: 'People', free: false, pro: true },
    { name: 'Places', free: false, pro: true },
    { name: 'Image uploads', free: false, pro: true },
    { name: 'End-to-end encryption', free: false, pro: true },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-block bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-1 rounded-full text-sm font-semibold mb-4">
            Pricing
          </div>

          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
            Simple, Honest Pricing
          </h1>

          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Notes are free forever. Upgrade for the full personal operating system.
          </p>
        </div>

        {/* Billing Toggle */}
        <div className="flex justify-center mb-12">
          <div className="bg-white dark:bg-slate-900 rounded-lg p-1 border border-slate-200 dark:border-slate-800 flex items-center gap-2">
            <button
              onClick={() => setBillingPeriod('monthly')}
              className={`px-6 py-2 rounded-md font-semibold transition-all ${
                billingPeriod === 'monthly'
                  ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-300'
              }`}
            >
              Monthly
            </button>

            <button
              onClick={() => setBillingPeriod('yearly')}
              className={`px-6 py-2 rounded-md font-semibold transition-all relative ${
                billingPeriod === 'yearly'
                  ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-300'
              }`}
            >
              Yearly
              {billingPeriod === 'yearly' && (
                <span className="absolute -top-3.5 -right-2 bg-green-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                  Save 17%
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 gap-8 lg:max-w-4xl mx-auto mb-16">
          {/* Free Card */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 border border-slate-200 dark:border-slate-800">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
              Starter
            </h3>

            <div className="mb-6">
              <span className="text-5xl font-bold text-slate-900 dark:text-white">
                ₦0
              </span>
              <span className="text-slate-600 dark:text-slate-400 ml-2">
                forever
              </span>
            </div>

            <button
              onClick={() => navigate('/notes')}
              className="w-full py-3 px-4 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 font-semibold rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors mb-8"
            >
              Get Started Free
            </button>

            {/* Features */}
            <div className="space-y-4">
              {features.map((feature) => (
                <div key={feature.name} className="flex items-center gap-3">
                  {feature.free ? (
                    <>
                      <div className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center flex-shrink-0">
                        <Check className="w-3 h-3 text-emerald-600" />
                      </div>
                      <span className="text-slate-700 dark:text-slate-300">
                        {feature.name}
                      </span>
                    </>
                  ) : (
                    <>
                      <div className="w-5 h-5 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center flex-shrink-0">
                        <Lock className="w-3 h-3 text-slate-400" />
                      </div>
                      <span className="text-slate-400 dark:text-slate-500">
                        {feature.name}
                      </span>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Pro Card */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 border-2 border-purple-600 relative overflow-hidden">
            {/* Most Popular Badge */}
            <div className="absolute top-0 right-0 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-1 text-xs font-bold">
              Most Popular
            </div>

            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
              Chronovah Pro
            </h3>

            <div className="mb-6">
              <span className="text-5xl font-bold text-slate-900 dark:text-white">
                ₦{billingPeriod === 'yearly' ? '25,000' : '2,500'}
              </span>
              <span className="text-slate-600 dark:text-slate-400 ml-2">
                per {billingPeriod === 'yearly' ? 'year' : 'month'}
              </span>
            </div>

            <button
              onClick={handleUpgrade}
              className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg hover:shadow-lg transition-shadow mb-8"
            >
              Upgrade to Pro →
            </button>

            {/* Features */}
            <div className="space-y-4">
              {features.map((feature) => (
                <div key={feature.name} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center flex-shrink-0">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                  <span className="text-slate-700 dark:text-slate-300">
                    {feature.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Trust Footer */}
        <div className="text-center text-sm text-slate-600 dark:text-slate-400 mb-16">
          Payments processed securely by Paystack · Cancel anytime · Notes stay
          free forever
        </div>

        {/* FAQ */}
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-12 text-center">
            Frequently Asked Questions
          </h2>

          <div className="space-y-6">
            {[
              {
                q: 'Can I use Chronovah for free forever?',
                a: 'Yes. Notes are completely free with no limits and no expiry. Ever.',
              },
              {
                q: 'What happens if I cancel Pro?',
                a: 'You keep your notes forever. Your journal, people and places data is safely stored and accessible again when you resubscribe.',
              },
              {
                q: 'Is my data safe?',
                a: 'All Pro data is end-to-end encrypted. Even we cannot read your journal entries.',
              },
            ].map((faq, index) => (
              <div
                key={index}
                className="bg-white dark:bg-slate-900 rounded-lg p-6 border border-slate-200 dark:border-slate-800"
              >
                <h3 className="font-semibold text-slate-900 dark:text-white mb-2">
                  {faq.q}
                </h3>
                <p className="text-slate-600 dark:text-slate-400">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingPage;
