import { Navigate, Outlet } from "react-router-dom";
import { Box } from '@mui/material';
import { useSelector } from 'react-redux';
import type { RootState } from '../store/store';
import { UserRole } from '../types/User';
import Navbar from "../pages/Default/Navbar";
import Footer from "../pages/Default/Footer";

type Props = {
    roles?: UserRole[];
    redirectTo?: string;
}

export default function ProtectedRoute({ roles, redirectTo = "/login" }: Props) {
    const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
    
    if (!isAuthenticated || !user) {
        return <Navigate to={redirectTo} replace />
    }
    
    if (roles && roles.length > 0) {
        if (!roles.includes(user.role)) {
            return <Navigate to="/forbidden" replace />
        }
    }
    
    return (
        <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            minHeight: '100vh',
            width: '100%',
            overflow: 'hidden'
        }}>
            <Navbar />
            <Box sx={{ 
                flex: 1,
                width: '100%',
                overflow: 'auto',
                padding: { xs: 0, sm: 0 }
            }}>
                <Outlet />
            </Box>
            <Footer />
        </Box>
    )
}