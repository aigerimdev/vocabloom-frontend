import { useNavigate } from 'react-router-dom';
import '../styles/WelcomePage.css';

const WelcomePage = () => {
    const navigate = useNavigate();

    return (
        <main className="welcome-page">
            <section className="welcome-header">
                <h1 className="welcome-title">
                    Welcome to<br />
                    <span className='welcome-title-highlight'>VocaBloom</span>
                </h1>
                <p className="welcome-subtitle">Every word you learn is a seed for your future</p>
            </section>
            <nav className="welcome-actions" aria-label="Authentication">
                <button className="welcome-btn sign-in" onClick={() => navigate('/login')}>Sign in</button>
                <button className="welcome-btn sign-up" onClick={() => navigate('/signup')}>Sign up</button>
            </nav>
            <footer className="welcome-footer">
                <p>Made with <span role="img" aria-label="love">♥️</span> by Lina &amp; Aigerim</p>
                <p>Ada Developers Academy c23</p>
                <p>2025</p>
            </footer>
        </main>
    );
};

export default WelcomePage;