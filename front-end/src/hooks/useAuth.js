import { useState, useEffect } from 'react';
import { authAPI } from '../api';
import { useNavigate } from 'react-router-dom';

export const useAuth = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

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
        } catch (error) {
            throw error;
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