import axios from "axios";

const API_URL = "https://ai-bug-detection.up.railway.app";
export const getAllBugs = () => {
  return axios.get(`${API_URL}/bugs`);
};

export const createBug = (bug) => {
  return axios.post(`${API_URL}/bugs`, bug);
};

export const updateBug = (id, bug) => {
  return axios.put(`${API_URL}/bugs/${id}`, bug);
};

export const deleteBug = (id) => {
  return axios.delete(`${API_URL}/bugs/${id}`);
};

export const analyzeBugWithAI = async (description) => {
  const response = await axios.post(
    `${API_URL}/api/analyze`,
    { description }
  );

  return response.data;
};
