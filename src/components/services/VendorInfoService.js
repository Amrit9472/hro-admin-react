import axios from "axios";

const REST_API_BASE_URL = 'http://localhost:8082/api/vendorInfo';

const apiClient = axios.create({
    baseURL: REST_API_BASE_URL,
})

const employeeApiClient = axios.create({
    baseURL: REST_API_BASE_URL,
});

employeeApiClient.interceptors.request.use(config => {
    const token = localStorage.getItem("employeeToken");
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
});
apiClient.interceptors.request.use(config => {
    const token = localStorage.getItem("vendorToken"); // Get the token from local storage
     console.log("Interceptor token for vendor:", token);

    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`; // Attach the token as Bearer to the headers
    }
    return config;
}, error => {
    return Promise.reject(error);
});


export const postVendorInfo = (candidateList) => {
    return apiClient.post(`${REST_API_BASE_URL}/createVendorInfo`, candidateList);
}


export const getVendorInfoList = () => {
    return employeeApiClient.get(`${REST_API_BASE_URL}/list`);
};
export const getVendorStatusEnums = () => {
  return employeeApiClient.get(`${REST_API_BASE_URL}/vendor-detalils-status`);
};

export const updateVendorVerification = (id, payload) => {
  return employeeApiClient.put(`/${id}/verification-vendor-details`, payload);
};