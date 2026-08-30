import axios from "axios";

const API_URL = "http://localhost:8080/bugs";

export const getAllBugs = () => {
  return axios.get(API_URL);
};

export const createBug = (bug) => {
  return axios.post(API_URL, bug);
};

export const updateBug = (id, bug) => {
  return axios.put(`${API_URL}/${id}`, bug);
};

export const deleteBug = (id) => {
  return axios.delete(`${API_URL}/${id}`);
};

// AI Analysis
export const analyzeBugWithAI = async (description) => {
  const response = await axios.post(
    "http://localhost:8080/api/analyze",
    {
      description: description,
    }
  );

  return response.data;
};
