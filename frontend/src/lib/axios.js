import axios from "axios";

export const axiosInstanace = axios.create({
  baseURL: "http://localhost:5050/api",
  withCredentials: true,
});
