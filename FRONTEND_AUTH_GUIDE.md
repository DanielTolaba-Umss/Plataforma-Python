# 🔐 Guía de Implementación de Autenticación Frontend

## 📋 Tabla de Contenidos
- [Introducción](#introducción)
- [1. Vista de Login](#1-vista-de-login)
- [2. Recuperación de Contraseña](#2-recuperación-de-contraseña)
- [3. Panel de Administración](#3-panel-de-administración)
- [4. Configuración de API](#4-configuración-de-api)
- [5. Hooks de Autenticación](#5-hooks-de-autenticación)
- [6. Validaciones y Errores](#6-validaciones-y-errores)
- [7. Consideraciones de Seguridad](#7-consideraciones-de-seguridad)

---

## Introducción

Este documento proporciona toda la información necesaria para implementar correctamente las vistas de autenticación en el frontend, incluyendo login, recuperación de contraseña y gestión de usuarios desde el panel de administración.

**🎯 Estado del Backend:** ✅ **COMPLETAMENTE FUNCIONAL**
- Todos los endpoints están implementados y probados
- JWT tokens configurados correctamente
- Sistema de emails funcionando
- Redis configurado para tokens temporales

---

## 1. Vista de Login

### 🌐 Endpoint
```javascript
POST /api/auth/login
```

### 📤 Request Body
```javascript
{
  "email": "admin@test.com",
  "password": "123456789"
}
```

### 📥 Response Exitosa (200)
```javascript
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "tokenType": "Bearer",
  "expiresIn": 3600,
  "user": {
    "id": 1,
    "name": "Admin",
    "lastName": "Sistema",
    "email": "admin@test.com",
    "role": "ADMIN",
    "emailVerified": true
  }
}
```

### 🚨 Response de Error (400/401)
```javascript
{
  "message": "Credenciales inválidas",
  "error": "BAD_CREDENTIALS"
}
```

### 💻 Implementación Frontend

```javascript
// Ejemplo de implementación del login
const login = async (email, password) => {
  try {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error en el login');
    }

    const data = await response.json();
    
    // Guardar tokens en localStorage
    localStorage.setItem('accessToken', data.accessToken);
    localStorage.setItem('refreshToken', data.refreshToken);
    localStorage.setItem('user', JSON.stringify(data.user));
    
    return data;
  } catch (error) {
    console.error('Error en login:', error);
    throw error;
  }
};
```

### 🎨 Campos del Formulario
- **Email:** Campo obligatorio con validación de formato
- **Contraseña:** Campo obligatorio, mínimo 8 caracteres
- **Recordarme:** Opcional (manejar con localStorage/sessionStorage)

### 👤 Usuario de Prueba
```javascript
Email: admin@test.com
Contraseña: 123456789
Rol: ADMIN
```

---

## 2. Recuperación de Contraseña

### 🔄 Flujo Completo

#### Paso 1: Solicitar Reset
```javascript
POST /api/auth/email/password-reset/request
```

**Request:**
```javascript
// Como query parameter
GET /api/auth/email/password-reset/request?email=usuario@ejemplo.com
```

**Response Exitosa:**
```javascript
{
  "success": true,
  "message": "Email de recuperación enviado exitosamente",
  "email": "usuario@ejemplo.com"
}
```

#### Paso 2: Validar Token (desde email)
```javascript
GET /api/auth/email/password-reset/validate?token=abc123...
```

**Response Exitosa:**
```javascript
{
  "success": true,
  "valid": true,
  "message": "Token válido",
  "user": {
    "email": "usuario@ejemplo.com",
    "name": "Usuario"
  }
}
```

**Response de Error:**
```javascript
{
  "success": false,
  "valid": false,
  "message": "Token inválido o expirado",
  "error": "INVALID_TOKEN"
}
```

#### Paso 3: Confirmar Nueva Contraseña
```javascript
POST /api/auth/email/password-reset/confirm
```

**Request Body:**
```javascript
{
  "token": "abc123...",
  "newPassword": "nuevaPassword123!"
}
```

**Response Exitosa:**
```javascript
{
  "success": true,
  "message": "Contraseña actualizada exitosamente",
  "user": {
    "email": "usuario@ejemplo.com",
    "name": "Usuario"
  }
}
```

### 💻 Implementación Frontend

```javascript
// Paso 1: Solicitar reset
const requestPasswordReset = async (email) => {
  try {
    const response = await fetch(`/api/auth/email/password-reset/request?email=${encodeURIComponent(email)}`, {
      method: 'POST'
    });
    
    const data = await response.json();
    if (!data.success) {
      throw new Error(data.message);
    }
    
    return data;
  } catch (error) {
    console.error('Error al solicitar reset:', error);
    throw error;
  }
};

// Paso 2: Validar token
const validateResetToken = async (token) => {
  try {
    const response = await fetch(`/api/auth/email/password-reset/validate?token=${token}`);
    const data = await response.json();
    
    return data;
  } catch (error) {
    console.error('Error al validar token:', error);
    throw error;
  }
};

// Paso 3: Confirmar nueva contraseña
const confirmPasswordReset = async (token, newPassword) => {
  try {
    const response = await fetch('/api/auth/email/password-reset/confirm', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token, newPassword })
    });
    
    const data = await response.json();
    if (!data.success) {
      throw new Error(data.message);
    }
    
    return data;
  } catch (error) {
    console.error('Error al confirmar reset:', error);
    throw error;
  }
};
```

### 📝 Validaciones
- **Email:** Formato válido
- **Nueva contraseña:** Mínimo 8 caracteres, máximo 100
- **Token:** Válido y no expirado (1 hora de duración)

---

## 3. Panel de Administración

### 👨‍💼 Gestión de Usuarios

#### Crear Usuario
```javascript
POST /api/admin/users
```

**Headers requeridos:**
```javascript
{
  "Authorization": "Bearer YOUR_ACCESS_TOKEN",
  "Content-Type": "application/json"
}
```

**Request Body:**
```javascript
{
  "name": "Juan",
  "lastName": "Pérez",
  "email": "juan.perez@example.com",
  "phone": "123456789",
  "role": "STUDENT",           // ADMIN, TEACHER, STUDENT
  "password": "password123",
  "emailVerified": true,       // opcional, default false
  "active": true,              // opcional, default true
  
  // Campos específicos por rol:
  "specialPermits": "ALL_PERMISSIONS",  // Solo para ADMIN
  "specialty": "Programación Python"    // Solo para TEACHER
}
```

**Response Exitosa (201):**
```javascript
{
  "id": 123,
  "name": "Juan",
  "lastName": "Pérez",
  "email": "juan.perez@example.com",
  "phone": "123456789",
  "role": "STUDENT",
  "active": true,
  "emailVerified": true,
  "createdAt": "2025-06-03T10:30:00",
  "updatedAt": "2025-06-03T10:30:00",
  "specialPermits": null,      // Solo si es ADMIN
  "specialty": null            // Solo si es TEACHER
}
```

#### Listar Usuarios (con paginación)
```javascript
GET /api/admin/users?page=0&size=10&sort=id,asc&name=Juan&email=juan&role=STUDENT
```

**Query Parameters:**
- `page`: Número de página (default: 0)
- `size`: Tamaño de página (default: 10)
- `sort`: Campo de ordenamiento (default: id,asc)
- `name`: Filtro por nombre (opcional)
- `email`: Filtro por email (opcional)
- `role`: Filtro por rol (opcional)

**Response:**
```javascript
{
  "content": [
    {
      "id": 123,
      "name": "Juan",
      "lastName": "Pérez",
      // ... resto de campos
    }
  ],
  "pageable": {
    "sort": { "sorted": true, "unsorted": false },
    "pageNumber": 0,
    "pageSize": 10
  },
  "totalElements": 50,
  "totalPages": 5,
  "first": true,
  "last": false,
  "numberOfElements": 10
}
```

#### Obtener Usuario por ID
```javascript
GET /api/admin/users/{id}
```

#### Actualizar Usuario
```javascript
PUT /api/admin/users/{id}
```

**Request Body (todos los campos son opcionales):**
```javascript
{
  "name": "Juan Carlos",
  "lastName": "Pérez García",
  "email": "juan.carlos@example.com",
  "phone": "987654321",
  "password": "newPassword123",    // Se encriptará automáticamente
  "emailVerified": true,
  "active": false,
  "specialPermits": "LIMITED_PERMISSIONS",  // Solo para ADMIN
  "specialty": "Machine Learning"           // Solo para TEACHER
}
```

#### Activar/Desactivar Usuario
```javascript
PATCH /api/admin/users/{id}/activate     // Activar
PATCH /api/admin/users/{id}/deactivate   // Desactivar
```

#### Verificar Email Manualmente
```javascript
PATCH /api/admin/users/{id}/verify-email
```

#### Resetear Contraseña (Admin)
```javascript
PATCH /api/admin/users/{id}/reset-password
```

**Request Body:**
```javascript
{
  "newPassword": "nuevaPassword123"
}
```

#### Eliminar Usuario
```javascript
DELETE /api/admin/users/{id}
```

**Response:** 204 No Content

#### Obtener Estadísticas
```javascript
GET /api/admin/stats
```

**Response:**
```javascript
{
  "totalUsers": 150,
  "activeUsers": 145,
  "verifiedUsers": 140,
  "adminCount": 5,
  "teacherCount": 25,
  "studentCount": 120,
  "recentRegistrations": 10
}
```

### 💻 Implementación Frontend - Admin

```javascript
// Configurar interceptor para incluir token automáticamente
const adminAPI = {
  // Crear usuario
  createUser: async (userData) => {
    const response = await fetch('/api/admin/users', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(userData)
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error al crear usuario');
    }
    
    return response.json();
  },

  // Listar usuarios
  getUsers: async (page = 0, size = 10, filters = {}) => {
    const params = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
      sort: 'id,asc',
      ...filters
    });
    
    const response = await fetch(`/api/admin/users?${params}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
      }
    });
    
    return response.json();
  },

  // Más métodos...
};
```

---

## 4. Configuración de API

### 🔧 Interceptor para Tokens

```javascript
// Configuración base de API
class APIClient {
  constructor(baseURL) {
    this.baseURL = baseURL;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const token = localStorage.getItem('accessToken');
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers
      },
      ...options
    };

    try {
      const response = await fetch(url, config);
      
      // Si el token expiró, intentar renovarlo
      if (response.status === 401 && token) {
        const newToken = await this.refreshToken();
        if (newToken) {
          // Reintentar la petición con el nuevo token
          config.headers.Authorization = `Bearer ${newToken}`;
          return fetch(url, config);
        } else {
          // Si no se pudo renovar, redirigir al login
          this.logout();
          window.location.href = '/login';
        }
      }
      
      return response;
    } catch (error) {
      console.error('Error en petición:', error);
      throw error;
    }
  }

  async refreshToken() {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) return null;

    try {
      const response = await fetch(`${this.baseURL}/api/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken })
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('accessToken', data.accessToken);
        localStorage.setItem('refreshToken', data.refreshToken);
        return data.accessToken;
      }
    } catch (error) {
      console.error('Error al renovar token:', error);
    }

    return null;
  }

  logout() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
  }
}

const api = new APIClient('http://localhost:8080');
```

---

## 5. Hooks de Autenticación

### 🪝 useAuth Hook

```javascript
import { useState, useEffect, useContext, createContext } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      setUser(JSON.parse(userData));
    }
    
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message);
      }

      const data = await response.json();
      
      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('refreshToken', data.refreshToken);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      setUser(data.user);
      return data;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    setUser(null);
  };

  const isAuthenticated = () => {
    return !!localStorage.getItem('accessToken') && !!user;
  };

  const hasRole = (role) => {
    return user?.role === role;
  };

  const isAdmin = () => hasRole('ADMIN');
  const isTeacher = () => hasRole('TEACHER');
  const isStudent = () => hasRole('STUDENT');

  const value = {
    user,
    loading,
    login,
    logout,
    isAuthenticated,
    hasRole,
    isAdmin,
    isTeacher,
    isStudent
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }
  return context;
};
```

### 🛡️ ProtectedRoute Component

```javascript
import { Navigate } from 'react-router-dom';
import { useAuth } from './useAuth';

export const ProtectedRoute = ({ children, requireRole = null }) => {
  const { isAuthenticated, hasRole, loading } = useAuth();

  if (loading) {
    return <div>Cargando...</div>;
  }

  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  if (requireRole && !hasRole(requireRole)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

// Uso:
// <ProtectedRoute requireRole="ADMIN">
//   <AdminPanel />
// </ProtectedRoute>
```

---

## 6. Validaciones y Errores

### ✅ Validaciones de Formularios

```javascript
// Validadores reutilizables
export const validators = {
  email: (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) return 'El email es obligatorio';
    if (!emailRegex.test(email)) return 'El formato del email es inválido';
    return null;
  },

  password: (password) => {
    if (!password) return 'La contraseña es obligatoria';
    if (password.length < 8) return 'La contraseña debe tener al menos 8 caracteres';
    if (password.length > 100) return 'La contraseña no puede exceder 100 caracteres';
    return null;
  },

  name: (name) => {
    if (!name) return 'El nombre es obligatorio';
    if (name.length < 2) return 'El nombre debe tener al menos 2 caracteres';
    if (name.length > 50) return 'El nombre no puede exceder 50 caracteres';
    return null;
  },

  phone: (phone) => {
    if (phone && phone.length > 20) return 'El teléfono no puede exceder 20 caracteres';
    return null;
  }
};

// Hook para validación de formularios
export const useFormValidation = (initialValues, validationRules) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const validateField = (name, value) => {
    if (validationRules[name]) {
      return validationRules[name](value);
    }
    return null;
  };

  const handleChange = (name, value) => {
    setValues(prev => ({ ...prev, [name]: value }));
    
    if (touched[name]) {
      const error = validateField(name, value);
      setErrors(prev => ({ ...prev, [name]: error }));
    }
  };

  const handleBlur = (name) => {
    setTouched(prev => ({ ...prev, [name]: true }));
    const error = validateField(name, values[name]);
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const validateAll = () => {
    const newErrors = {};
    Object.keys(validationRules).forEach(field => {
      const error = validateField(field, values[field]);
      if (error) newErrors[field] = error;
    });
    
    setErrors(newErrors);
    setTouched(Object.keys(validationRules).reduce((acc, key) => {
      acc[key] = true;
      return acc;
    }, {}));
    
    return Object.keys(newErrors).length === 0;
  };

  return {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    validateAll,
    isValid: Object.keys(errors).length === 0
  };
};
```

### 🚨 Manejo de Errores

```javascript
// Tipos de errores comunes del backend
export const ErrorTypes = {
  INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',
  USER_NOT_FOUND: 'USER_NOT_FOUND',
  EMAIL_ALREADY_EXISTS: 'EMAIL_ALREADY_EXISTS',
  INVALID_TOKEN: 'INVALID_TOKEN',
  TOKEN_EXPIRED: 'TOKEN_EXPIRED',
  ACCESS_DENIED: 'ACCESS_DENIED',
  VALIDATION_ERROR: 'VALIDATION_ERROR'
};

// Mensajes de error amigables
export const getErrorMessage = (error) => {
  const errorMessages = {
    [ErrorTypes.INVALID_CREDENTIALS]: 'Email o contraseña incorrectos',
    [ErrorTypes.USER_NOT_FOUND]: 'Usuario no encontrado',
    [ErrorTypes.EMAIL_ALREADY_EXISTS]: 'Ya existe una cuenta con este email',
    [ErrorTypes.INVALID_TOKEN]: 'El enlace no es válido o ha expirado',
    [ErrorTypes.TOKEN_EXPIRED]: 'El enlace ha expirado, solicita uno nuevo',
    [ErrorTypes.ACCESS_DENIED]: 'No tienes permisos para acceder a esta página',
    [ErrorTypes.VALIDATION_ERROR]: 'Por favor revisa los datos ingresados'
  };

  return errorMessages[error] || 'Ha ocurrido un error inesperado';
};

// Hook para manejo de errores
export const useErrorHandler = () => {
  const [error, setError] = useState(null);

  const handleError = (err) => {
    console.error('Error:', err);
    
    if (err.response?.status === 401) {
      // Token expirado o inválido
      setError(getErrorMessage(ErrorTypes.ACCESS_DENIED));
    } else if (err.response?.status === 409) {
      // Conflicto (ej: email ya existe)
      setError(getErrorMessage(ErrorTypes.EMAIL_ALREADY_EXISTS));
    } else if (err.message) {
      setError(err.message);
    } else {
      setError('Ha ocurrido un error inesperado');
    }
  };

  const clearError = () => setError(null);

  return { error, handleError, clearError };
};
```

---

## 7. Consideraciones de Seguridad

### 🔒 Mejores Prácticas

#### Almacenamiento de Tokens
```javascript
// ✅ RECOMENDADO: localStorage para SPA
localStorage.setItem('accessToken', token);

// ❌ NO RECOMENDADO: Cookies sin httpOnly en SPA
// document.cookie = `token=${token}`;
```

#### Validación de Roles
```javascript
// ✅ SIEMPRE validar en el backend
const hasPermission = (requiredRole) => {
  // Validación del frontend (solo UI)
  const user = JSON.parse(localStorage.getItem('user'));
  return user?.role === requiredRole;
};

// El backend SIEMPRE debe validar permisos:
// @PreAuthorize("hasRole('ADMIN')")
```

#### Renovación de Tokens
```javascript
// ✅ Renovar tokens automáticamente
const setupTokenRefresh = () => {
  const accessToken = localStorage.getItem('accessToken');
  if (!accessToken) return;

  // Decodificar JWT para obtener expiración
  const payload = JSON.parse(atob(accessToken.split('.')[1]));
  const expirationTime = payload.exp * 1000;
  const currentTime = Date.now();
  const timeUntilExpiry = expirationTime - currentTime;

  // Renovar 5 minutos antes de que expire
  const refreshTime = Math.max(timeUntilExpiry - 5 * 60 * 1000, 0);

  setTimeout(async () => {
    try {
      await refreshToken();
      setupTokenRefresh(); // Programar siguiente renovación
    } catch (error) {
      console.error('Error al renovar token:', error);
      logout();
    }
  }, refreshTime);
};
```

#### Limpieza de Datos Sensibles
```javascript
// ✅ Limpiar datos al cerrar sesión
const logout = () => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('user');
  
  // Limpiar estado de la aplicación
  setUser(null);
  
  // Redirigir al login
  window.location.href = '/login';
};

// ✅ Limpiar al cerrar ventana/pestaña
window.addEventListener('beforeunload', () => {
  // Opcional: limpiar datos sensibles
  sessionStorage.clear();
});
```

---

## 📚 Recursos Adicionales

### 🔗 Endpoints de Utilidad

```javascript
// Verificar si token es válido
GET /api/auth/verify
Headers: Authorization: Bearer TOKEN

// Cerrar sesión (opcional)
POST /api/auth/logout

// Renovar token
POST /api/auth/refresh
Body: { "refreshToken": "..." }
```

### 🎯 URLs del Email de Recuperación

El backend enviará emails con URLs como:
```
http://tu-frontend.com/reset-password?token=abc123...
```

Tu frontend debe capturar el token de la URL y usarlo en el flujo de reset.

### 📱 Responsive Design

Asegúrate de que las vistas sean responsive:
- Login: Centrado, máximo 400px de ancho
- Reset: Formularios step-by-step
- Admin: Tabla responsive con filtros

### 🔍 Testing

```javascript
// Datos de prueba
const testUsers = {
  admin: { email: 'admin@test.com', password: '123456789' },
  // Crear más usuarios desde el panel de admin
};

// URLs de prueba
const testURLs = {
  login: 'http://localhost:3000/login',
  admin: 'http://localhost:3000/admin/users',
  reset: 'http://localhost:3000/reset-password?token=test123'
};
```

---

## ⚠️ Notas Importantes

1. **🔐 Autenticación Requerida:** Todos los endpoints `/api/admin/*` requieren token JWT válido

2. **📧 Configuración de Email:** El backend está configurado para enviar emails reales. En desarrollo, revisa los logs para ver los enlaces de reset.

3. **⏰ Expiración de Tokens:** 
   - Access Token: 1 hora
   - Refresh Token: 7 días
   - Password Reset Token: 1 hora

4. **🛡️ Roles Disponibles:**
   - `ADMIN`: Acceso completo al panel de administración
   - `TEACHER`: Acceso a funciones de docente
   - `STUDENT`: Acceso a funciones de estudiante

5. **🚀 CORS:** El backend está configurado para permitir requests desde el frontend en desarrollo.

---

## ✅ Checklist de Implementación

- [ ] Vista de login con validaciones
- [ ] Vista de "Olvidé mi contraseña"
- [ ] Vista de reset de contraseña (con token de URL)
- [ ] Panel de admin - crear usuarios
- [ ] Panel de admin - listar usuarios con paginación
- [ ] Panel de admin - editar usuarios
- [ ] Panel de admin - activar/desactivar usuarios
- [ ] Hook useAuth implementado
- [ ] ProtectedRoute component
- [ ] Manejo de errores centralizado
- [ ] Renovación automática de tokens
- [ ] Responsive design
- [ ] Testing con usuario admin

---

**🎉 ¡Listo para implementar!** El backend está completamente funcional y esperando a que el frontend consuma estos endpoints.
