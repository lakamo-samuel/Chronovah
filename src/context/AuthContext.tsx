import  { type ReactNode, useEffect } from "react";
import { useUser } from "../hooks/useUser";
import { AuthContext } from "../hooks/useAuth";
import { useSubscriptionStore } from "../store/subscriptionStore";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { user, loading, refresh, logout } = useUser();
  const { fetchStatus } = useSubscriptionStore();

  // Fetch subscription status when user logs in
  useEffect(() => {
    if (user && !loading) {
      fetchStatus();
    }
  }, [user?.id, loading, fetchStatus]);

  return (
    <AuthContext.Provider value={{ user, loading, refresh, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

