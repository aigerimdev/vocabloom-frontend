import Navbar from './Navbar';
import { Outlet } from 'react-router-dom';

const ProtectedLayout = () => {
    return (
        <>
            <Navbar />
            <Outlet />
        </>
    );
};

export default ProtectedLayout;
