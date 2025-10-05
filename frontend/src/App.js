import React, { useState, useEffect } from "react";
import AuthPage from "./components/AuthPage";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import Chatbot from "./components/Chatbot";
import Marketplace from "./components/Marketplace";
import FreeTierVoiceChat from "./FreeTierVoiceChat";
import SupplyChainOptimizer from "./components/SupplyChainOptimizer";
import "./components/styles.css";

function App() {
  const [user, setUser] = useState(null);
  const [currentView, setCurrentView] = useState('home');
  const [loading, setLoading] = useState(true);

  // Check for existing authentication on app load
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
    setCurrentView('home');
  };

  const handleLogout = () => {
    localStorage.removeItem('leafx_user');
    setUser(null);
    setCurrentView('home');
  };

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontSize: '18px' 
      }}>
        Loading LeafX...
      </div>
    );
  }

  // Show authentication page if user is not logged in
  if (!user) {
    return <AuthPage onLogin={handleLogin} />;
  }

  // Main app interface after authentication
  return (
    <div className="app">
      <Navbar 
        user={user} 
        currentView={currentView} 
        onViewChange={setCurrentView}
        onLogout={handleLogout}
      />
      
      <main style={{ paddingTop: '80px', minHeight: '100vh' }}>
        {currentView === 'home' && <SupplyChainOptimizer />}
        
        {currentView === 'marketplace' && (
          <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
            <h1 style={{ textAlign: 'center', marginBottom: '2rem' }}>
              🛒 Sustainable Marketplace
            </h1>
            <Marketplace />
          </div>
        )}
        
        {currentView === 'chat' && (
          <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
            <h1 style={{ textAlign: 'center', marginBottom: '2rem' }}>
              💬 Chat with LeafX AI
            </h1>
            <Chatbot />
          </div>
        )}
        
        {currentView === 'voice' && (
          <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
            <h1 style={{ textAlign: 'center', marginBottom: '2rem' }}>
              🎤 Voice Chat with Environmental Advisor
            </h1>
            <FreeTierVoiceChat />
          </div>
        )}

        {currentView === 'profile' && (
          <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
            <h1>👤 Profile</h1>
            <div style={{ 
              backgroundColor: '#f8f9fa', 
              padding: '2rem', 
              borderRadius: '8px',
              marginTop: '2rem'
            }}>
              <h3>Welcome, {user.name}!</h3>
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>Account Type:</strong> {user.provider === 'google' ? 'Google Account' : 'LeafX Account'}</p>
              <p><strong>Member Since:</strong> {new Date().toLocaleDateString()}</p>
              
              <button 
                onClick={handleLogout}
                style={{
                  marginTop: '1rem',
                  padding: '12px 24px',
                  backgroundColor: '#dc3545',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '16px'
                }}
              >
                Logout
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
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
