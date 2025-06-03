import axios from "axios";

const REST_API_BASE_URL = 'http://localhost:8082/api/candi';

const apiClient = axios.create({
    baseURL: REST_API_BASE_URL,
   
});

const employeeApiClient = axios.create({
    baseURL: REST_API_BASE_URL,
});
// Add request interceptor for authorization token
apiClient.interceptors.request.use(config => {
    const token = localStorage.getItem("vendorToken");

    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
}, error => {
    return Promise.reject(error);
});

employeeApiClient.interceptors.request.use(config => {
    const token = localStorage.getItem("employeeToken");
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
});

// Function to submit a query
export const submitQuery = (vendorEmail, queryText) => {
    return apiClient.post('/raisequery', {
        vendorEmail,
        queryText
    })
    .then(response => {
        return response.data;
    })
    .catch(error => {
        throw error;
    });
}

// Function to fetch candidates by vendor email
export const getCandidatesByVendorEmail = (vendorEmail) => {
    return apiClient.get('/getByVendorEmail', {
        params: { vendorEmail }
    })
    .then(response => {
        return response.data;
    })
    .catch(error => {
        throw error;
    });
}

export const getCandidatesByDateRange = (startDate, endDate, email) => {
    return apiClient.get('/byDateRange', {
        params: { startDate, endDate, email }
    })
    .then(response => {
        return response.data;
    })
    .catch(error => {
        throw error;
    });
}

export const getManagerStatusByEmail = (email) => {
    return apiClient.get(`/manager-status`, {
        params: { email }
    })
    .then(response => {
        return response.data;
    })
    .catch(error => {
        return "Pending";
    });
}

export const getAllQueryForAdminPage = () => {
    return employeeApiClient.get(`${REST_API_BASE_URL}/getAllQueryForAdmin`)
}

export const updateVendorQueryStatus = (id, payload,) => {
  return employeeApiClient.put(`${REST_API_BASE_URL}/${id}/status`,payload);
};


export const getAllStatuses = () => {
  return employeeApiClient.get(`${REST_API_BASE_URL}/vendor-statuses`);
};
