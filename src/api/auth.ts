// Backend base URL
const BASE_URL = "https://vocabloom-backend.onrender.com/api";

// User Registration
export async function registerUser(userData: {
    username: string;
    email: string;
    password: string;
    first_name: string;
    last_name: string;
}) {
    try {
        const response = await fetch(`${BASE_URL}/register_user/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(userData),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.detail || "Registration failed");
        }

        const data = await response.json();
        return data; // Typically includes user info
    } catch (error) {
        console.error("Registration error:", error);
        throw error;
    }
}

// User Login
export async function loginUser(username: string, password: string) {
    try {
        const response = await fetch(`${BASE_URL}/token/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ username, password }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.detail || "Login failed");
        }

        const data = await response.json();
        localStorage.setItem("token", data.access); // Save access token to local storage
        return data;
    } catch (error) {
        console.error("Login error:", error);
        throw error;
    }
}


