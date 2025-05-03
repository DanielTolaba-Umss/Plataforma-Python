import React, { useState } from 'react';
import { GraduationCapIcon, FileTextIcon, VideoIcon, FileIcon, CheckSquareIcon } from 'lucide-react';
import ModuleCard from '../../../components/comunes/ModuleCard';
import ManagementOption from '../../../components/comunes/ManagementOption';

const GestionCursos = () => {
  const [selectedModule, setSelectedModule] = useState(null);
  const [showOptions, setShowOptions] = useState(false);

  const handleModuleClick = (module) => {
    setSelectedModule(module);
    setShowOptions(true);
  };

  const handleBackClick = () => setShowOptions(false);

  const options = [
    {
      title: 'Crear Actividades',
      icon: <CheckSquareIcon className="h-5 w-5 text-blue-600" />,
      color: 'blue',
      description: 'Crea nuevas actividades para los estudiantes.'
    },
    {
      title: 'Crear Prácticas',
      icon: <CheckSquareIcon className="h-5 w-5 text-green-600" />,
      color: 'green',
      description: 'Desarrolla ejercicios prácticos para reforzar el aprendizaje.'
    },
    {
      title: 'Crear Exámenes',
      icon: <FileTextIcon className="h-5 w-5 text-red-600" />,
      color: 'red',
      description: 'Prepara evaluaciones para medir el progreso de los estudiantes.'
    },
    {
      title: 'Subir Videos',
      icon: <VideoIcon className="h-5 w-5 text-purple-600" />,
      color: 'purple',
      description: 'Agrega contenido multimedia para enriquecer el aprendizaje.'
    },
    {
      title: 'Subir PDFs',
      icon: <FileIcon className="h-5 w-5 text-yellow-600" />,
      color: 'yellow',
      description: 'Comparte documentos de lectura y material complementario.'
    },
    {
      title: 'Subir Archivos de Texto',
      icon: <FileTextIcon className="h-5 w-5 text-indigo-600" />,
      color: 'indigo',
      description: 'Agrega instrucciones o guías adicionales para los estudiantes.'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 w-full">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-teal-600">Gestión de Cursos</h1>
          <div className="flex items-center space-x-4">
            <button className="text-gray-500 hover:text-gray-700">
              <GraduationCapIcon className="h-6 w-6" />
            </button>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {!showOptions ? (
          <>
            <h2 className="text-xl font-semibold text-gray-800 mb-6">Selecciona un módulo para gestionar</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {['Básico', 'Intermedio', 'Avanzado'].map((modulo, idx) => (
                <ModuleCard key={idx} modulo={modulo} idx={idx} onClick={handleModuleClick} />
              ))}
            </div>
          </>
        ) : (
          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <button className="mr-4 p-2 rounded-full hover:bg-gray-100" onClick={handleBackClick}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <h2 className="text-xl font-semibold text-gray-800">Gestionar Módulo {selectedModule}</h2>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {options.map((item, index) => (
                <ManagementOption key={index} {...item} />
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default GestionCursos;
