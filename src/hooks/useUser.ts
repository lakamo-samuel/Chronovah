// hooks/useUser.ts
import { useState, useEffect, useCallback } from "react";
import { authService } from "../services/auth.service";
import { protectedAxios } from "../../axios";
import { syncManager } from "../lib/sync";

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  username?: string;
  bio?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface UseUserReturn {
  user: User | null;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (userData: Partial<User>) => Promise<boolean>;
}

export const useUser = (): UseUserReturn => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUserFromBackend = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await protectedAxios.get("/user/me");
      // Extract user from nested data structure { statusCode, data: {...}, message, success }
      const userData = response.data.data || response.data.user || response.data;
      setUser(userData);
      
      // Pull user data from server
      if (userData?.id) {
        syncManager.pullUserData(userData.id);
      }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error("Failed to fetch user:", err);
      setUser(null);

      if (err.response?.status === 401) {
        // Unauthorized - user is not logged in
        setError(null); // This is expected, don't show error
      } else if (!err.response) {
        setError("Network error. Please check your connection.");
      } else {
        setError(err.response?.data?.error || "Failed to fetch user data");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUserFromBackend();
  }, [fetchUserFromBackend]);

  const logout = useCallback(async () => {
    setLoading(true);

    try {
      // Clear local data before logging out
      if (user?.id) {
        await syncManager.clearUserData(user.id);
      }
      
      await authService.signOut();
      setUser(null);
      // Optionally redirect to login page
      window.location.href = "/signin";
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error("Logout failed:", err);
      setError(err.message || "Logout failed");
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  const updateUser = useCallback(async (userData: Partial<User>) => {
    setLoading(true);
    setError(null);

    try {
      const response = await protectedAxios.patch("/user/update", userData);
      // Extract user from nested data structure
      const updatedUser = response.data.data || response.data.user || response.data;
      setUser(updatedUser);
      return true;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error("Failed to update user:", err);
      setError(err.response?.data?.error || "Failed to update user");
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    user,
    loading,
    error,
    refresh: fetchUserFromBackend,
    logout,
    updateUser,
  };
};
