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
  const response = await fetch(
    "https://ai-bug-detection.up.railway.app/bugs/predict-severity",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ description }),
    }
  );

  return response.json();
};