import axios from "axios";

class UsersService{
    static BASE_URL = "http://localhost:8082"

     // Create a separate Axios instance for UsersService
     static userServiceApiClient = axios.create({
        baseURL: UsersService.BASE_URL,
    });

        // Attach Bearer token using interceptor
        static setupInterceptors() {
            UsersService.userServiceApiClient.interceptors.request.use(config => {
                const token = localStorage.getItem("employeeToken");
                if (token) {
                    config.headers['Authorization'] = `Bearer ${token}`;
                }
                return config;
            }, error => {
                return Promise.reject(error);
            });
        }
    
        // Call this once (for example, when your app starts)
        static initialize() {
            UsersService.setupInterceptors();
        }
    
    static async login(email,password){
        try{
            const response = await axios.post(`${UsersService.BASE_URL}/auth/login`,{
                email,password
            });
            console.log('userService page  ',response.data)
            return response.data
        }catch (err) {
            // Log the error and rethrow it
            console.error('Error during login:', err);
            throw err;
        }
    
    }
    // Method to get all process name codes
    static async getAllProcessNameCode() {
        try {
            const response = await UsersService.userServiceApiClient.get(`/auth/admin/get-process-name`);
            return response.data;
        } catch (err) {
            console.error('Error fetching process names:', err);
            throw err;
        }
    }

    // Inside UsersService class
        static async register(userData) {
            try {
            const response = await UsersService.userServiceApiClient.post(`/auth/register`, userData);
            return response.data;
            } catch (err) {
            console.error("Error during registration:", err);
            throw err;
            }
        }

        static async changePassword(userData) {
            // Assuming no specific token is needed for password change
            try {
                const response = await UsersService.userServiceApiClient.post(`${UsersService.BASE_URL}/auth/change-password`, userData);
                return response.data; // Return the response data from the backend
            } catch (err) {
                throw err; // Propagate the error to be handled where the function is called
            }
        }
  
}
export default UsersService;