import React, { useState, useEffect } from "react";
import { adminAPI } from "../../api/adminService";
import "../../estilos/Dashboard.css";
import { Users, UserCheck, GraduationCap, BookOpen, TrendingUp } from "lucide-react";

const AdminDashboard = () => {  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    students: 0,
    teachers: 0,
    totalCourses: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getUserStats();
      setStats(response.data);
    } catch (error) {
      console.error("Error cargando estadísticas:", error);
      setError("Error al cargar las estadísticas del dashboard");
    } finally {
      setLoading(false);
    }
  };

  const statsCards = [
    {
      title: "Total Usuarios",
      value: stats.totalUsers,
      icon: Users,
      color: "blue",
      description: "Usuarios registrados"
    },
    {
      title: "Usuarios Activos",
      value: stats.activeUsers,
      icon: UserCheck,
      color: "green",
      description: "Usuarios verificados"
    },    {
      title: "Estudiantes",
      value: stats.students,
      icon: GraduationCap,
      color: "purple",
      description: "Total estudiantes"
    },
    {
      title: "Docentes",
      value: stats.teachers,
      icon: BookOpen,
      color: "orange",
      description: "Total docentes"
    },
    {
      title: "Cursos",
      value: stats.totalCourses,
      icon: TrendingUp,
      color: "teal",
      description: "Cursos disponibles"
    }
  ];

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="loading-message">Cargando dashboard...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-container">
        <div className="error-message">{error}</div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h2>Dashboard Administrativo</h2>
        <div className="admin-profile">
          <div className="admin-avatar">A</div>
          <span>Administrador</span>
        </div>
      </div>

      <div className="dashboard-cards">
        {statsCards.map((card, index) => {
          const IconComponent = card.icon;
          return (
            <div key={index} className={`card card-${card.color}`}>
              <div className="card-icon">
                <IconComponent size={24} />
              </div>
              <div className="card-content">
                <h3>{card.value}</h3>
                <p className="card-title">{card.title}</p>
                <span className="card-description">{card.description}</span>
              </div>
            </div>
          );
        })}      </div>
    </div>
  );
};

export default AdminDashboard;
