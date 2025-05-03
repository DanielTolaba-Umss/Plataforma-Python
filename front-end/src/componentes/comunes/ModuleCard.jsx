import { BookOpenIcon } from 'lucide-react';

const ModuleCard = ({ modulo, idx, onClick }) => {
  const colors = [
    { bg: 'bg-blue-100', text: 'text-blue-600' },
    { bg: 'bg-green-100', text: 'text-green-600' },
    { bg: 'bg-purple-100', text: 'text-purple-600' }
  ];
  const color = colors[idx] || colors[0];

  return (
    <div
      className="bg-white rounded-lg shadow-md border border-gray-200 p-6 hover:shadow-lg transition-shadow cursor-pointer"
      onClick={() => onClick(modulo)}
    >
      <div className="flex items-center mb-4">
        <div className={`p-3 rounded-full ${color.bg}`}>
          <BookOpenIcon className={`h-6 w-6 ${color.text}`} />
        </div>
        <h3 className="text-lg font-semibold text-gray-800 ml-3">
          Módulo {modulo}
        </h3>
      </div>
      <p className="text-gray-600">
        Gestiona el contenido y las actividades del módulo {modulo.toLowerCase()} del curso.
      </p>
    </div>
  );
};

export default ModuleCard;
