import axios from "axios";

const REST_API_BASE_URL = 'http://localhost:8082/api/candi';

const apiClient = axios.create({
    baseURL: REST_API_BASE_URL,
})

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

export const postCandidatesDetails = (candidateList) => {
    return apiClient.post(`${REST_API_BASE_URL}/bulk`, candidateList);
}

