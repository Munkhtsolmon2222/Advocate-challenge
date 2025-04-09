// services/authService.ts
import axios from "axios";

const API_URL = "http://localhost:3000/api"; // Adjust the URL based on your backend

export const login = async (email: string, password: string) => {
  try {
    const response = await axios.post(`${API_URL}/login`, {
      email,
      password,
    });
    return response.data;
  } catch (error) {
    throw new Error("Login failed");
  }
};

export const signup = async (email: string, password: string) => {
  try {
    const response = await axios.post(`${API_URL}/signup`, {
      email,
      password,
    });
    return response.data;
  } catch (error) {
    throw new Error("Signup failed");
  }
};
