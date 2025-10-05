import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import Marketplace from "./components/Marketplace";
import Advising from "./components/Advising";
import AuthPage from "./components/AuthPage";
import "./App.css";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('leafx_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error('Error parsing saved user:', error);
        localStorage.removeItem('leafx_user');
      }
    }
    setLoading(false);
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem('leafx_user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('leafx_user');
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <div style={{ textAlign: 'center', padding: '20px' }}>
          Loading LeafX...
        </div>
      </div>
    );
  }

  return (
    <Router>
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Navbar user={user} onLogout={handleLogout} />
        <div style={{ flex: 1, padding: '80px 20px 20px 20px' }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/advising" element={user ? <Advising /> : <AuthPage onLogin={handleLogin} />} />
            <Route path="/marketplace" element={<Marketplace />} />
            <Route path="/auth" element={<AuthPage onLogin={handleLogin} />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;




//////////////////////////1st Pull part////////////
// import { useEffect, useState } from "react";
// import Navbar from "./components/Navbar";
// import Home from "./components/Home";

// function App() {
//   const [message, setMessage] = useState("");

//   // // 🔹 Test connection to backend
//   // useEffect(() => {
//   //   fetch("/api/message")
//   //     .then((res) => {
//   //       if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
//   //       return res.json();
//   //     })
//   //     .then((data) => setMessage(data.text))
//   //     .catch((error) => {
//   //       console.error("Error fetching data:", error);
//   //       setMessage("Failed to load message from backend 😢");
//   //     });
//   // }, []);

//   return (
//     <div>
//       {/* 🌿 Navbar at top */}
//       <Navbar />

//       {/* 🏠 Home page (mission + chatbot) */}
//       <Home />

//       {/* ⚙️ Backend connectivity status at bottom
//       <div style={{ textAlign: "center", margin: "3rem 0", color: "gray" }}>
//         <p>🔌 Backend Status: {message || "Loading..."}</p>
//       </div> */}
      
//       <Route path="/marketplace" element={<Marketplace />} />

//     </div>
//   );
// }

// export default App;




////////////////////////older 
// import { useEffect, useState } from "react";

// function App() {
//   const [message, setMessage] = useState("");

//   useEffect(() => {
//     // ✅ Always start with a leading slash for proxy to work
//     fetch("/api/message")
//       .then((res) => {
//         if (!res.ok) {
//           throw new Error(`HTTP error! Status: ${res.status}`);
//         }
//         return res.json();
//       })
//       .then((data) => setMessage(data.text))
//       .catch((error) => {
//         console.error("Error fetching data:", error);
//         setMessage("Failed to load message from backend 😢");
//       });
//   }, []);

//   return (
//     <div style={{ textAlign: "center", marginTop: "100px" }}>
//       <h1>{message || "Loading..."}</h1>
//     </div>
//   );
// }

// export default App;

// import { useEffect, useState } from "react";

// function App() {
//   const [message, setMessage] = useState("");

//   useEffect(() => {
//     fetch("api/message")
//       .then((res) => res.json())
//       .then((data) => setMessage(data.text));
//   }, []);

//   return (
//     <div>
//       <h1>{message}</h1>
//     </div>
//   );
// }

// export default App;


// // import logo from './logo.svg';
// // import './App.css';

// // // function App() {
// //   return (
// //     <div className="App">
// //       <header className="App-header">
// //         <img src={logo} className="App-logo" alt="logo" />
// //         <p>
// //           Edit <code>src/App.js</code> and save to reload.
// //         </p>
// //         <a
// //           className="App-link"
// //           href="https://reactjs.org"
// //           target="_blank"
// //           rel="noopener noreferrer"
// //         >
// //           Learn React
// //         </a>
// //       </header>
// //     </div>
// //   );
// // }

// // export default App;
