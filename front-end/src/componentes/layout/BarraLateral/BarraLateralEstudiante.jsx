import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  BookOpen, 
  GraduationCap, 
  Users, 
  Settings 
} from 'lucide-react';
import styles from './BarraLateral.module.css';

export function BarraLateralEstudiante() {
  return (
    <aside className={styles.sidebarContainer}>
      <div className={styles.logoContainer}>
        <h1 className={styles.logoText}>Python EDU</h1>
      </div>
      
      <nav className={styles.navContainer}>
        <NavLink
          to="/dashboard"

          className={({ isActive }) => 
            `${styles.navLink} ${isActive ? styles.activeLink : ''}`
          }
        >
          <LayoutDashboard className={styles.navIcon} />
          <span>Dashboard</span>
        </NavLink>
        
        <NavLink
          to="/cursos"
          className={({ isActive }) => 
            `${styles.navLink} ${isActive ? styles.activeLink : ''}`
          }
        >
          <BookOpen className={styles.navIcon} />
          <span>Cursos</span>
        </NavLink>
        
        
        <NavLink
          to="/perfil"
          className={({ isActive }) => 
            `${styles.navLink} ${isActive ? styles.activeLink : ''}`
          }
        >
          <Users className={styles.navIcon} />
          <span>Perfil</span>
        </NavLink>
        
        
      </nav>
    </aside>
  );
}
