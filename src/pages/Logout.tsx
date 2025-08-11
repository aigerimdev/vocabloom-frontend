import { useNavigate } from "react-router-dom";
import { logout } from "../endpoints/api";
import { useAuth } from "../context/useAuth";

const Logout = () => {
    const navigate = useNavigate();
    const { setIsAuthenticated } = useAuth();

    const handleLogout = async () => {
        await logout();
        setIsAuthenticated(false);
        navigate('/welcome');
    };

    return (
        <div>
            <button onClick={handleLogout}>Log out</button>
        </div>
    );
};

export default Logout;