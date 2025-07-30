import React, { useState, ChangeEvent } from "react";
import { useAuth } from "../context/useAuth";
import { useNavigate } from 'react-router-dom';


const SignUpPage = () => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const { register_user } = useAuth();
    const navigate = useNavigate();
    

    const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            await register_user(firstName, lastName, email, username, password, confirmPassword);
            navigate('/welcome');
        } catch (error) {
            alert("Registration failed. Please try again.");
        }
    }

    return (
        <div className="signup-page">
            <h2>Sign up</h2>
            <form onSubmit={handleRegister}>
                <input
                    type="text"
                    value={firstName}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setFirstName(e.target.value)}
                    placeholder="First Name"
                    autoComplete="given-name"
                    required
                />
                <input
                    type="text"
                    value={lastName}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setLastName(e.target.value)}
                    placeholder="Last Name"
                    autoComplete="family-name"
                    required
                />
                <input
                    type="email"
                    value={email}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                    placeholder="Email"
                    autoComplete="email"
                    required
                />
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
                    autoComplete="new-password"
                    required
                />
                <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm Password"
                    autoComplete="new-password"
                    required
                />
                <button type="submit">Sign up</button>
            </form>
        </div>
    );
};

export default SignUpPage;
