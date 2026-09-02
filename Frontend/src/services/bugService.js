import axios from "axios";

// Railway Backend URL
const API_URL =
  "https://ai-bug-detection-system-production.up.railway.app/bugs";

// Get all bugs
export const getAllBugs = () => {
  return axios.get(API_URL);
};

// Create a new bug
export const createBug = (bug) => {
  return axios.post(API_URL, bug);
};

// Update a bug
export const updateBug = (id, bug) => {
  return axios.put(`${API_URL}/${id}`, bug);
};

// Delete a bug
export const deleteBug = (id) => {
  return axios.delete(`${API_URL}/${id}`);
};

// AI Bug Analysis
export const analyzeBugWithAI = async (description) => {
  const response = await axios.post(
    "https://ai-bug-detection-system-production.up.railway.app/api/analyze",
    {
      description: description,
    }
  );

  return response.data;
};