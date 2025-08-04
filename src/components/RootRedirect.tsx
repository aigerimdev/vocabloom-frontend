import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import WelcomePage from '../pages/WelcomePage';

const RootRedirect = () => {
    const { isAuthenticated, loading } = useAuth();
    const [ready, setReady] = useState(false);

    useEffect(() => {
        // Give it a moment to load from localStorage or cookies
        const timer = setTimeout(() => setReady(true), 100);
        return () => clearTimeout(timer);
    }, []);

    if (loading || !ready) return <p>Loading...</p>;

    return isAuthenticated ? <Navigate to="/home" /> : <WelcomePage />;
};

export default RootRedirect;
