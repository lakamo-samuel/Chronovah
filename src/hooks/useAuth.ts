import { createContext, useContext } from "react";

type User = { id: string; name?: string; email: string } | null;


type AuthContextType = {
  user: User;
  loading: boolean;
  signIn: (
    email: string,
    //password: string,
    remember?: boolean
  ) => Promise<void>;
  signUp: (name: string, email: string, password: string) => Promise<void>;
  signOut: () => void;
};
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
