import {type ReactNode } from "react";
import { useAuth } from "../hooks/useAuth";
import { Navigate } from "react-router-dom"; 

interface ProtectedRouteProps {
  children: ReactNode;
  redirectTo?: string; 
}

const ProtectedRoute = ({
  children,
  redirectTo = "/signin",
}: ProtectedRouteProps) => {
  const { user, loading } = useAuth();

  // During the initial auth check, render nothing visible —
  // the HTML app-loader spinner (in index.html) covers this brief moment.
  // Once dismissed by main.tsx, the skeleton from each page takes over.
  if (loading) return null;

  if (!user) {
    return <Navigate to={redirectTo} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;