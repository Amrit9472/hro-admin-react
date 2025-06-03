import axios from "axios";

const REST_API_BASE_URL = "http://localhost:8082/api/attendance"; // Adjust if needed

const apiClient = axios.create({
  baseURL: REST_API_BASE_URL,
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("employeeToken");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Get all available processes
export const getProcesses = () => {
  return apiClient.get("/processes"); // Endpoint should return list of process strings
};

// Get employees filtered by date and process
export const getEmployeesByDateAndProcess = (date, process) => {
  return apiClient.get("/employees", {
    params: { date, process },
  });
};

// Save attendance records (bulk)
export const saveAttendance = (attendanceData) => {
  return apiClient.post("/save", attendanceData);
};
