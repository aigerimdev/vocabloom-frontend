import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async () => {
        // We’ll connect this with backend later
        console.log('Logging in:', username, password);
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
