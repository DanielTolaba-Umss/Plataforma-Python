import { useState, useCallback } from 'react';

export const useLoadingError = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const startLoading = useCallback(() => {
        setLoading(true);
        setError(null);
    }, []);

    const stopLoading = useCallback(() => {
        setLoading(false);
    }, []);

    const handleError = useCallback((error) => {
        setError(error?.message || 'Ha ocurrido un error');
        setLoading(false);
    }, []);

    const clearError = useCallback(() => {
        setError(null);
    }, []);

    const withLoading = useCallback(async (asyncFn) => {
        try {
            startLoading();
            const result = await asyncFn();
            return result;
        } catch (err) {
            handleError(err);
            throw err;
        } finally {
            stopLoading();
        }
    }, [startLoading, handleError, stopLoading]);

    return {
        loading,
        error,
        startLoading,
        stopLoading,
        handleError,
        clearError,
        withLoading
    };
};