import { useState, type ReactNode } from "react";
import { AuthContext } from "../hooks/useAuth";

type User = { id: string; name?: string; email: string } | null;



export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User>(null);
  const [loading, setLoading] = useState(false);
  // password: string,
  const signIn = async (email: string, remember: boolean = false,) => {
      setLoading(true);
      
      await new Promise((r) => setTimeout(r, 700)); 
      
    setUser({ id: "local-1", email, name: email.split("@")[0] });
    if (remember) localStorage.setItem("auth_user", JSON.stringify({ email }));
    setLoading(false);
  };
  // password: string
  const signUp = async (name: string, email: string) => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 900));
    setUser({ id: "local-2", name, email });
    setLoading(false);
  };

  const signOut = () => {
    setUser(null);
    localStorage.removeItem("auth_user");
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};
