import axios from "axios";


const REST_API_BASE_URL = 'http://localhost:8082/api/employees';
const creatEmployeePostUrl = 'createEmployee';

export const creatEmployee = (employee) => axios.post(REST_API_BASE_URL+'/'+creatEmployeePostUrl,employee);
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



export const getProfileScreaningList = (location) => {
    return apiClient.get(`${REST_API_BASE_URL}/listOfEmpPorfileScreaning/${location}`)
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

export const getListOfEmployeeScheduleInterview = (location) => {
    return apiClient.get(`${REST_API_BASE_URL}/listOfEmpOnSchedulePage/${location}`);
  };
  

  export const submitScheduleInterview = (employeeId, payload) => {
    return apiClient.post(`${REST_API_BASE_URL}/submitResponseOnScheduleInterviewPage/${employeeId}`, payload);
  };
  
  export const getEmployeesListOnManagerPageWithRoleAndLocation = (role, location) => {
    return apiClient.get(`${REST_API_BASE_URL}/getAllEmployeeOnManagersPage/${role}/${location}`);
  }
  
  export const submitManagerPageResponse = (employeeId, data) => {
    return apiClient.put(`${REST_API_BASE_URL}/managerPageResponseSubmit/${employeeId}`, data);
  };
  
  export const getAllEmployeeRejectedByManager = (location) => {
    return apiClient.get(`${REST_API_BASE_URL}/rejectByManager/${location}`);
  }

  export const submitResponseOnRejectPage = (employeeId , payload) => {
    return apiClient.post(`${REST_API_BASE_URL}/submitResponseOnRejectPage/${employeeId}`,payload);
  }
  export const getListOfEmployeeRejectedInProfileScreening = (location) => {
    return apiClient.get(`${REST_API_BASE_URL}/rejectedbyProfileScreaning/${location}`);
  }  
  export const submitResponseForReScreening = (employeeId, data) => {
    return apiClient.put(`${REST_API_BASE_URL}/submitResponseForReScreening/${employeeId}`, data);
  };
  
  export const getListOfSelectedEmployee = (location) => {
    return apiClient.get(`${REST_API_BASE_URL}/selectEmployee/${location}`);

  }

