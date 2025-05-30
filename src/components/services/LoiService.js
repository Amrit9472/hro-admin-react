import axios from "axios";

const REST_API_BASE_URL = 'http://localhost:8082/api/loi';

// Create an Axios instance
const apiClient = axios.create({
    baseURL: REST_API_BASE_URL,
})

// Add a request interceptor to include the Bearer token
apiClient.interceptors.request.use(config => {
    const token = localStorage.getItem("employeeToken"); // Get the token from local storage
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`; // Attach the token as Bearer to the headers
    }
    return config;
}, error => {
    return Promise.reject(error);
});


export const getValuesInDropDown = () => {
    return apiClient.get('/dropDown');
}

export const getGridValues = (process, grade, companyType) => {
    return apiClient.get('/filter', {
      params: {
        process: process,
        grade: grade,
        companyType: companyType,
      },
    });
  };

export const getLoiDetailsByGrid = (gridNo ,location) =>{
  return apiClient.get(`/getDetailswithGridNo/${gridNo}/${location}`);
}
    

export const getDegiAndDepart = (location) => {
 return apiClient.get(`/names-by-location/${location}`);
}
