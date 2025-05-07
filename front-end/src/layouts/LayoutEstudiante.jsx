import React from 'react';
import { BarraLateralEstudiante } from '../componentes/layout/BarraLateral/BarraLateralEstudiante';
import { Dashboard } from '../paginas/estudiante/Dashboard';
import './estilos/LayoutEstudiante.css'; // Importa tu archivo CSS para estilos


const LayoutEstudiante = () => {
    return (
        <div className="layout-estudiante">
            <BarraLateralEstudiante />
            
        </div>
    );
};

export default LayoutEstudiante;