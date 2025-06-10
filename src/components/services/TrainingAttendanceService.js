import axios from "axios";

// Base URL for training attendance-related operations
const REST_API_BASE_URL = "http://localhost:8082/api/"; // Adjust if needed

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

// ✅ Get all training batches
export const getTrainingBatches = () => {
  return apiClient.get("training-batch/batches");
};

// ✅ Get employees (not students!) by batchId
export const getEmployeesByBatchId = (batchId) => {
  return apiClient.get("attendance/employees-by-batch", { params: { batchId } });
};

// ✅ Save training attendance
export const saveTrainingAttendance = (attendanceRecords) => {
  return apiClient.post("attendance/save", attendanceRecords);
};  
