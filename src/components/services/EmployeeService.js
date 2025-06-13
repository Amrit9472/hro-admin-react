import axios from "axios";


const REST_API_BASE_URL = 'http://localhost:8082/api/employees';
const creatEmployeePostUrl = 'createEmployee';

export const creatEmployee = (employee) => axios.post(REST_API_BASE_URL+'/'+creatEmployeePostUrl,employee);

// export const getVendorNameByEmail = (email) => 
//   axios.get(`${REST_API_BASE_URL}/vendor?email=${encodeURIComponent(email)}`);
export const getVendorNameByEmail = async (email) => {
  try {
    return await axios.get(`${REST_API_BASE_URL}/vendor?email=${encodeURIComponent(email)}`);
  } catch (err) {
    if (err.response && err.response.data && err.response.data.message) {
      // Throw a new error with the backend error message
      throw new Error(err.response.data.message);
    }
    // Fallback error message
    throw err;
  }
};
// Create an Axios instance
const apiClient = axios.create({
    baseURL: REST_API_BASE_URL,
})


// Add a request interceptor to include the Bearer token
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



export const getProfileScreaningList = (location,branch) => {
    return apiClient.get(`${REST_API_BASE_URL}/listOfEmpPorfileScreaning/${location}/${branch}`)
}

// export const getProfileScreaningList = (location) => {
//  const token = localStorage.getItem("employeeToken");
//   console.log("Token from localStorage:", token);
  
//   console.log("API call location:", location);
//     return apiClient.get(`/listOfEmpPorfileScreaning/${location}`);
// };
export const getEmployeesInformation = (employeeId) => {
  return apiClient.get(`${REST_API_BASE_URL}/employeeStatusTrack/${employeeId}`)
}

export const putResponseOnProfileScreening = (employeeId, StatusRequestDTO) => {
    return apiClient.put(`${REST_API_BASE_URL}/hrResponseSubmitionOnProfilePage/${employeeId}`, StatusRequestDTO);
}

export const getListOfEmployeeScheduleInterview = (location,branch) => {
    return apiClient.get(`${REST_API_BASE_URL}/listOfEmpOnSchedulePage/${location}/${branch}`);
  };
  

  export const submitScheduleInterview = (employeeId, payload) => {
    return apiClient.post(`${REST_API_BASE_URL}/submitResponseOnScheduleInterviewPage/${employeeId}`, payload);
  };
  
  export const getEmployeesListOnManagerPageWithRoleAndLocation = (role, location ,branch) => {
    return apiClient.get(`${REST_API_BASE_URL}/getAllEmployeeOnManagersPage/${role}/${location}/${branch}`);
  }
  
  export const submitManagerPageResponse = (employeeId, data) => {
    return apiClient.put(`${REST_API_BASE_URL}/managerPageResponseSubmit/${employeeId}`, data);
  };
  
  export const getAllEmployeeRejectedByManager = (location, branch) => {
    return apiClient.get(`${REST_API_BASE_URL}/rejectByManager/${location}/${branch}`);
  }

  export const submitResponseOnRejectPage = (employeeId , payload) => {
    return apiClient.post(`${REST_API_BASE_URL}/submitResponseOnRejectPage/${employeeId}`,payload);
  }
  export const getListOfEmployeeRejectedInProfileScreening = (location,branch) => {
    return apiClient.get(`${REST_API_BASE_URL}/rejectedbyProfileScreaning/${location}/${branch}`);
  }  
  export const submitResponseForReScreening = (employeeId, data) => {
    return apiClient.put(`${REST_API_BASE_URL}/submitResponseForReScreening/${employeeId}`, data);
  };
  
  export const getListOfSelectedEmployee = (location,branch) => {
    return apiClient.get(`${REST_API_BASE_URL}/selectEmployee/${location}/${branch}`);

  }

