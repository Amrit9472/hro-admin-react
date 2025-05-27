import axios from "axios";

class VendorService {
   static BASE_URL = "http://localhost:8082"

   static vendorServiceApiClient = axios.create({
         baseURL:VendorService.BASE_URL,
   });

   static setupInterceptors(){
    VendorService.vendorServiceApiClient.interceptors.request.use(config =>{
        const token = localStorage.getItem("site");
        if(token){
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },error => {
      return Promise.reject(error);
    });
   }
   static initialize(){
    VendorService.setupInterceptors();
   }

    static async login(email, password) {
        try {
         const response = await axios.post(`${VendorService.BASE_URL}/auth/vendor/login`,{
            email,password
         });
         console.log('Vendor Service page' , response.data)
         return response.data
        } catch (err) {
             console.error('Error during login:', err);
            throw err;
        }
    }

     static async register(userData) {
            try {
            const response = await VendorService.vendorServiceApiClient.post(`/auth/vendor/register`, userData);
             console.error("Vendor during registration:", response.data);
            return response.data;
            } catch (err) {
            console.error("Error during registration:", err);
            throw err;
            }
        }
}
export default VendorService;

