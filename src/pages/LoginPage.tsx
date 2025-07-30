import React, { useState, ChangeEvent } from "react";
import { useNavigate } from 'react-router-dom';
import { useAuth } from "../context/useAuth";
// import { loginUser } from '../api/auth'; // update path if needed


const LoginPage = () => {

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const { login_user } = useAuth();
    const navigate = useNavigate();


    const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        login_user(username, password)
    }

    const handleKeyPress = (e: React.KeyboardEvent<HTMLSpanElement>) => {
        if (e.key === "Enter" || e.key === " ") {
            navigate('/signup');
        }
    };

    return (
        <div className="login-page">
            <h2>Login</h2>
            <form onSubmit={handleLogin}>
                <input
                    value={username}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)}
                    placeholder="Username"
                    autoComplete="username"
                    required
                />
                <input
                    type="password"
                    value={password}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                    placeholder="Password"
                    autoComplete="current-password"
                    required
                />
                <button type="submit">Log in</button>
            </form>
            <p>
                Don’t have an account?{" "}
                <span
                    onClick={() => navigate('/signup')}
                    tabIndex={0}
                    role="button"
                    onKeyDown={handleKeyPress}
                >
                    Sign up
                </span>
            </p>
        </div>
    );
};

export default LoginPage;
