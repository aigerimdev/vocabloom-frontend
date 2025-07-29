import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../api/auth'; // update path if needed


const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            console.log('Logging in:', username, password);
            const result = await loginUser(username, password);
            console.log('Login successful:', result);
            navigate('/'); // or to another protected page
        } catch (error) {
            console.error('Login failed:', error);
            alert('Login failed. Please check your credentials.');
        }
    };


    return (
        <div className="login-page">
            <h2>Login</h2>
            <input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" />
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
            <button onClick={handleLogin}>Log in</button>
            <p>
                Don’t have an account? <span onClick={() => navigate('/signup')}>Sign up</span>
            </p>
        </div>
    );
};

export default LoginPage;
