import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, BookOpen, Users, MapPin, ArrowRight } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useSubscriptionStore } from '../../store/subscriptionStore';
import { db } from '../../database/db';
import { useLiveQuery } from 'dexie-react-hooks';

const PricingSection: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isProActive } = useSubscriptionStore();
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly');

  // Get real counts from Dexie
  const journalCount = useLiveQuery(
    async () => (user ? (await db.journal.where('userId').equals(user.id).count()) : 0),
    [user?.id]
  ) ?? 0;

  const peopleCount = useLiveQuery(
    async () => (user ? (await db.people.where('userId').equals(user.id).count()) : 0),
    [user?.id]
  ) ?? 0;

  const placesCount = useLiveQuery(
    async () => (user ? (await db.places.where('userId').equals(user.id).count()) : 0),
    [user?.id]
  ) ?? 0;

  const monthlyAmount = 2500;
  const yearlyAmount = 25000;
  const amount = billingPeriod === 'yearly' ? yearlyAmount : monthlyAmount;

  const monthlyFormatted = new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
  }).format(monthlyAmount);

  const yearlyFormatted = new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
  }).format(yearlyAmount);

  return (
    <section className="py-20 px-4" style={{ backgroundColor: 'var(--color-bg)' }}>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2
            className="text-4xl md:text-5xl font-bold mb-4"
            style={{ color: 'var(--color-text)' }}
          >
            Choose Your Plan
          </h2>
          <p
            className="text-lg mb-8"
            style={{ color: 'var(--color-text-muted)' }}
          >
            Notes are free forever. Unlock the full vault with Pro.
          </p>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={() => setBillingPeriod('monthly')}
              className="px-6 py-3 rounded-lg font-semibold transition-all"
              style={{
                backgroundColor: billingPeriod === 'monthly' ? 'var(--color-primary)' : 'var(--color-card)',
                color: billingPeriod === 'monthly' ? 'white' : 'var(--color-text)',
                border: `2px solid ${billingPeriod === 'monthly' ? 'var(--color-primary)' : 'var(--color-border)'}`,
              }}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingPeriod('yearly')}
              className="px-6 py-3 rounded-lg font-semibold transition-all relative"
              style={{
                backgroundColor: billingPeriod === 'yearly' ? 'var(--color-primary)' : 'var(--color-card)',
                color: billingPeriod === 'yearly' ? 'white' : 'var(--color-text)',
                border: `2px solid ${billingPeriod === 'yearly' ? 'var(--color-primary)' : 'var(--color-border)'}`,
              }}
            >
              Yearly
              {billingPeriod === 'yearly' && (
                <span className="absolute -top-3 -right-2 text-white text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: 'var(--color-primary)' }}>
                  Save 17%
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Free Plan */}
          <div
            className="rounded-2xl p-8 border-2"
            style={{
              backgroundColor: 'var(--color-card)',
              borderColor: 'var(--color-border)',
            }}
          >
            <div className="mb-6">
              <h3 className="text-2xl font-bold mb-2" style={{ color: 'var(--color-text)' }}>
                Free Forever
              </h3>
              <p style={{ color: 'var(--color-text-muted)' }}>
                Start capturing your thoughts - with limits
              </p>
            </div>

            <div className="mb-8">
              <p className="text-sm mb-2" style={{ color: 'var(--color-text-muted)' }}>
                Price
              </p>
              <p className="text-4xl font-bold" style={{ color: 'var(--color-text)' }}>
                ₦0
              </p>
            </div>

            <button
              onClick={() => navigate('/notes')}
              className="w-full py-3 px-4 rounded-lg font-bold transition-all mb-8"
              style={{
                backgroundColor: 'var(--color-bg)',
                color: 'var(--color-text)',
                border: '2px solid var(--color-border)',
              }}
            >
              Get Started
            </button>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Check className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: 'var(--color-primary)' }} />
                <div>
                  <p className="font-semibold" style={{ color: 'var(--color-text)' }}>
                    Unlimited Notes
                  </p>
                  <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
                    Write as much as you want
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Check className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: 'var(--color-primary)' }} />
                <div>
                  <p className="font-semibold" style={{ color: 'var(--color-text)' }}>
                    Limited Vault Access
                  </p>
                  <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
                    20 journal, 12 people, 15 places
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Check className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: 'var(--color-primary)' }} />
                <div>
                  <p className="font-semibold" style={{ color: 'var(--color-text)' }}>
                    End-to-End Encrypted
                  </p>
                  <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
                    Your privacy, always protected
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Pro Plan */}
          <div
            className="rounded-2xl p-8 border-2 relative"
            style={{
              backgroundColor: 'var(--color-card)',
              borderColor: isProActive ? 'var(--color-primary)' : 'var(--color-border)',
            }}
          >
            {isProActive && (
              <div className="absolute -top-4 right-8 px-4 py-1 rounded-full text-white text-sm font-bold bg-primary-500">
                Active plan
              </div>
            )}

            <div className="mb-6">
              <h3 className="text-2xl font-bold mb-2" style={{ color: 'var(--color-text)' }}>
                Chronovah Pro
              </h3>
              <p style={{ color: 'var(--color-text-muted)' }}>
                Unlock the full vault
              </p>
            </div>

            <div className="mb-8">
              <p className="text-sm mb-2" style={{ color: 'var(--color-text-muted)' }}>
                {billingPeriod === 'yearly' ? 'Per year' : 'Per month'}
              </p>
              <p className="text-4xl font-bold" style={{ color: 'var(--color-text)' }}>
                {billingPeriod === 'yearly' ? yearlyFormatted : monthlyFormatted}
              </p>
            </div>

            <button
              onClick={() => navigate(isProActive ? '/billing' : '/upgrade')}
              className="w-full py-3 px-4 text-white font-bold rounded-lg transition-all mb-8 hover:shadow-lg bg-primary-600"
            >
              {isProActive ? 'Manage Plan' : 'Unlock Pro'}
              <ArrowRight className="w-4 h-4 inline ml-2" />
            </button>

            {/* Pro Features */}
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="flex items-center justify-center w-8 h-8 rounded-lg flex-shrink-0 mt-0.5 bg-journal-soft">
                  <BookOpen className="w-4 h-4 text-[var(--color-journal-light)]" />
                </div>
                <div>
                  <p className="font-semibold" style={{ color: 'var(--color-text)' }}>
                    Journal
                  </p>
                  <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
                    {journalCount > 20
                      ? `${journalCount}/∞ (${journalCount - 20} over free limit)`
                      : `${journalCount}/20 entries used`}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex items-center justify-center w-8 h-8 rounded-lg flex-shrink-0 mt-0.5 bg-people-soft">
                  <Users className="w-4 h-4 text-[var(--color-people-light)]" />
                </div>
                <div>
                  <p className="font-semibold" style={{ color: 'var(--color-text)' }}>
                    People
                  </p>
                  <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
                    {peopleCount > 12
                      ? `${peopleCount}/∞ (${peopleCount - 12} over free limit)`
                      : `${peopleCount}/12 people used`}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex items-center justify-center w-8 h-8 rounded-lg flex-shrink-0 mt-0.5 bg-places-soft">
                  <MapPin className="w-4 h-4 text-[var(--color-places-light)]" />
                </div>
                <div>
                  <p className="font-semibold" style={{ color: 'var(--color-text)' }}>
                    Places
                  </p>
                  <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
                    {placesCount > 15
                      ? `${placesCount}/∞ (${placesCount - 15} over free limit)`
                      : `${placesCount}/15 places used`}
                  </p>
                </div>
              </div>

              <div className="pt-4" style={{ borderTop: '1px solid var(--color-border)' }}>
                <p className="text-sm font-semibold mb-3" style={{ color: 'var(--color-text)' }}>
                  Also included:
                </p>
                <ul className="space-y-2 text-sm" style={{ color: 'var(--color-text-muted)' }}>
                  {[
                    "Unlimited journal entries",
                    "Unlimited people profiles",
                    "Unlimited place memories",
                    "Cross-device sync",
                    "Priority support",
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-2">
                      <Check className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--color-primary)' }} />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-16 pt-16" style={{ borderTop: '1px solid var(--color-border)' }}>
          <h3 className="text-2xl font-bold text-center mb-8" style={{ color: 'var(--color-text)' }}>
            Frequently Asked
          </h3>

          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                q: 'Can I cancel anytime?',
                a: 'Yes, cancel your subscription at any time with no penalties.',
              },
              {
                q: 'What happens to my data after canceling?',
                a: 'Your notes remain forever. Journal, People, and Places become locked.',
              },
              {
                q: 'Is payment secure?',
                a: 'Yes, payments are processed securely through Paystack.',
              },
              {
                q: 'Do you offer refunds?',
                a: 'Yes, within 7 days of your first purchase.',
              },
            ].map((faq, idx) => (
              <div
                key={idx}
                className="p-6 rounded-lg"
                style={{ backgroundColor: 'var(--color-card)', border: '1px solid var(--color-border)' }}
              >
                <p className="font-bold mb-2" style={{ color: 'var(--color-text)' }}>
                  {faq.q}
                </p>
                <p style={{ color: 'var(--color-text-muted)' }}>
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
