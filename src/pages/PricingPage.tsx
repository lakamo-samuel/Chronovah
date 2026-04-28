import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, Lock, ArrowLeft } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useSubscriptionStore } from '../store/subscriptionStore';
import { useLiveQuery } from 'dexie-react-hooks';
import Header from '../components/Header';
import Footer from '../components/Footer';
import db from '../database/db';

const PricingPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isProActive } = useSubscriptionStore();
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly');

  // Real counts from Dexie
  const journalCount = useLiveQuery(
    async () => user ? (await db.journal.where('userId').equals(user.id).count()) : 0,
    [user?.id]
  ) ?? 0;
  const peopleCount = useLiveQuery(
    async () => user ? (await db.people.where('userId').equals(user.id).count()) : 0,
    [user?.id]
  ) ?? 0;
  const placesCount = useLiveQuery(
    async () => user ? (await db.places.where('userId').equals(user.id).count()) : 0,
    [user?.id]
  ) ?? 0;

  const handleUpgrade = () => {
    if (!user) {
      navigate('/signin', { state: { from: '/pricing' } });
    } else {
      navigate('/upgrade');
    }
  };

  // Pro users see success message instead
  if (isProActive) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center p-6" style={{ backgroundColor: 'var(--color-bg)' }}>
          <div className="text-center max-w-2xl">
            <h1 className="text-4xl font-black mb-4" style={{ color: 'var(--color-text)' }}>
              You're on Chronovah Pro!
            </h1>
            <p className="text-lg mb-8" style={{ color: 'var(--color-text-muted)' }}>
              All features unlocked. Enjoy your full digital vault experience.
            </p>
            <button
              onClick={() => navigate('/dashboard')}
              className="px-8 py-4 font-bold rounded-lg shadow-lg hover:shadow-xl transition-shadow text-white"
              style={{ background: 'var(--gradient-primary)' }}
            >
              Go to Dashboard
            </button>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="w-full min-h-screen py-12 md:py-20 px-6" style={{ backgroundColor: 'var(--color-bg)', color: 'var(--color-text)' }}>
        <div className="max-w-6xl mx-auto">
          {/* Back Button */}
          <button
            onClick={() => navigate(-1)}
            className="mb-8 flex items-center gap-2 px-4 py-2 rounded-lg hover:opacity-80 transition-opacity\n"
            style={{ color: 'var(--color-text-muted)' }}
          >
            <ArrowLeft size={16} />
            <span className="text-sm font-medium">Back</span>
          </button>

          {/* Hero */}
          <div className="text-center mb-16 max-w-2xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6 leading-tight">
              Start free. Unlock everything when you're ready.
            </h1>
            <p className="text-lg leading-[1.6]" style={{ color: 'var(--color-text-muted)' }}>
              Your notes are free forever. Upgrade to Pro for Journal, People, and Places.
            </p>
          </div>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center space-x-4 mb-16 p-1 rounded-full shadow-md" style={{ backgroundColor: 'var(--color-card)' }}>
            <button
              onClick={() => setBillingPeriod('monthly')}
              className={`px-6 py-2 text-sm font-semibold rounded-full transition-all ${
                billingPeriod === 'monthly' ? 'shadow-sm' : ''
              }`}
              style={{
                backgroundColor: billingPeriod === 'monthly' ? 'var(--color-bg)' : 'transparent',
                color: 'var(--color-text)',
              }}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingPeriod('yearly')}
              className="px-6 py-2 text-sm font-medium rounded-full transition-all flex items-center space-x-2"
              style={{
                backgroundColor: billingPeriod === 'yearly' ? 'var(--color-bg)' : 'transparent',
                color: 'var(--color-text)',
              }}
            >
              <span>Yearly</span>
              {billingPeriod === 'yearly' && (
                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: 'var(--color-primary-soft)', color: 'var(--color-primary)' }}>
                  Save 17%
                </span>
              )}
            </button>
          </div>

          {/* Cards */}
          <div className="grid md:grid-cols-2 gap-8 w-full max-w-4xl mx-auto">
            {/* Free */}
            <div className="rounded-xl p-8 flex flex-col border" style={{ backgroundColor: 'var(--color-card)', borderColor: 'var(--color-border)' }}>
              <div className="mb-8">
                <h3 className="text-2xl font-bold mb-2">Starter</h3>
                <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>Essential tools to capture your thoughts.</p>
              </div>
              <div className="flex items-baseline space-x-1 mb-8">
                <span className="text-4xl font-extrabold">₦0</span>
                <span className="text-sm" style={{ color: 'var(--color-text-muted)' }}>forever</span>
              </div>
              <div className="flex-grow space-y-4 mb-8">
                {[
                  'Unlimited Notes',
                  'Basic Sync',
                  'Offline Access',
                ].map((feature) => (
                  <div key={feature} className="flex items-start space-x-3">
                    <Check className="w-5 h-5 mt-0.5" style={{ color: 'var(--color-primary)' }} />
                    <span>{feature}</span>
                  </div>
                ))}
                <div className="h-6" />
                {[
                  { name: 'Journal', count: journalCount },
                  { name: 'People', count: peopleCount },
                  { name: 'Places', count: placesCount },
                ].map(({ name, count }) => (
                  <div key={name} className="flex items-start space-x-3 opacity-50">
                    <Lock className="w-5 h-5 mt-0.5" style={{ color: 'var(--color-text-muted)' }} />
                    <span style={{ color: 'var(--color-text-muted)' }} className="line-through">
                      {name} ({count})
                    </span>
                  </div>
                ))}
              </div>
              <button className="w-full py-4 px-6 rounded-lg font-bold border" style={{ borderColor: 'var(--color-border)', color: 'var(--color-primary)' }}>
                Current Plan
              </button>
            </div>

            {/* Pro */}
            <div className="rounded-xl p-8 flex flex-col border-2 relative md:-translate-y-4" style={{ backgroundColor: 'var(--color-card)', borderColor: 'var(--color-primary)' }}>
              <div className="absolute top-0 left-0 right-0 h-1 rounded-t-xl" style={{ background: 'var(--gradient-primary)' }} />
              <div className="mb-8">
                <div className="flex justify-between items-start">
                  <h3 className="text-2xl font-bold mb-2">Chronovah Pro</h3>
                  <span className="text-xs uppercase font-bold px-2 py-1 rounded" style={{ backgroundColor: 'var(--color-primary-soft)', color: 'var(--color-primary)' }}>
                    Popular
                  </span>
                </div>
                <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>The complete digital vault experience.</p>
              </div>
              <div className="flex items-baseline space-x-1 mb-8">
                <span className="text-4xl font-extrabold">₦{billingPeriod === 'yearly' ? '25,000' : '2,500'}</span>
                <span className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
                  {billingPeriod === 'yearly' ? '/yr' : '/mo'}
                </span>
              </div>
              <div className="flex-grow space-y-4 mb-8">
                {[
                  'Everything in Starter',
                  'Full Journal Features',
                  'People Network Mapping',
                  'Places Timeline',
                  'Priority Support',
                ].map((feature) => (
                  <div key={feature} className="flex items-start space-x-3">
                    <Check className="w-5 h-5 mt-0.5" style={{ color: 'var(--color-primary)' }} />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
              <button
                onClick={handleUpgrade}
                className="w-full py-4 px-6 rounded-lg font-bold text-white hover:shadow-lg transition-shadow flex justify-center items-center gap-2"
                style={{ background: 'var(--gradient-primary)' }}
              >
                Upgrade to Pro
                <span>→</span>
              </button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default PricingPage;
       