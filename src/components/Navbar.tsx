import { Link, useNavigate } from 'react-router-dom';
import '../styles/Navbar.css';
import { logout } from "../endpoints/api";
import { useAuth } from "../context/useAuth";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRightFromBracket, faTag, faList } from '@fortawesome/free-solid-svg-icons'
import { faHouse } from '@fortawesome/free-regular-svg-icons'


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
                <Link to="/my-words" className='nav-links-words'>
                    <FontAwesomeIcon icon={faList} className='nav-links-icons'/>
                    <span>My Words</span>
                </Link>
                <Link to="/tags" className='nav-links-tags'>
                    <FontAwesomeIcon icon={faTag} className='nav-links-icons'/>
                    <span>My Tags</span>
                </Link>
                <Link to="/home" aria-label="Home">
                    <FontAwesomeIcon icon={faHouse} className='navbar-icons'/>
                </Link>
                <button onClick={handleLogout} aria-label='Log out'><FontAwesomeIcon icon={faArrowRightFromBracket} /></button>
            </div>
        </nav>
    );
};

export default Navbar;
