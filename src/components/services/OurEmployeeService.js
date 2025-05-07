import axios from "axios";

const REST_API_BASE_URL = 'http://localhost:8082/api/ourEmployee';

// Create an Axios instance
const apiClient = axios.create({
    baseURL: REST_API_BASE_URL,
})

// Add a request interceptor to include the Bearer token
apiClient.interceptors.request.use(config => {
    const token = localStorage.getItem("site"); // Get the token from local storage
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`; // Attach the token as Bearer to the headers
    }
    return config;
}, error => {
    return Promise.reject(error);
});

// Save LOI for an employee
export const saveEmployeeLoi = async (loiData, employeeId) => {
    try {
     
        const response = await apiClient.post(`/${employeeId}`, loiData, {
            responseType: 'blob' 
        });

        console.log('Employee LOI saved successfully:', response.data);
        return response; 
    } catch (error) {
        console.error('Error saving employee LOI:', error);
        throw error; 
    }
};