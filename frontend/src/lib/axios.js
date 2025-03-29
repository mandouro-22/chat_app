import axios from "axios";

export const axiosInstanace = axios.create({
  baseURL:
    import.meta.env.MODE === "development"
      ? "http://localhost:5050/api"
      : "/api",
  withCredentials: true,
});
