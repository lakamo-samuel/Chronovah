import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Zap, AlertTriangle,  } from 'lucide-react';
import { protectedAxios } from '../../../axios';
import { useSubscriptionStore } from '../../store/subscriptionStore';

interface SubscriptionSettingsProps {
  onCancel?: () => void;
}

const SubscriptionSettings: React.FC<SubscriptionSettingsProps> = () => {
  const navigate = useNavigate();
  const { plan, isProActive, billingPeriod, planExpiresAt, nextBillingDate, fetchStatus } = useSubscriptionStore();
  const [isLoading, setIsLoading] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [isCancelled, setIsCancelled] = useState(planExpiresAt !== null && isProActive === false);

  const handleCancel = async () => {
    setIsLoading(true);
    try {
      await protectedAxios.post('/subscription/cancel');
      setIsCancelled(true);
      setShowCancelConfirm(false);
      await fetchStatus();
    } catch (error) {
      console.error('Failed to cancel subscription:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReactivate = async () => {
    navigate('/upgrade');
  };

  const handleManagePayment = async () => {
    try {
      const response = await protectedAxios.get('/subscription/manage');
      if (response.data.url) {
        window.open(response.data.url, '_blank');
      }
    } catch (error) {
      console.error('Failed to get customer portal URL:', error);
    }
  };

  const handleSwitchBilling = () => {
    navigate('/upgrade');
  };

  const isProSubscribed = plan === 'pro' && isProActive && !isCancelled;

  return (
    <div className="space-y-6">
      <div className="bg-default dark:bg-card border border-primary-200 dark:border-primary-800 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-primary dark:text-primary-200 mb-6 flex items-center gap-2">
          <Zap className="w-5 h-5" />
          Subscription
        </h3>

        {isProSubscribed ? (
          <>
            {/* Active subscription state */}
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-4 border-b border-primary-200 dark:border-primary-800">
                <span className="text-muted dark:text-muted">Status</span>
                <span className="px-3 py-1 bg-people rounded-full text-white text-sm font-semibold">
                  Active
                </span>
              </div>

              <div className="flex items-center justify-between pb-4 border-b border-primary-200 dark:border-primary-800">
                <span className="text-muted dark:text-muted">Plan</span>
                <span className="font-semibold text-primary dark:text-primary-200">Chronovah Pro</span>
              </div>

              <div className="flex items-center justify-between pb-4 border-b border-primary-200 dark:border-primary-800">
                <span className="text-muted dark:text-muted">Billing Period</span>
                <span className="font-semibold text-primary dark:text-primary-200 capitalize">
                  {billingPeriod || 'N/A'}
                </span>
              </div>

              {nextBillingDate && (
                <div className="flex items-center justify-between pb-4">
                  <span className="text-muted dark:text-muted">Next Billing</span>
                  <span className="font-semibold text-primary dark:text-primary-200">
                    {new Date(nextBillingDate).toLocaleDateString()}
                  </span>
                </div>
              )}

              {/* Action buttons */}
              <div className="space-y-3 pt-4 border-t border-primary-200 dark:border-primary-800">
                {billingPeriod === 'monthly' && (
                  <button
                    onClick={handleSwitchBilling}
                    className="w-full py-2 px-4 border border-primary-600 text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/30 font-semibold rounded-lg transition-colors"
                  >
                    Switch to Yearly (Save 17%)
                  </button>
                )}

                <button
                  onClick={handleManagePayment}
                  className="w-full py-2 px-4 text-primary-600 hover:text-primary-700 dark:hover:text-primary-400 font-semibold text-sm"
                >
                  Manage Payment Method →
                </button>

                <button
                  onClick={() => setShowCancelConfirm(true)}
                  className="w-full py-2 px-4 border border-red-300 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 font-semibold rounded-lg transition-colors"
                >
                  Cancel Subscription
                </button>
              </div>
            </div>
          </>
        ) : isCancelled ? (
          <>
            {/* Cancelled state */}
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-4 border-b border-primary-200 dark:border-primary-800">
                <span className="text-muted dark:text-muted">Status</span>
                <span className="px-3 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 rounded-full text-sm font-semibold">
                  Cancelled
                </span>
              </div>

              {planExpiresAt && (
                <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-4">
                  <p className="text-sm text-yellow-700 dark:text-yellow-400">
                    Access continues until {new Date(planExpiresAt).toLocaleDateString()}
                  </p>
                </div>
              )}

              <button
                onClick={handleReactivate}
                className="w-full py-2 px-4 bg-gradient-primary text-white font-semibold rounded-lg hover:shadow-lg transition-shadow"
              >
                Reactivate Subscription
              </button>
            </div>
          </>
        ) : (
          <>
            {/* Free plan state */}
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-4 border-b border-primary-200 dark:border-primary-800">
                <span className="text-muted dark:text-muted">Status</span>
                <span className="px-3 py-1 border border-primary-300 dark:border-primary-700 text-primary-600 dark:text-primary-400 rounded-full text-sm font-semibold">
                  Free Plan
                </span>
              </div>

              <p className="text-sm text-muted dark:text-muted">
                Notes are yours forever — upgrade for Journal, People and Places
              </p>

              <button
                onClick={() => navigate('/pricing')}
                className="w-full py-2 px-4 bg-gradient-primary text-white font-semibold rounded-lg hover:shadow-lg transition-shadow"
              >
                Upgrade to Pro →
              </button>
            </div>
          </>
        )}

        {/* Cancellation confirmation modal */}
        {showCancelConfirm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-default dark:bg-card rounded-lg p-6 max-w-md w-full">
              <div className="flex items-center gap-3 mb-4">
                <AlertTriangle className="w-6 h-6 text-yellow-600" />
                <h4 className="text-lg font-semibold text-primary dark:text-primary-200">
                  Cancel Subscription?
                </h4>
              </div>

              <p className="text-muted dark:text-muted mb-6">
                If you cancel you will lose access to Journal, People and Places at the end of your billing period. Your notes remain free forever.
              </p>

              <div className="space-y-3">
                <button
                  onClick={handleCancel}
                  disabled={isLoading}
                  className="w-full py-2 px-4 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors"
                >
                  {isLoading ? 'Cancelling...' : 'Yes, Cancel'}
                </button>

                <button
                  onClick={() => setShowCancelConfirm(false)}
                  disabled={isLoading}
                  className="w-full py-2 px-4 border border-primary-300 dark:border-primary-700 text-primary-600 dark:text-primary-400 font-semibold rounded-lg hover:bg-primary-50 dark:hover:bg-primary-900/30 disabled:opacity-50 transition-colors"
                >
                  Keep My Subscription
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SubscriptionSettings;
