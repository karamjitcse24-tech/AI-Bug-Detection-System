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
export const predictSeverity = async (description) => {
  const response = await fetch("http://localhost:8080/bugs/predict-severity", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ description }),
  });

  return response.json();
};