import React from "react";
import { Link } from "react-router-dom";
// import "./Navbar.css"; // optional if you have styles

function Navbar() {
  return (
    <nav
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "#e8f5e9",
        padding: "1rem 2rem",
      }}
    >
      <h2 style={{ color: "green", fontWeight: "bold" }}>🌿 LeafX</h2>

      <div style={{ display: "flex", gap: "1.5rem" }}>
        <Link
          to="/"
          style={{
            textDecoration: "none",
            color: "black",
            fontWeight: "500",
          }}
        >
          Home
        </Link>
        <Link
          to="/marketplace"
          style={{
            textDecoration: "none",
            color: "black",
            fontWeight: "500",
          }}
        >
          Marketplace
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;

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
