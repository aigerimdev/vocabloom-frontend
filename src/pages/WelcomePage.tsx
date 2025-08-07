import { useNavigate } from 'react-router-dom';
import welcomeImage from '../assets/nobackground_welcome.png';
import '../styles/WelcomePage.css';

const WelcomePage = () => {
    const navigate = useNavigate();
    return (
        <main className="welcome-page">
            <div className="welcome-content">
                {/* LEFT SIDE */}
                <section className="welcome-left">
                    <h1 className="welcome-title">
                        Welcome to<br />
                        <span className="welcome-title-highlight">VocaBloom</span>
                    </h1>
                    <p className="welcome-subtitle">Every word you learn is a seed for your future</p>
                </section>

                {/* RIGHT SIDE */}
                <section className="welcome-right">
                    <div className="welcome-image-desktop"><img src={welcomeImage} alt="Book with sprout" />
                        <img src={welcomeImage} alt="Book with sprout" />

                    </div>

                    <nav className="welcome-actions" aria-label="Authentication">
                        <button className="welcome-btn sign-in" onClick={() => navigate('/login')}>Sign in</button>
                        <button className="welcome-btn sign-up" onClick={() => navigate('/signup')}>Sign up</button>
                    </nav>
                </section>
            </div>

            <footer className="welcome-footer">
                <p>Made with ❤️ in Seattle</p>
                <p>Developed by Lina & Aigerim</p>
                <p>Ada Developers Academy c23</p>
                <p>2025</p>
            </footer>
        </main>
    );
};

export default WelcomePage;