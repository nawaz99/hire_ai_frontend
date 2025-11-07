import axios from "axios";

const API = axios.create({
  baseURL: "https://hire-ai-backend.vercel.app/api", // change to your backend URL
  withCredentials: true,
});

export const registerUser = (data) => API.post("/register", data);
export const loginUser = (data) => API.post("/login", data);
export const logoutUser = () => API.post("/logout");


export default API;