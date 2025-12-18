import axios from "axios";

export const api = axios.create({
  baseURL: "http://10.10.1.200:5000/api",
});
