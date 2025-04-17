import axios from "axios";

class UsersService{
    static BASE_URL = "http://localhost:8082"

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
}
export default UsersService;