import axios from "axios";

const API_URL = "https://ai-bug-detection.up.railway.app/bugs";

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

export const predictSeverity = async (description) => {
  const response = await axios.post(
    "https://ai-bug-detection.up.railway.app/api/analyze",
    { description }
  );

  return response.data;
};