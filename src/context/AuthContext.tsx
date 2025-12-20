import  { type ReactNode } from "react";
import { useUser } from "../hooks/useUser";
import { AuthContext } from "../hooks/useAuth";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { user, loading, refresh, logout } = useUser();

  return (
    <AuthContext.Provider value={{ user, loading, refresh, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

