import { useState, useEffect } from 'react';
import { cursosAPI } from '../api';

export const useCursos = () => {
    const [cursos, setCursos] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const obtenerCursos = async () => {
        try {
            setLoading(true);
            const response = await cursosAPI.obtenerTodos();
            setCursos(response.data);
            setError(null);
        } catch (err) {
            setError(err.message || 'Error al obtener los cursos');
        } finally {
            setLoading(false);
        }
    };

    const obtenerCursosPorModulo = async (modulo) => {
        try {
            setLoading(true);
            const response = await cursosAPI.obtenerPorModulo(modulo);
            setCursos(response.data);
            setError(null);
        } catch (err) {
            setError(err.message || 'Error al obtener los cursos del módulo');
        } finally {
            setLoading(false);
        }
    };

    const crearCurso = async (cursoDatos) => {
        try {
            setLoading(true);
            const response = await cursosAPI.crear(cursoDatos);
            setCursos(prevCursos => [...prevCursos, response.data]);
            return response.data;
        } catch (err) {
            setError(err.message || 'Error al crear el curso');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const actualizarCurso = async (id, cursoDatos) => {
        try {
            setLoading(true);
            const response = await cursosAPI.actualizar(id, cursoDatos);
            setCursos(prevCursos => 
                prevCursos.map(curso => 
                    curso.id === id ? response.data : curso
                )
            );
            return response.data;
        } catch (err) {
            setError(err.message || 'Error al actualizar el curso');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const eliminarCurso = async (id) => {
        try {
            setLoading(true);
            await cursosAPI.eliminar(id);
            setCursos(prevCursos => prevCursos.filter(curso => curso.id !== id));
        } catch (err) {
            setError(err.message || 'Error al eliminar el curso');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return {
        cursos,
        loading,
        error,
        obtenerCursos,
        obtenerCursosPorModulo,
        crearCurso,
        actualizarCurso,
        eliminarCurso
    };
};