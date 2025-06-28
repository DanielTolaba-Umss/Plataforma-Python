import React, { useState, useEffect, useCallback } from "react";
import { adminAPI } from "../../api/adminService";
import StudentEnrollmentForm from "./StudentEnrollmentForm";
import TeacherAssignmentForm from "./TeacherAssignmentForm";
import "../../estilos/UserManagement.css";
import { 
  Users, 
  UserPlus, 
  GraduationCap, 
  BookOpen, 
  Search, 
  Trash2,
  UserCheck,
  UserX,
  RefreshCw
} from "lucide-react";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [createFormType, setCreateFormType] = useState(''); // 'student' | 'teacher'
  
  // Filtros y búsqueda
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  
  // Paginación
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const PAGE_SIZE = 10;  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Determinar el valor de active según el filtro de estado
      let activeFilter = null;
      if (statusFilter === 'ACTIVE') {
        activeFilter = true;
      } else if (statusFilter === 'INACTIVE') {
        activeFilter = false;
      }
      
      // Usar el método general getAllUsers con todos los filtros
      const response = await adminAPI.getAllUsers(
        currentPage, 
        PAGE_SIZE, 
        searchTerm || null, 
        null, 
        roleFilter !== 'ALL' ? roleFilter : null,
        activeFilter
      );
      
      const filteredUsers = response.data.content || response.data;
      
      setUsers(filteredUsers);
      setTotalPages(response.data.totalPages || Math.ceil(filteredUsers.length / PAGE_SIZE));
    } catch (error) {
      console.error("Error cargando usuarios:", error);
      setError("Error al cargar los usuarios: " + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  }, [roleFilter, statusFilter, searchTerm, currentPage]);
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Resetear página cuando cambien los filtros
  useEffect(() => {
    setCurrentPage(0);
  }, [roleFilter, statusFilter, searchTerm]);

  const handleCreateUser = (type) => {
    setCreateFormType(type);
    setShowCreateForm(true);
  };

  const handleCreateSuccess = () => {
    setShowCreateForm(false);
    setCreateFormType('');
    fetchUsers(); // Recargar lista
  };

  const handleCreateCancel = () => {
    setShowCreateForm(false);
    setCreateFormType('');
  };

  const handleActivateUser = async (userId) => {
    try {
      await adminAPI.activateUser(userId);
      fetchUsers(); // Recargar lista
    } catch (error) {
      console.error("Error activando usuario:", error);
      setError("Error al activar usuario");
    }
  };

  const handleDeactivateUser = async (userId) => {
    try {
      await adminAPI.deactivateUser(userId);
      fetchUsers(); // Recargar lista
    } catch (error) {
      console.error("Error desactivando usuario:", error);
      setError("Error al desactivar usuario");
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este usuario?")) {
      try {
        await adminAPI.deleteUser(userId);
        fetchUsers(); // Recargar lista
      } catch (error) {
        console.error("Error eliminando usuario:", error);
        setError("Error al eliminar usuario");
      }
    }
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case 'STUDENT': return <GraduationCap size={16} />;
      case 'TEACHER': return <BookOpen size={16} />;
      case 'ADMIN': return <Users size={16} />;
      default: return <Users size={16} />;
    }
  };

  const getRoleBadgeClass = (role) => {
    switch (role) {
      case 'STUDENT': return 'role-badge role-student';
      case 'TEACHER': return 'role-badge role-teacher';
      case 'ADMIN': return 'role-badge role-admin';
      default: return 'role-badge';
    }
  };

  if (showCreateForm) {
    return (
      <div className="user-management-container">
        <div className="form-header">
          <h2>
            {createFormType === 'student' ? 'Crear Nuevo Estudiante' : 'Crear Nuevo Docente'}
          </h2>
          <button 
            className="btn-cancel"
            onClick={handleCreateCancel}
          >
            Cancelar
          </button>
        </div>
        
        {createFormType === 'student' ? (
          <StudentEnrollmentForm 
            onSuccess={handleCreateSuccess}
            onCancel={handleCreateCancel}
          />
        ) : (
          <TeacherAssignmentForm 
            onSuccess={handleCreateSuccess}
            onCancel={handleCreateCancel}
          />
        )}
      </div>
    );
  }

  return (
    <div className="user-management-container">
      {/* Header */}
      <div className="management-header">
        <h2>Gestión de Usuarios</h2>
        <div className="header-actions">
          <button 
            className="btn-create btn-student"
            onClick={() => handleCreateUser('student')}
          >
            <UserPlus size={16} />
            Crear Estudiante
          </button>
          <button 
            className="btn-create btn-teacher"
            onClick={() => handleCreateUser('teacher')}
          >
            <UserPlus size={16} />
            Crear Docente
          </button>
        </div>
      </div>

      {/* Filtros */}
      <div className="filters-section">
        <div className="search-box">
          <Search size={16} />
          <input
            type="text"
            placeholder="Buscar por nombre, apellido o email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="filters">
          <select 
            value={roleFilter} 
            onChange={(e) => setRoleFilter(e.target.value)}
            className="filter-select"
          >
            <option value="ALL">Todos los roles</option>
            <option value="STUDENT">Estudiantes</option>
            <option value="TEACHER">Docentes</option>
            <option value="ADMIN">Administradores</option>
          </select>
          
          <select 
            value={statusFilter} 
            onChange={(e) => setStatusFilter(e.target.value)}
            className="filter-select"
          >
            <option value="ALL">Todos los estados</option>
            <option value="ACTIVE">Activos</option>
            <option value="INACTIVE">Inactivos</option>
          </select>
          
          <button 
            className="btn-refresh"
            onClick={fetchUsers}
            disabled={loading}
          >
            <RefreshCw size={16} />
            Actualizar
          </button>
        </div>
      </div>

      {/* Lista de usuarios */}
      {loading ? (
        <div className="loading-container">
          <RefreshCw className="loading-spinner" size={24} />
          <p>Cargando usuarios...</p>
        </div>
      ) : error ? (
        <div className="error-container">
          <p className="error-message">{error}</p>
          <button onClick={fetchUsers} className="btn-retry">
            Reintentar
          </button>
        </div>
      ) : (
        <>
          <div className="users-table-container">
            <table className="users-table">
              <thead>
                <tr>
                  <th>Usuario</th>
                  <th>Email</th>
                  <th>Rol</th>
                  <th>Estado</th>
                  <th>Teléfono</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {users.length === 0 ? (
                  <tr>
                    <td colSpan="6" style={{ textAlign: 'center', padding: '2rem' }}>
                      No se encontraron usuarios
                    </td>
                  </tr>
                ) : (
                  users.map((user) => (
                    <tr key={user.id} className={user.active ? '' : 'user-inactive'}>
                      <td>
                        <div className="user-info">
                          <div className="user-avatar">
                            {user.firstName?.charAt(0) || 'U'}{user.lastName?.charAt(0) || 'S'}
                          </div>
                          <div className="user-details">
                            <span className="user-name">
                              {user.firstName || 'N/A'} {user.lastName || 'N/A'}
                            </span>
                            <span className="user-id">ID: {user.id}</span>
                          </div>
                        </div>
                      </td>
                      <td>{user.email}</td>
                      <td>
                        <span className={getRoleBadgeClass(user.role)}>
                          {getRoleIcon(user.role)}
                          {user.role}
                        </span>
                      </td>
                      <td>
                        <span className={`status-badge ${user.active ? 'status-active' : 'status-inactive'}`}>
                          {user.active ? (
                            <>
                              <UserCheck size={14} />
                              Activo
                            </>
                          ) : (
                            <>
                              <UserX size={14} />
                              Inactivo
                            </>
                          )}
                        </span>
                      </td>
                      <td>{user.phone || 'N/A'}</td>
                      <td>
                        <div className="action-buttons">                          <button 
                            className="btn-action btn-view"
                            onClick={() => setSelectedUser(user)}
                            title="Ver detalles"
                          >
                            <Users size={14} />
                          </button>
                          
                          {user.active ? (
                            <button 
                              className="btn-action btn-deactivate"
                              onClick={() => handleDeactivateUser(user.id)}
                              title="Desactivar usuario"
                            >
                              <UserX size={14} />
                            </button>
                          ) : (
                            <button 
                              className="btn-action btn-activate"
                              onClick={() => handleActivateUser(user.id)}
                              title="Activar usuario"
                            >
                              <UserCheck size={14} />
                            </button>
                          )}
                          
                          <button 
                            className="btn-action btn-delete"
                            onClick={() => handleDeleteUser(user.id)}
                            title="Eliminar usuario"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Paginación */}
          {totalPages > 1 && (
            <div className="pagination">
              <button 
                disabled={currentPage === 0}
                onClick={() => setCurrentPage(currentPage - 1)}
                className="pagination-btn"
              >
                Anterior
              </button>
              
              <span className="pagination-info">
                Página {currentPage + 1} de {totalPages}
              </span>
              
              <button 
                disabled={currentPage >= totalPages - 1}
                onClick={() => setCurrentPage(currentPage + 1)}
                className="pagination-btn"
              >
                Siguiente
              </button>
            </div>
          )}
        </>
      )}

      {/* Modal de detalles de usuario */}
      {selectedUser && (
        <div className="modal-overlay" onClick={() => setSelectedUser(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Detalles del Usuario</h3>
              <button 
                className="modal-close"
                onClick={() => setSelectedUser(null)}
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="user-detail-grid">
                <div className="detail-item">
                  <label>Nombre completo:</label>
                  <span>{selectedUser.firstName} {selectedUser.lastName}</span>
                </div>
                <div className="detail-item">
                  <label>Email:</label>
                  <span>{selectedUser.email}</span>
                </div>
                <div className="detail-item">
                  <label>Rol:</label>
                  <span className={getRoleBadgeClass(selectedUser.role)}>
                    {getRoleIcon(selectedUser.role)}
                    {selectedUser.role}
                  </span>
                </div>
                <div className="detail-item">
                  <label>Teléfono:</label>
                  <span>{selectedUser.phone || 'No especificado'}</span>
                </div>
                <div className="detail-item">
                  <label>Estado:</label>
                  <span className={`status-badge ${selectedUser.active ? 'status-active' : 'status-inactive'}`}>
                    {selectedUser.active ? 'Activo' : 'Inactivo'}
                  </span>
                </div>
                {selectedUser.specialty && (
                  <div className="detail-item">
                    <label>Especialidad:</label>
                    <span>{selectedUser.specialty}</span>
                  </div>
                )}                <div className="detail-item">
                  <label>Email verificado:</label>
                  <span>{selectedUser.emailVerified ? 'Sí' : 'No'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
