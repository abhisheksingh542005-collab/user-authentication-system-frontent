import axios from "axios";

const API = axios.create({
  baseURL: "https://user-authentication-system-backent.onrender.com/api/v1",
  withCredentials: true, // Auto-send HttpOnly JWT Cookies
  headers: {
    "Content-Type": "application/json",
  },
});

export default API;