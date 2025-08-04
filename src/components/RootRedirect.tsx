import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import WelcomePage from '../pages/WelcomePage';

const RootRedirect = () => {
    const { isAuthenticated, loading } = useAuth();

    if (loading) return <p>Loading...</p>;

    return isAuthenticated ? <Navigate to="/home" /> : <WelcomePage />;
};

export default RootRedirect;
