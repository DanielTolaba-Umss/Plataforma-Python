import React, { useState, useEffect } from "react";
import "../../estilos/ModuleList.css";
import { Pencil, Trash } from "lucide-react";
import DeleteModal from "../comunes/DeleteModal";
import { modulosAPI } from "../../api";

const ModuleList = () => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [moduleToDelete, setModuleToDelete] = useState(null);
  const [modules, setModules] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [newModule, setNewModule] = useState({
    title: "",
    description: "",
    orden: "",
    active: true
  });

  // Cargar módulos al montar el componente
  useEffect(() => {
    fetchModules();
  }, []);

  // Función para obtener los módulos
  const fetchModules = async () => {
    try {
      setLoading(true);
      const response = await modulosAPI.obtenerTodos();
      setModules(response.data);
      setError(null);
    } catch (err) {
      setError(err.message || 'Error al cargar los módulos');
    } finally {
      setLoading(false);
    }
  };

  // Función para buscar módulos
  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      fetchModules();
      return;
    }
    
    try {
      setLoading(true);
      const response = await modulosAPI.buscarPorTitulo(searchTerm);
      setModules(response.data);
      setError(null);
    } catch (err) {
      setError(err.message || 'Error al buscar módulos');
    } finally {
      setLoading(false);
    }
  };

  const toggleForm = () => {
    setShowForm(!showForm);
    setEditMode(false);
    setNewModule({
      title: "",
      description: "",
      orden: "",
      active: true
    });
  };

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setNewModule({ ...newModule, [e.target.name]: value });
  };

  const handleCreate = async () => {
    if (!newModule.title || !newModule.description || !newModule.orden) {
      alert("Todos los campos son obligatorios");
      return;
    }

    try {
      setLoading(true);
      await modulosAPI.crear({
        title: newModule.title,
        description: newModule.description,
        orden: parseInt(newModule.orden),
        active: newModule.active
      });
      await fetchModules();
      resetForm();
    } catch (err) {
      setError(err.message || 'Error al crear el módulo');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (modulo) => {
    setEditMode(true);
    setShowForm(true);
    setNewModule({
      id: modulo.id,
      title: modulo.title,
      description: modulo.description,
      orden: modulo.orden,
      active: modulo.active
    });
  };

  const handleUpdate = async () => {
    try {
      setLoading(true);
      await modulosAPI.actualizar(newModule.id, {
        title: newModule.title,
        description: newModule.description,
        orden: parseInt(newModule.orden),
        active: newModule.active
      });
      await fetchModules();
      resetForm();
    } catch (err) {
      setError(err.message || 'Error al actualizar el módulo');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (id) => {
    setModuleToDelete(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      setLoading(true);
      await modulosAPI.eliminar(moduleToDelete);
      await fetchModules();
      setShowDeleteModal(false);
      setModuleToDelete(null);
    } catch (err) {
      setError(err.message || 'Error al eliminar el módulo');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setNewModule({
      id: null,
      title: "",
      description: "",
      orden: "",
      active: true
    });
    setShowForm(false);
    setEditMode(false);
  };

  if (loading) {
    return <div className="loading">Cargando...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="modulo-container">
      <div className="header-modulo">
        <h2>Gestión de Módulos</h2>
        <button className="btn-nuevo" onClick={toggleForm}>
          + Nuevo Módulo
        </button>
      </div>

      {showForm && (
        <div className="formulario-modulo">
          <input
            type="text"
            name="title"
            placeholder="Título del módulo"
            value={newModule.title}
            onChange={handleChange}
          />
          <input
            type="text"
            name="description"
            placeholder="Descripción"
            value={newModule.description}
            onChange={handleChange}
          />
          <input
            type="number"
            name="orden"
            placeholder="Orden"
            value={newModule.orden}
            onChange={handleChange}
          />
          <label>
            <input
              type="checkbox"
              name="active"
              checked={newModule.active}
              onChange={handleChange}
            />
            Activo
          </label>
          {editMode ? (
            <button className="btn-crear" onClick={handleUpdate}>
              Guardar Cambios
            </button>
          ) : (
            <button className="btn-crear" onClick={handleCreate}>
              Crear Módulo
            </button>
          )}
        </div>
      )}

      <div className="busqueda-contenedor">
        <input
          type="text"
          placeholder="🔍 Buscar módulos..."
          className="input-busqueda"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyUp={(e) => e.key === 'Enter' && handleSearch()}
        />
      </div>

      <table className="tabla-modulos">
        <thead>
          <tr>
            <th>Título</th>
            <th>Descripción</th>
            <th>Orden</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>

        <tbody>
          {modules.map((modulo) => (
            <tr key={modulo.id}>
              <td>{modulo.title}</td>
              <td>{modulo.description}</td>
              <td>{modulo.orden}</td>
              <td>
                <span className={`estado ${modulo.active ? 'activo' : 'inactivo'}`}>
                  {modulo.active ? 'Activo' : 'Inactivo'}
                </span>
              </td>
              <td className="acciones">
                <Pencil
                  size={18}
                  className="accion editar"
                  onClick={() => handleEdit(modulo)}
                />
                <Trash
                  size={18}
                  className="accion eliminar"
                  onClick={() => handleDeleteClick(modulo.id)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <DeleteModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={confirmDelete}
        itemName={modules.find(m => m.id === moduleToDelete)?.title}
        itemType="módulo"
      />
    </div>
  );
};

export default ModuleList;
