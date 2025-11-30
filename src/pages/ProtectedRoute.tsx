
import { Navigate } from "react-router-dom";
import { type ReactNode } from "react";
// import { useAuth } from "../hooks/useAuth";
// import Spinner from "../ui/Spinner";
import { useUser } from "../hooks/useUser";

function ProtectedRoute({ children }: {children: ReactNode}) {
  //1. Load Authenticated user
  // const { loading } = useAuth();

  // //2. while Loading, show spinner

  // if (loading)
  //   return (
  //     <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900">
  //       <Spinner />
  //     </div>
  //   );
  const user = useUser();
  //3. if there is NO user, redirect to the /login

  if (!user) return <Navigate to="/signin" replace />;

  //4. if there is a user, render the app
  if (user) return children;
}

export default ProtectedRoute;
