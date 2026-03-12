import axios from "axios";

const url = process.env.REACT_APP_API_URL || "http://localhost:8080";

export const userAPI = axios.create({
  baseURL: url + '/api/users',
  headers: {
    "Content-Type": "application/json",
  },
});
export const itemAPI = axios.create({
  baseURL: url + '/api/laptops',
  headers: {
    "Content-Type": "application/json",
  },
});