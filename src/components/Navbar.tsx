import { Link } from 'react-router-dom';
import '../styles/Navbar.css';

const Navbar = () => {
    return (
        <nav className="navbar">
            <h2 className="main-title">Vocabloom 🌱</h2>
            <div className="nav-links">
                <Link to="/">Home</Link>
                <button className='logout_btn'><Link to="/login">Logout</Link></button>
            </div>
        </nav>
    );
};

export default Navbar;
