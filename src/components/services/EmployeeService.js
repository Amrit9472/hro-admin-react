import axios from "axios";


const REST_API_BASE_URL = 'http://localhost:8082/api/employees';

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

export const getProfileScreaningList = () => {
    return apiClient.get(`${REST_API_BASE_URL}/listOfEmpPorfileScreaning`)
}


export const getEmployeesInformation = (employeeId) => {
  return apiClient.get(`${REST_API_BASE_URL}/employeeStatusTrack/${employeeId}`)
}

export const putResponseOnProfileScreening = (employeeId, StatusRequestDTO) => {
    return apiClient.put(`${REST_API_BASE_URL}/hrResponseSubmitionOnProfilePage/${employeeId}`, StatusRequestDTO);
}
