import { create } from 'zustand';
import { protectedAxios } from '../../axios';

interface SubscriptionState {
  plan: 'free' | 'pro';
  isProActive: boolean;
  billingPeriod: 'monthly' | 'yearly' | null;
  nextBillingDate: string | null;
  planExpiresAt: string | null;
  isLoading: boolean;
  fetchStatus: () => Promise<void>;
  reset: () => void;
}

const initialState = {
  plan: 'free',
  isProActive: false,
  billingPeriod: null,
  nextBillingDate: null,
  planExpiresAt: null,
  isLoading: false,
};

export const useSubscriptionStore = create<SubscriptionState>((set) => ({
  ...initialState,

  fetchStatus: async () => {
    set({ isLoading: true });
    try {
      const response = await protectedAxios.get('/subscription/status');
      const data = response.data;

      // Extract plan info - handle nested response structure
      const planData = data.data || data;

      set({
        plan: planData.plan || 'free',
        isProActive: planData.isProActive || false,
        billingPeriod: planData.billingPeriod || null,
        nextBillingDate: planData.nextBillingDate || null,
        planExpiresAt: planData.planExpiresAt || null,
        isLoading: false,
      });

      // Persist to localStorage as cache
      localStorage.setItem(
        'subscription_cache',
        JSON.stringify({
          plan: planData.plan || 'free',
          isProActive: planData.isProActive || false,
          billingPeriod: planData.billingPeriod || null,
          nextBillingDate: planData.nextBillingDate || null,
          planExpiresAt: planData.planExpiresAt || null,
        })
      );
    } catch (error) {
      console.error('Failed to fetch subscription status:', error);
      set({ isLoading: false });

      // Try to restore from cache on error
      const cached = localStorage.getItem('subscription_cache');
      if (cached) {
        const cachedData = JSON.parse(cached);
        set(cachedData);
      }
    }
  },

  reset: () => {
    set(initialState);
    localStorage.removeItem('subscription_cache');
  },
}));
