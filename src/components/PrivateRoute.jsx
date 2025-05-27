import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./AuthProvider";

// const PrivateRoute = () => {
//   const user = useAuth();
//   if (!user.token) return <Navigate to="/" />;
//   return <Outlet />;
// };


const PrivateRoute = () => {
  const { vendorToken, employeeToken } = useAuth();

  if (!vendorToken && !employeeToken) {
    // no user logged in
    return <Navigate to="/" replace />;
  }
  // logged in — allow access
  return <Outlet />;
};
export default PrivateRoute;