import { useState, useEffect, useCallback } from "react";
interface UseUserReturn {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  user: any | null;
  loading: boolean;
  refresh: () => void;
  logout: () => void;
}
export const useUser =(): UseUserReturn => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchUserFromBackend = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:8000/api/user/me", {
        credentials: "include",
      });
      if (!res.ok) {
        setUser(null);
        return;
      }
      const data = await res.json();
      setUser(data.user);
    } catch (err) {
      console.error("Failed to fetch user:", err);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUserFromBackend();
  }, [fetchUserFromBackend]);

  const logout = useCallback(async () => {
    try {
      await fetch("http://localhost:8000/api/user/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch (err) {
      console.error("Logout failed:", err);
    } finally {
      setUser(null);
    }
  }, []);

  return { user, loading, refresh: fetchUserFromBackend, logout };
};
