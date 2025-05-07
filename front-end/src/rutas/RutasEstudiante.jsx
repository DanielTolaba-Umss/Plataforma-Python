import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LayoutEstudiante from '../layouts/LayoutEstudiante';
import  Dashboard  from '../paginas/estudiante/Dashboard';

const RutasEstudiante = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/*" element={<LayoutEstudiante />} />
            </Routes>
        </BrowserRouter>
    );
};

export default RutasEstudiante;
