import {type ReactNode } from "react";
// import { useAuth } from "../hooks/useAuth";
// import { Navigate } from "react-router-dom"; 
// import Spinner from "../ui/Spinner";




interface ProtectedRouteProps {
  children: ReactNode;
  redirectTo?: string; 
}

const ProtectedRoute = ({
  children,
  // redirectTo = "/signin",
}: ProtectedRouteProps) => {
  // const { user, loading } = useAuth();

  // if (loading) return <Spinner size="lg" overlay={true} color="blue-500" thickness={4} />;

  // if (!user) {
  //   return <Navigate to={redirectTo} replace />;
  // }

  return <>{children}</>;
};

export default ProtectedRoute;