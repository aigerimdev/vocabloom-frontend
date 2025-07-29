import axios from "axios";

// Backend base URL
const BASE_URL = "https://vocabloom-backend.onrender.com/api";

//  User Registration
export async function registerUser(userData: {
    username: string;
    email: string;
    password: string;
    first_name: string;
    last_name: string;
}) {
    try {
        // POST request to backend to create a new user
        const response = await axios.post(`${BASE_URL}/register_user/`, userData);
        return response.data; // 📨 Returns user info or success message
    } catch (error: any) {
        // Catch registration errors and log them
        console.error("Registration error:", error);
        throw new Error(error.response?.data?.detail || "Registration failed");
    }
}

// User Login
export async function loginUser(username: string, password: string) {
    try {
        // POST request to get JWT token
        const response = await axios.post(`${BASE_URL}/token/`, {
            username,
            password,
        });

        // Save token to localStorage for authenticated requests
        localStorage.setItem("token", response.data.access);
        return response.data;
    } catch (error: any) {
        // Handle login error
        console.error("Login error:", error);
        throw new Error(error.response?.data?.detail || "Login failed");
    }
}


