import React from "react";
import { Link, useLocation } from "react-router-dom";

function Navbar({ user, onLogout }) {
  const location = useLocation();

  return (
    <nav style={styles.nav}>
      <div style={styles.brand}>
        <Link to="/" style={styles.logo}>
          <span style={styles.logoIcon}>🌿</span>
          <span style={styles.logoText}>LeafX</span>
        </Link>
      </div>

      <ul style={styles.menu}>
        <li>
          <Link
            to="/"
            style={{
              ...styles.menuItem,
              ...(location.pathname === "/" ? styles.activeItem : {})
            }}
          >
            <span style={styles.icon}>🏠</span>
            Home
          </Link>
        </li>
        <li>
          <Link
            to="/advising"
            style={{
              ...styles.menuItem,
              ...(location.pathname === "/advising" ? styles.activeItem : {})
            }}
          >
            <span style={styles.icon}>👨‍💼</span>
            Advising
          </Link>
        </li>
        <li>
          <Link
            to="/marketplace"
            style={{
              ...styles.menuItem,
              ...(location.pathname === "/marketplace" ? styles.activeItem : {})
            }}
          >
            <span style={styles.icon}>🛍️</span>
            Marketplace
          </Link>
        </li>
      </ul>

      <div style={styles.userSection}>
        {user ? (
          <>
            <span style={styles.welcome}>Welcome, {user.name}!</span>
            <button style={styles.logoutBtn} onClick={onLogout}>
              Logout
            </button>
          </>
        ) : (
          <Link to="/auth" style={styles.loginBtn}>
            Login
          </Link>
        )}
      </div>
    </nav>
  );
}

const styles = {
  nav: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0.5rem 2rem',
    backgroundColor: '#ffffff',
    boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    height: '64px',
    backdropFilter: 'blur(10px)',
    backgroundColor: 'rgba(255, 255, 255, 0.95)'
  },
  brand: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem'
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    cursor: 'pointer',
    fontSize: '1.35rem',
    fontWeight: '600',
    color: '#2ecc71',
    textDecoration: 'none',
    transition: 'all 0.3s ease',
    '&:hover': {
      transform: 'scale(1.05)'
    }
  },
  logoIcon: {
    fontSize: '1.6rem'
  },
  logoText: {
    background: 'linear-gradient(45deg, #2ecc71, #27ae60)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    fontWeight: '800',
    letterSpacing: '-0.5px'
  },
  menu: {
    display: 'flex',
    gap: '0.75rem',
    listStyle: 'none',
    margin: 0,
    padding: 0,
    alignItems: 'center'
  },
  menuItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.6rem',
    padding: '0.6rem 1.2rem',
    borderRadius: '10px',
    cursor: 'pointer',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    color: '#555',
    fontSize: '0.95rem',
    fontWeight: '500',
    textDecoration: 'none',
    '&:hover': {
      backgroundColor: '#f0f9f4',
      color: '#2ecc71',
      transform: 'translateY(-1px)'
    }
  },
  activeItem: {
    backgroundColor: '#e8f8f0',
    color: '#2ecc71',
    fontWeight: '600',
    boxShadow: '0 2px 4px rgba(46, 204, 113, 0.15)'
  },
  icon: {
    fontSize: '1.2rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  userSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '1.2rem',
    paddingLeft: '1.2rem',
    borderLeft: '1px solid #eee'
  },
  welcome: {
    color: '#555',
    fontSize: '0.95rem',
    fontWeight: '500'
  },
  logoutBtn: {
    padding: '0.5rem 1.2rem',
    backgroundColor: '#fff',
    color: '#e74c3c',
    border: '2px solid #e74c3c',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '0.9rem',
    fontWeight: '600',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    '&:hover': {
      backgroundColor: '#e74c3c',
      color: '#fff',
      transform: 'translateY(-1px)',
      boxShadow: '0 4px 6px rgba(231, 76, 60, 0.15)'
    },
    '&:active': {
      transform: 'translateY(0)',
      boxShadow: '0 2px 4px rgba(231, 76, 60, 0.1)'
    }
  },
  loginBtn: {
    padding: '0.5rem 1.2rem',
    backgroundColor: '#2ecc71',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '0.9rem',
    fontWeight: '600',
    textDecoration: 'none',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    '&:hover': {
      backgroundColor: '#27ae60',
      transform: 'translateY(-1px)',
      boxShadow: '0 4px 6px rgba(46, 204, 113, 0.15)'
    },
    '&:active': {
      transform: 'translateY(0)',
      boxShadow: '0 2px 4px rgba(46, 204, 113, 0.1)'
    }
  }
};

export default Navbar;
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
