import axios from "axios";

const REST_API_BASE_URL = 'http://localhost:8082/api/process';

const apiClient = axios.create({
    baseURL: REST_API_BASE_URL,
})

apiClient.interceptors.request.use(config => {
    const token = localStorage.getItem("employeeToken"); // Get the token from local storage
     console.log("Interceptor token:", token);
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`; // Attach the token as Bearer to the headers
    }
    return config;
}, error => {
    return Promise.reject(error);
});


export const getAllProcessNameCode = () => {
  return apiClient.get(`${REST_API_BASE_URL}/dropdown`);
}

export const getAllProcessNameCodeRegisterPage = () => {
  return apiClient.get(`${REST_API_BASE_URL}/dropdownRegister`);
}