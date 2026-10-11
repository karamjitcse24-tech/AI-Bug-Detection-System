
import axios from "axios";

const API_URL =
  "https://ai-bug-detection-system-gm5h.onrender.com";

const bugApi = axios.create({
  baseURL: API_URL,
});

// Attach the JWT token to authenticated API requests.
bugApi.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export const getAllBugs = () => bugApi.get("/bugs");

export const createBug = (bug) => bugApi.post("/bugs", bug);

export const updateBug = (id, bug) =>
  bugApi.put(`/bugs/${id}`, bug);

export const deleteBug = (id) =>
  bugApi.delete(`/bugs/${id}`);

export const analyzeBugWithAI = async (description) => {
  const response = await bugApi.post("/api/analyze", {
    description,
  });

  return response.data;
};
