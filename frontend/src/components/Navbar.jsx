import React from "react";

export default function Navbar({ user, currentView, onViewChange, onLogout }) {
  const navItems = [
    { id: 'home', label: '🏠 Home', icon: '🏠' },
    { id: 'marketplace', label: '🛒 Marketplace', icon: '🛒' },
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
    backgroundColor: "#2d5a3d",
    color: "white",
    padding: "1rem 2rem",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    zIndex: 1000,
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
  },
  logo: {
    fontSize: "1.5rem",
    fontWeight: "bold",
    cursor: "pointer",
    userSelect: "none"
  },
  menu: {
    display: "flex",
    listStyle: "none",
    margin: 0,
    padding: 0,
    gap: "0.5rem"
  },
  menuItem: {
    padding: "0.75rem 1rem",
    cursor: "pointer",
    borderRadius: "4px",
    transition: "background-color 0.2s",
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    fontSize: "0.9rem"
  },
  activeItem: {
    backgroundColor: "#4a7c59",
    fontWeight: "bold"
  },
  icon: {
    fontSize: "1rem"
  },
  userSection: {
    display: "flex",
    alignItems: "center",
    gap: "1rem"
  },
  welcome: {
    fontSize: "0.9rem",
    color: "#e8f5e8"
  },
  logoutBtn: {
    padding: "0.5rem 1rem",
    backgroundColor: "#dc3545",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "0.8rem"
  }
};

// import React from "react";

// export default function Navbar() {
//   return (
//     <nav style={styles.nav}>
//       <h2 style={styles.logo}>🌿 LeafX</h2>
//       <ul style={styles.menu}>
//         <li>Home</li>
//         <li>Marketplace</li>
//         <li>User Profile</li>
//       </ul>
//     </nav>
//   );
// }

// const styles = {
//   nav: {
//     display: "flex",
//     justifyContent: "space-between",
//     alignItems: "center",
//     backgroundColor: "#eaf7ea",
//     padding: "1rem 2rem",
//     boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
//   },
//   logo: {
//     margin: 0,
//     color: "#2e7d32",
//     fontWeight: "bold"
//   },
//   menu: {
//     listStyle: "none",
//     display: "flex",
//     gap: "2rem",
//     margin: 0,
//     cursor: "pointer",
//     color: "#333"
//   }
// };
