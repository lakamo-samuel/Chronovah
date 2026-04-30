import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, CheckCircle2, Loader } from 'lucide-react';
import { useSubscriptionStore } from '../store/subscriptionStore';
import { protectedAxios } from '../../axios';
import { useLiveQuery } from 'dexie-react-hooks';
import { useAuth } from '../hooks/useAuth';
import db from '../database/db';

const BillingPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { plan, isProActive, nextBillingDate, planExpiresAt, fetchStatus } = useSubscriptionStore();
  const [isCancelling, setIsCancelling] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelError, setCancelError] = useState<string | null>(null);
  const [cancelSuccess, setCancelSuccess] = useState<string | null>(null);

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

  const handleCancel = async () => {
    setIsCancelling(true);
    setCancelError(null);
    try {
      const response = await protectedAxios.post('/subscription/cancel');
      setShowCancelModal(false);
      setCancelSuccess(
        response.data?.message ||
          'Subscription cancelled. You retain Pro access until the end of your billing period.'
      );
      // Refresh subscription store so UI reflects the change
      await fetchStatus();
    } catch (error: any) {
      console.error('Failed to cancel subscription:', error);
      setCancelError(
        error?.message || error?.response?.data?.error || 'Failed to cancel subscription. Please try again.'
      );
    } finally {
      setIsCancelling(false);
    }
  };

  return (
    <div
      className="min-h-screen py-12 px-6"
      style={{ backgroundColor: "var(--color-bg)", color: "var(--color-text)" }}
    >
      <div className="max-w-4xl mx-auto space-y-12">
        <div>
          <h1 className="text-4xl font-extrabold mb-2">Subscription</h1>
          <p style={{ color: "var(--color-text-muted)" }}>
            Manage your plan and billing.
          </p>
        </div>

        {/* Cancel success / error banners */}
        {cancelSuccess && (
          <div className="flex items-start gap-3 p-4 rounded-xl bg-green-500/10 border border-green-500/30 text-green-700 dark:text-green-400 text-sm">
            <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <span>{cancelSuccess}</span>
          </div>
        )}

        {isProActive ? (
          // Pro User View
          <div
            className="rounded-xl p-8 border-2"
            style={{
              backgroundColor: "var(--color-card)",
              borderColor: "var(--color-primary)",
            }}
          >
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="text-2xl font-bold">Chronovah Pro</h2>
                  <span className="text-xs uppercase font-bold px-2.5 py-1 rounded bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                    Active
                  </span>
                </div>
                <p style={{ color: "var(--color-text-muted)" }}>
                  Billed {plan === "pro" ? "annually" : "monthly"}
                </p>
              </div>
              <div className="text-right">
                <p
                  className="text-sm"
                  style={{ color: "var(--color-text-muted)" }}
                >
                  Next billing
                </p>
                <p className="text-lg font-semibold">
                  {nextBillingDate
                    ? new Date(nextBillingDate).toLocaleDateString()
                    : "N/A"}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
              <div
                className="rounded-lg p-6"
                style={{ backgroundColor: "var(--color-bg)" }}
              >
                <h3
                  className="text-sm font-bold uppercase mb-4"
                  style={{ color: "var(--color-text-muted)" }}
                >
                  Features
                </h3>
                <ul className="space-y-3">
                  {[
                    "Full Journal",
                    "People Network",
                    "Places Timeline",
                    "Priority Support",
                  ].map((feature) => (
                    <li key={feature} className="flex items-center gap-2">
                      <CheckCircle2
                        className="w-5 h-5"
                        style={{ color: "var(--color-primary)" }}
                      />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div
                className="rounded-lg p-6 flex flex-col justify-center items-center text-center"
                style={{ backgroundColor: "var(--color-bg)" }}
              >
                <span className="text-4xl mb-3">⚡</span>
                <h3 className="text-lg font-bold mb-2">Premium Member</h3>
                <p
                  className="text-sm mb-6"
                  style={{ color: "var(--color-text-muted)" }}
                >
                  Full access to all digital vault features.
                </p>
                <button
                  onClick={() => setShowCancelModal(true)}
                  className="px-4 py-2 rounded-lg font-semibold text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                >
                  Cancel Subscription
                </button>
              </div>
            </div>
          </div>
        ) : (
          // Free User View
          <div
            className="rounded-xl p-8 border"
            style={{
              backgroundColor: "var(--color-card)",
              borderColor: "var(--color-border)",
            }}
          >
            <h2 className="text-2xl font-bold mb-4">Free Plan</h2>
            <p
              className="text-lg mb-8"
              style={{ color: "var(--color-text-muted)" }}
              
            >
              Upgrade to unlock advanced features.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              {[
                { name: "Journal", count: journalCount },
                { name: "People", count: peopleCount },
                { name: "Places", count: placesCount },
              ].map(({ name, count }) => (
                <div
                  key={name}
                  className="p-4 rounded-lg text-center"
                  style={{ backgroundColor: "var(--color-bg)" }}
                >
                  <p
                    className="text-2xl font-bold"
                    style={{ color: "var(--color-primary)" }}
                  >
                    {count}
                  </p>
                  <p style={{ color: "var(--color-text-muted)" }}>
                    {name} (Locked)
                  </p>
                </div>
              ))}
            </div>

            <button
              onClick={() => navigate("/upgrade")}
              className="w-full py-3 px-6 rounded-lg font-bold text-white hover:shadow-lg transition-shadow"
              style={{ background: "var(--gradient-primary)" }}
            >
              Upgrade to Pro
            </button>
          </div>
        )}

        {/* Cancel Modal */}
        {showCancelModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div
              className="bg-white dark:bg-slate-900 rounded-xl p-8 max-w-md w-full"
              style={{
                backgroundColor: "var(--color-card)",
                color: "var(--color-text)",
              }}
            >
              <div className="flex items-start gap-4 mb-4">
                <AlertCircle className="w-6 h-6 text-yellow-500 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-lg font-bold">Cancel Subscription?</h3>
                  <p
                    className="text-sm mt-1"
                    style={{ color: "var(--color-text-muted)" }}
                  >
                    You'll lose access to Pro features on{" "}
                    {planExpiresAt
                      ? new Date(planExpiresAt).toLocaleDateString()
                      : "the renewal date"}
                    .
                  </p>
                </div>
              </div>

              {cancelError && (
                <div className="flex items-start gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 text-sm mb-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <span>{cancelError}</span>
                </div>
              )}

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowCancelModal(false)}
                  className="flex-1 py-2 px-4 rounded-lg font-semibold border transition-colors"
                  style={{
                    borderColor: "var(--color-border)",
                    color: "var(--color-text)",
                  }}
                >
                  Keep Pro
                </button>
                <button
                  onClick={handleCancel}
                  disabled={isCancelling}
                  className="flex-1 py-2 px-4 rounded-lg font-semibold text-white flex items-center justify-center gap-2 disabled:opacity-50"
                  style={{ backgroundColor: "var(--color-accent-red)" }}
                >
                  {isCancelling ? (
                    <>
                      <Loader className="w-4 h-4 animate-spin" />
                      Cancelling...
                    </>
                  ) : (
                    "Confirm Cancel"
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BillingPage;
