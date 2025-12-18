import axios from "axios";

const baseURL = process.env.NEXT_PUBLIC_API_ROOT_URL || "http://localhost:5000";

export const api = axios.create({
  baseURL: `${baseURL}/api`,
});
