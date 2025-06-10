import axios from "axios";

const REST_API_BASE_URL = "http://localhost:8082/api";

// Axios client with token auth
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

// 🔹 Get all training batches
export const getTrainingBatches = () => {
  return apiClient.get("/attendance/batches");
};

// 🔹 Get metadata for a batch (maxAttempts, passingMarks, etc.)
export const getScoreMeta = (batchId) => {
  return apiClient.get("/training-scores/score-meta", {
    params: { batchId },
  });
};

// 🔹 Get candidates for a batch (used for filling score sheet)
export const getCandidatesForBatch = (batchId) => {
  return apiClient.get("/attendance/employees-by-batch", {
    params: { batchId },
  });
};

// 🔹 Get all existing scores for a batch (for editing/viewing)
export const getScoresByBatchId = (batchId) => {
  return apiClient.get("/training-scores/scores", {
    params: { batchId },
  });
};

// 🔹 Get a single employee's score for a batch (optional use)
export const getEmployeeScore = (batchId, employeeId) => {
  return apiClient.get("/training-scores/score", {
    params: { batchId, employeeId },
  });
};

// 🔹 Save a single training score
export const saveTrainingScore = (scoreDto) => {
  return apiClient.post("/training-scores/save-score", scoreDto);
};

// 🔹 Save multiple training scores at once
export const saveMultipleTrainingScores = (scoreDtos) => {
  return apiClient.post("/training-scores/save-scores", scoreDtos);
};