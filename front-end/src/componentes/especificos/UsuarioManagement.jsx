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
  RefreshCw,
  X
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
  const PAGE_SIZE = 10;

  // Estados para modales
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      let response;
      
      // Determinar el valor de active según el filtro de estado
      let activeFilter = null;
      if (statusFilter === 'ACTIVE') {
        activeFilter = true;
      } else if (statusFilter === 'INACTIVE') {
        activeFilter = false;
      }
      
      // Usar el método general getAllUsers con todos los filtros
      response = await adminAPI.getAllUsers(
        currentPage, 
        PAGE_SIZE, 
        searchTerm || null, 
        null, 
        roleFilter !== 'ALL' ? roleFilter : null,
        activeFilter
      );
      
      let filteredUsers = response.data.content || response.data;
      
      // Debug: Ver estructura de datos y verificar usuarios específicos
      console.log("=== DEBUG: Datos de usuarios recibidos ===");
      console.log("Total usuarios recibidos:", filteredUsers.length);
      console.log("Usuarios completos:", filteredUsers);
      
      // Verificar específicamente los usuarios problemáticos
      const usuario12 = filteredUsers.find(u => u.id === 12);
      const usuario13 = filteredUsers.find(u => u.id === 13);
      
      if (usuario12) {
        console.log("⚠️ Usuario 12 todavía aparece en la respuesta del backend:", usuario12);
      } else {
        console.log("✅ Usuario 12 NO aparece en la respuesta del backend");
      }
      
      if (usuario13) {
        console.log("⚠️ Usuario 13 todavía aparece en la respuesta del backend:", usuario13);
      } else {
        console.log("✅ Usuario 13 NO aparece en la respuesta del backend");
      }
      
      if (filteredUsers.length > 0) {
        console.log("Estructura del primer usuario:", filteredUsers[0]);
      }
      
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
    const user = users.find(u => u.id === userId);
    setUserToDelete(user);
    setShowDeleteModal(true);
  };  const confirmDeleteUser = async () => {
    if (!userToDelete) return;    try {
      setActionLoading(true);
      setErrorMessage('');
      
      console.log(`Intentando eliminar usuario ${userToDelete.id}...`);
      console.log(`Usuario a eliminar:`, {
        id: userToDelete.id,
        name: userToDelete.name,
        lastName: userToDelete.lastName,
        email: userToDelete.email,
        role: userToDelete.role,
        active: userToDelete.active
      });
      
      await adminAPI.deleteUser(userToDelete.id);
      
      // Actualizar la lista eliminando el usuario
      setUsers(users.filter(u => u.id !== userToDelete.id));
      setSuccessMessage(`Usuario ${userToDelete.name} ${userToDelete.lastName} eliminado correctamente`);
      
      // Cerrar modal
      setShowDeleteModal(false);
      setUserToDelete(null);
      
      // Limpiar mensaje después de 3 segundos
      setTimeout(() => setSuccessMessage(''), 3000);    } catch (error) {
      console.error("Error eliminando usuario:", error);
      console.error("Detalles completos del error:", {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        headers: error.response?.headers
      });
      
      let errorMessage = "Error desconocido";
      let shouldCloseModal = false;
      
      if (error.response) {
        switch (error.response.status) {          case 404:
            errorMessage = "El usuario ya no existe en el servidor.";
            // Si el usuario no existe, lo eliminamos de la lista local también
            setUsers(users.filter(u => u.id !== userToDelete.id));
            setSuccessMessage(`Usuario eliminado de la lista (ya no existía en el servidor)`);
            shouldCloseModal = true;
            // Actualizar la lista completa para sincronizar con el backend
            setTimeout(() => {
              fetchUsers();
              setSuccessMessage('');
            }, 2000);
            break;
          case 403:
            errorMessage = "No tienes permisos para eliminar este usuario.";
            break;
          case 401:
            errorMessage = "Tu sesión ha expirado. Por favor, inicia sesión nuevamente.";
            break;
          case 409:
            // Nuevo: manejo específico para conflictos de integridad
            errorMessage = `No se puede eliminar el usuario porque tiene datos relacionados: ${error.response.data?.message || 'Conflicto de integridad referencial'}`;
            break;
          case 400:
            // Nuevo: manejo específico para errores de validación
            errorMessage = `Error de validación: ${error.response.data?.message || 'Datos inválidos'}`;
            break;
          case 500:
            // Nuevo: manejo específico para errores internos del servidor
            errorMessage = `Error interno del servidor: ${error.response.data?.message || 'Error no especificado'}`;
            break;
          default:
            errorMessage = error.response.data?.message || `Error del servidor (${error.response.status}: ${error.response.statusText})`;
        }
      } else if (error.request) {
        errorMessage = "No se pudo conectar con el servidor. Verifica tu conexión.";
      } else {
        errorMessage = error.message;
      }
      // Solo mostrar mensaje de error si no fue un 404 (que se convierte en éxito)
      if (error.response?.status !== 404) {
        setErrorMessage(`Error al eliminar usuario: ${errorMessage}`);
        setTimeout(() => setErrorMessage(''), 8000);
      }
      
      // Cerrar modal si es apropiado
      if (shouldCloseModal || error.response?.status === 404) {
        setShowDeleteModal(false);
        setUserToDelete(null);
      }
    } finally {
      setActionLoading(false);
    }
  };

  const cancelDeleteUser = () => {
    setShowDeleteModal(false);
    setUserToDelete(null);
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
    }  };

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
            Actualizar          </button>
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
                      <td>                        <div className="user-info">
                          <div className="user-avatar">
                            {user.name?.charAt(0) || 'U'}{user.lastName?.charAt(0) || 'S'}
                          </div>
                          <div className="user-details">
                            <span className="user-name">
                              {user.name || 'N/A'} {user.lastName || 'N/A'}
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
              <div className="user-detail-grid">                <div className="detail-item">
                  <label>Nombre completo:</label>
                  <span>{selectedUser.name} {selectedUser.lastName}</span>
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
            </div>          </div>
        </div>
      )}

      {/* Modal de confirmación para eliminar */}
      {showDeleteModal && userToDelete && (
        <div className="modal-overlay">
          <div className="modal-content">            <div className="modal-header">
              <h3>Confirmar eliminación</h3>
            </div>
            <div className="modal-body">
              <div className="delete-confirmation">
                <p>¿Estás seguro de que deseas eliminar este usuario?</p>
                <div className="user-info-delete">
                  <strong>{userToDelete.name} {userToDelete.lastName}</strong>
                  <br />
                  <span>{userToDelete.email}</span>
                  <br />
                  <span className={getRoleBadgeClass(userToDelete.role)}>
                    {getRoleIcon(userToDelete.role)}
                    {userToDelete.role}
                  </span>
                </div>
                <p className="warning-text">
                  <strong>Esta acción no se puede deshacer.</strong>
                </p>
              </div>
            </div>
            <div className="modal-footer">
              <button 
                className="btn-cancel" 
                onClick={cancelDeleteUser}
                disabled={actionLoading}
              >
                Cancelar
              </button>
              <button 
                className="btn-delete" 
                onClick={confirmDeleteUser}
                disabled={actionLoading}
              >
                {actionLoading ? (
                  <>
                    <RefreshCw className="loading-spinner" size={16} />
                    Eliminando...
                  </>
                ) : (
                  <>
                    <Trash2 size={16} />
                    Eliminar Usuario
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mensajes de feedback */}
      {successMessage && (
        <div className="notification success">
          <UserCheck size={20} />
          <span>{successMessage}</span>
          <button onClick={() => setSuccessMessage('')}>
            <X size={16} />
          </button>
        </div>
      )}

      {errorMessage && (
        <div className="notification error">
          <UserX size={20} />
          <span>{errorMessage}</span>
          <button onClick={() => setErrorMessage('')}>
            <X size={16} />
          </button>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
