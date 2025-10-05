import { useAuth0 } from "@auth0/auth0-react";
import { useEffect, useState } from "react";
import './App.css';
import Home from "./components/Home";
import Navbar from "./components/Navbar";
import './components/styles.css';

function App() {
  const [message, setMessage] = useState("");
  const { loginWithRedirect, logout, isAuthenticated, user, isLoading } = useAuth0();
  const [currentView, setCurrentView] = useState('home');

  useEffect(() => {
    if (isAuthenticated) {
      fetch("/api/message")
        .then((res) => {
          if (!res.ok) {
            throw new Error(`HTTP error! Status: ${res.status}`);
          }
          return res.json();
        })
        .then((data) => setMessage(data.text))
        .catch((error) => {
          console.error("Error fetching data:", error);
          setMessage("Failed to load message from backend 😢");
        });
    }
  }, [isAuthenticated]);

  if (isLoading) {
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

  if (!isAuthenticated) {
    return (
      <div className="login-viewport">
        <div className="login-card">
          <div className="bg-blobs">
            <div className="blob b1" />
            <div className="blob b2" />
            <div className="blob b3" />
          </div>
          <div className="login-left">
            <div className="brand-logo">LX</div>
            <div className="left-title">LeafX — Build Fast, Ship Faster</div>
            <div className="left-sub">A minimal, focused platform for prototype shipping and hackathon wins.</div>
            <div className="feature-list">
              <div className="feature-item"><div className="feature-dot" /> Instant prototypes</div>
              <div className="feature-item"><div className="feature-dot" /> Great defaults for demos</div>
              <div className="feature-item"><div className="feature-dot" /> Secure Auth powered by Auth0</div>
            </div>
          </div>
          <div className="login-right">
            <div>
              <div className="signin-title">Welcome to LeafX</div>
              <div className="signin-sub">Sign in to access your LeafX dashboard and demos.</div>
            </div>
            <div className="cta-wrap">
              <button className="cta-btn" onClick={() => loginWithRedirect()}>
                Continue with Auth0
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <Navbar 
        user={user} 
        currentView={currentView} 
        onViewChange={setCurrentView}
        onLogout={() => logout({ returnTo: window.location.origin })}
      />
      
      <main style={{ paddingTop: '80px', minHeight: '100vh' }}>
        {currentView === 'home' && <Home welcomeMessage={message} />}
        
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
              <p><strong>Account Type:</strong> {user.sub?.includes('auth0') ? 'Auth0' : 'Social'}</p>
              
              <button 
                onClick={() => logout({ returnTo: window.location.origin })}
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
