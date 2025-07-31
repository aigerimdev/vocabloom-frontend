import { Navigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";

interface PrivateRouteProps {
    children: React.ReactElement; //changed here
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
    const { isAuthenticated, loading } = useAuth();

    if (loading) {
        return <h1>Loading...</h1>;
    }

    if (isAuthenticated) {
        return <>{children}</>;
    } else {
        return <Navigate to="/welcome" replace />;
    }
};

export default PrivateRoute;