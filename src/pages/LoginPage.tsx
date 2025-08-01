import React, { useState, ChangeEvent } from "react";
import { useNavigate } from 'react-router-dom';
import { useAuth } from "../context/useAuth";
import '../styles/FormPage.css'; // Ensure you have the correct path to your CSS file
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
        <main className="form-page">
            <section className="form-section">
                <h1 className="form-title">Log in</h1>
                <form className="form-form" onSubmit={handleLogin}>
                    <div className="form-group">
                        <label htmlFor="username" className="form-label">Username</label>
                        <input
                            id="username"
                            className="form-input"
                            value={username}
                            onChange={(e: ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)}
                            placeholder="Username"
                            autoComplete="username"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password" className="form-label">Password</label>
                        <input
                            id="password"
                            className="form-input"
                            type="password"
                            value={password}
                            onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                            placeholder="Password"
                            autoComplete="current-password"
                            required
                        />
                    </div>
                    <button className="form-button" type="submit">Log in</button>
                </form>
                <p className="form-text">
                    Don’t have an account?{" "}
                    <button
                    type="button"
                    className="form-link"
                    onClick={() => navigate('/signup')}
                    onKeyDown={handleKeyPress}
                    >
                    Sign up
                    </button>
                </p>
            </section>
        </main>
    );
};

export default LoginPage;
