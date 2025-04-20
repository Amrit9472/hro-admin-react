import { useContext, createContext,useState ,useEffect} from "react";
import { useNavigate } from "react-router-dom";
import UsersService from "./services/UserServices";


const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    // const [user, setUser] = useState(null);
    const[token , setToken] = useState(localStorage.getItem("site")|| "")
    const navigate = useNavigate();
    const [user, setUser] = useState(() => {
      const storedUser = localStorage.getItem("user");
      return storedUser ? JSON.parse(storedUser) : null;
    });
  
    const loginAction = async (data) => {
        try {
          const res = await UsersService.login(data.email, data.password);
          console.log("Login response in AuthProvider:", res);
          if (res.refreshToken) {
            setToken(res.refreshToken);
            localStorage.setItem("site", res.refreshToken);

            const userData = {
              name: res.name,
              city: res.city,
              role: res.role,
              email: res.email,
              uniqueCode: res.uniqueCode,
            };
            setUser(userData);
            localStorage.setItem("user", JSON.stringify(userData));
            navigate("/dashboard");
            return;
          }
          throw new Error(res.message || "Login failed");
        } catch (err) {
          console.error("Login failed in AuthProvider:", err);
        }
      };
    
      const logOut = () => {
        setUser(null);
        setToken("");
        localStorage.removeItem("site");
        localStorage.removeItem("user");
        navigate("/");
      };

  return <AuthContext.Provider value={{token ,user,loginAction,logOut}}>
    {children}
    </AuthContext.Provider>;
};

export default AuthProvider;

export const useAuth = () => {
  return useContext(AuthContext);
};