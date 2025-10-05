import React from "react";

export default function Navbar({ user, currentView, onViewChange, onLogout }) {
  const navItems = [
    { id: 'home', label: '🏠 Home', icon: '🏠' },
    { id: 'chat', label: '💬 Chat', icon: '💬' },
    { id: 'voice', label: '🎤 Voice', icon: '🎤' },
    { id: 'profile', label: '👤 Profile', icon: '👤' }
  ];

  return (
    <nav style={styles.nav}>
      <div style={styles.logo} onClick={() => onViewChange('home')}>
        🌿 LeafX
      </div>
      
      <ul style={styles.menu}>
        {navItems.map(item => (
          <li 
            key={item.id}
            style={{
              ...styles.menuItem,
              ...(currentView === item.id ? styles.activeItem : {})
            }}
            onClick={() => onViewChange(item.id)}
          >
            <span style={styles.icon}>{item.icon}</span>
            {item.label}
          </li>
        ))}
      </ul>

      <div style={styles.userSection}>
        <span style={styles.welcome}>Welcome, {user?.name || 'User'}!</span>
        <button 
          style={styles.logoutBtn}
          onClick={onLogout}
        >
          Logout
        </button>
      </div>
    </nav>
  );
}

const styles = {
  nav: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#eaf7ea",
    padding: "1rem 2rem",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
    zIndex: 1000
  },
  logo: {
    margin: 0,
    color: "#2e7d32",
    fontWeight: "bold",
    fontSize: "1.5rem",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "0.5rem"
  },
  menu: {
    listStyle: "none",
    display: "flex",
    gap: "1rem",
    margin: 0,
    padding: 0
  },
  menuItem: {
    padding: "0.5rem 1rem",
    borderRadius: "6px",
    cursor: "pointer",
    color: "#333",
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    transition: "all 0.2s ease",
    backgroundColor: "transparent"
  },
  activeItem: {
    backgroundColor: "#2e7d32",
    color: "white"
  },
  icon: {
    fontSize: "1.2rem"
  },
  userSection: {
    display: "flex",
    alignItems: "center",
    gap: "1rem"
  },
  welcome: {
    color: "#2e7d32",
    fontWeight: "500"
  },
  logoutBtn: {
    padding: "0.5rem 1rem",
    backgroundColor: "#dc3545",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "14px"
  }
};
