import { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import VendorService from "./services/VendorService"; // Your vendor API service
import EmployeeService from "./services/UserServices"; // Your employee API service

const AuthContext = createContext();

// Utility: safely parse JSON from localStorage
const safeParse = (key) => {
  try {
    const stored = localStorage.getItem(key);
    if (stored && stored !== "undefined") {
      return JSON.parse(stored);
    }
    return null;
  } catch {
    return null;
  }
};

const AuthProvider = ({ children }) => {
  const navigate = useNavigate();

  // Vendor auth state
  const [vendorToken, setVendorToken] = useState(localStorage.getItem("vendorToken") || "");
  const [vendorUser, setVendorUser] = useState(() => safeParse("vendorUser"));

  // Employee auth state
  const [employeeToken, setEmployeeToken] = useState(localStorage.getItem("employeeToken") || "");
  const [employeeUser, setEmployeeUser] = useState(() => safeParse("employeeUser"));

  // Vendor login
  const loginVendor = async (data) => {
    try {
      const res = await VendorService.login(data.email, data.password);
      console.log("Vendor login response:", res);

      // if (res.refreshToken) {
      //   setVendorToken(res.refreshToken);
      if (res.token) { // assuming your API returns the access token here
        setVendorToken(res.token);
        localStorage.setItem("vendorToken", res.refreshToken);

        // User info is at root, not res.user
        const userData = {
          name: res.name,
          city: res.city,
          role: res.role,
          email: res.email,
          uniqueCode: res.uniqueCode,
        };
        setVendorUser(userData);
        localStorage.setItem("vendorUser", JSON.stringify(userData));

        navigate("/vendor-dashboard");
        return;
      }
      throw new Error(res.message || "Vendor login failed");
    } catch (err) {
      console.error("Vendor login failed:", err);
      throw err;
    }
  };

  // Employee login
  const loginEmployee = async (data) => {
    try {
      const res = await EmployeeService.login(data.email, data.password);
      console.log("Employee login response:", res);

     if (res.token) { // assuming your API returns the access token here
        setEmployeeToken(res.token);
        localStorage.setItem("employeeToken", res.refreshToken);

        // User info at root, not res.user
        const userData = {
          name: res.name,
          city: res.city,
          role: res.role,
          email: res.email,
          uniqueCode: res.uniqueCode,
        };
        setEmployeeUser(userData);
        console.log("user details", userData)
        localStorage.setItem("employeeUser", JSON.stringify(userData));

        navigate("/dashboard");
        return;
      }
      throw new Error(res.message || "Employee login failed");
    } catch (err) {
      console.error("Employee login failed:", err);
      throw err;
    }
  };



  // Vendor logout
  const logoutVendor = () => {
    setVendorToken("");
    setVendorUser(null);
    localStorage.removeItem("vendorToken");
    localStorage.removeItem("vendorUser");
    navigate("/vendorLogin");
  };

  // Employee logout
  const logoutEmployee = () => {
    setEmployeeToken("");
    setEmployeeUser(null);
    localStorage.removeItem("employeeToken");
    localStorage.removeItem("employeeUser");
    navigate("/");
  };

  // Optionally, a global logout clearing both
  const logoutAll = () => {
    logoutVendor();
    logoutEmployee();
    navigate("/vendorLogin");
  };

  return (
    <AuthContext.Provider
      value={{
        vendorToken,
        vendorUser,
        loginVendor,
        logoutVendor,

        employeeToken,
        employeeUser,
        loginEmployee,
        logoutEmployee,

        logoutAll,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;

export const useAuth = () => useContext(AuthContext);






// import { useContext, createContext,useState ,useEffect} from "react";
// import { useNavigate } from "react-router-dom";
// import UsersService from "./services/UserServices";


// const AuthContext = createContext();

// const AuthProvider = ({ children }) => {
//     // const [user, setUser] = useState(null);
//     const[token , setToken] = useState(localStorage.getItem("site")|| "")
//     const navigate = useNavigate();
//     const [user, setUser] = useState(() => {
//       const storedUser = localStorage.getItem("user");
//       return storedUser ? JSON.parse(storedUser) : null;
//     });
  
//     const loginAction = async (data) => {
//         try {
//           const res = await UsersService.login(data.email, data.password);
//           console.log("Login response in AuthProvider:", res);
//           if (res.refreshToken) {
//             setToken(res.refreshToken);
//             localStorage.setItem("site", res.refreshToken);

//             const userData = {
//               name: res.name,
//               city: res.city,
//               role: res.role,
//               email: res.email,
//               uniqueCode: res.uniqueCode,
//             };
//             setUser(userData);
//             localStorage.setItem("user", JSON.stringify(userData));
//             navigate("/dashboard");
//             return;
//           }
//           throw new Error(res.message || "Login failed");
//         } catch (err) {
//           console.error("Login failed in AuthProvider:", err);
//           throw err;
//         }
//       };
    
//       const logOut = () => {
//         setUser(null);
//         setToken("");
//         localStorage.removeItem("site");
//         localStorage.removeItem("user");
//         navigate("/");
//       };

//   return <AuthContext.Provider value={{token ,user,loginAction,logOut}}>
//     {children}
//     </AuthContext.Provider>;
// };

// export default AuthProvider;

// export const useAuth = () => {
//   return useContext(AuthContext);
// };