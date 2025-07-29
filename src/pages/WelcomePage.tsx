import { useNavigate } from 'react-router-dom';

const WelcomePage = () => {
    const navigate = useNavigate();

    return (
        <div className="welcome-page">
            <h1>Welcome to Vocabloom🌱</h1>
            <p>Every word you learn is a seed for your future</p>
            <button onClick={() => navigate('/login')}>Sign in</button>
            <button onClick={() => navigate('/signup')}>Sign up</button>
        </div>
    );
};

export default WelcomePage;