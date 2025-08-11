import { useState, ChangeEvent } from "react";
import { useAuth } from "../context/useAuth";
import { useNavigate } from 'react-router-dom';
import '../styles/FormPage.css';


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
            navigate('/signup');
        } catch (error) {
            alert("Registration failed. Please try again.");
            navigate('/signup')
        }
    }

    const handleKeyPress = (e: React.KeyboardEvent<HTMLSpanElement>) => {
        if (e.key === "Enter" || e.key === " ") {
            navigate('/login');
        }
    };

    return (
        <main className="form-page">
            <section className="form-section">
                <h1 className="form-title">Sign up</h1>
                <form className="form-form" onSubmit={handleRegister}>
                    <div className="form-group">
                        <input
                            id="firstName"
                            className="form-input"
                            type="text"
                            value={firstName}
                            onChange={(e: ChangeEvent<HTMLInputElement>) => setFirstName(e.target.value)}
                            placeholder="First Name"
                            autoComplete="given-name"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <input
                            id="lastName"
                            className="form-input"
                            type="text"
                            value={lastName}
                            onChange={(e: ChangeEvent<HTMLInputElement>) => setLastName(e.target.value)}
                            placeholder="Last Name"
                            autoComplete="family-name"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <input
                            id="email"
                            className="form-input"
                            type="email"
                            value={email}
                            onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                            placeholder="Email"
                            autoComplete="email"
                            required
                        />
                    </div>
                    <div className="form-group">
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
                        <input
                            id="password"
                            className="form-input"
                            type="password"
                            value={password}
                            onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                            placeholder="Password"
                            autoComplete="new-password"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <input
                            id="confirmPassword"
                            className="form-input"
                            type="password"
                            value={confirmPassword}
                            onChange={(e: ChangeEvent<HTMLInputElement>) => setConfirmPassword(e.target.value)}
                            placeholder="Confirm Password"
                            autoComplete="new-password"
                            required
                        />
                    </div>
                    <button className="form-button" type="submit">Sign up</button>
                </form>
                <p className="form-text">
                    Already have an account?{" "}
                    <button
                        type="button"
                        className="form-link"
                        onClick={() => navigate('/login')}
                        onKeyDown={handleKeyPress}
                    >
                        Log in
                    </button>
                </p>
            </section>
        </main>
    );
};

export default SignUpPage;
