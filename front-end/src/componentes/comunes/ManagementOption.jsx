// src/components/ManagementOption.jsx
const ManagementOption = ({ title, icon, color, description }) => {
    return (
      <div className={`bg-${color}-50 rounded-lg p-4 hover:bg-${color}-100 transition-colors cursor-pointer`}>
        <div className="flex items-center">
          <div className={`bg-${color}-100 p-2 rounded-full`}>
            {icon}
          </div>
          <h3 className="text-md font-medium text-gray-800 ml-3">{title}</h3>
        </div>
        <p className="text-sm text-gray-600 mt-2 ml-11">{description}</p>
      </div>
    );
  };
  
  export default ManagementOption;
  