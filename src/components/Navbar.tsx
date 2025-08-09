import { Link, useNavigate } from 'react-router-dom';
import '../styles/Navbar.css';
import { logout } from "../endpoints/api";
import { useAuth } from "../context/useAuth";
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
// import { faEnvelope } from '@fortawesome/free-solid-svg-icons'


const Navbar = () => {
    const navigate = useNavigate();
    const { setIsAuthenticated } = useAuth();

    const handleLogout = async () => {
        await logout();
        setIsAuthenticated(false);
        navigate('/');
    };


    return (
        <nav className="navbar">
            <Link to="/home" className="main-title">
                VocaBloom <span>🌱</span>
            </Link>
            <div className="nav-links">
                <Link to="/home">Home</Link>
                <button onClick={handleLogout}>Log out</button>
                {/* <FontAwesomeIcon icon={faEnvelope} /> */}
            </div>
        </nav>
    );
};

export default Navbar;
