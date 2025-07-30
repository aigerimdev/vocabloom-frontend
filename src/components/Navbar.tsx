import { Link } from 'react-router-dom';
import '../styles/Navbar.css';
import Logout from '../pages/Logout';

const Navbar = () => {
    return (
        <nav className="navbar">
            <h2 className="main-title">Vocabloom 🌱</h2>
            <div className="nav-links">
                <Link to="/">Home</Link>
                {/* <button className='logout_btn'><Link to="/welcome">Logout</Link></button> */}
                <Logout/>

            </div>
        </nav>
    );
};

export default Navbar;
