import axios from "axios";

const REST_API_BASE_URL = "http://localhost:8082/api/training-attendance";

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

export const getProcesses = () => {
  return apiClient.get("/processes");
};

export const getCandidatesByProcess = (process) => {
  return apiClient.get("/candidates", { params: { process } });
};

export const submitTrainingBatch = (batchDetails) => {
  return apiClient.post("/batch", batchDetails);
};

// Fetch process code by process name
export const getProcessCode = (process) => {
  return apiClient.get("/process-code", { params: { process } });
};

// Fetch next serial number for a given location + process + processCode prefix
export const getNextBatchSerial = (prefix) => {
  return apiClient.get("/next-batch-serial", { params: { prefix } });
};
