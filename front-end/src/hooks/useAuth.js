import { useState, useEffect } from 'react';
import { authAPI } from '../api';
import { useNavigate } from 'react-router-dom';

export const useAuth = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const checkAuthentication = async () => {
            const accessToken = localStorage.getItem('accessToken');
            if (accessToken) {
                try {
                    const currentUser = authAPI.getCurrentUser();
                    setUser(currentUser);
                } catch (error) {
                    console.error('Error al verificar el token:', error);
                    const refreshed = await authAPI.refreshToken();
                    if (refreshed) {
                        setUser(authAPI.getCurrentUser());
                    } else {
                        setUser(null);
                    }
                }
            }
            setLoading(false);
        };
        
        checkAuthentication();
    }, []);

    useEffect(() => {
        const currentUser = authAPI.getCurrentUser();
        if (currentUser) {
            setUser(currentUser);
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        try {
            setLoading(true);
            const userData = await authAPI.login(email, password);
            setUser(userData);
            navigate('/dashboard');
            return userData;
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        authAPI.logout();
        setUser(null);
        navigate('/login');
    };

    const isAuthenticated = () => {
        return authAPI.isAuthenticated();
    };

    return {
        user,
        loading,
        login,
        logout,
        isAuthenticated
    };
};