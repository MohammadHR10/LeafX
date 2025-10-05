import { useState } from 'react';
import './styles.css';

function AuthPage({ onLogin }) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleDemoLogin = async () => {
    setIsLoading(true);
    setError('');
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Demo user data
    const demoUser = {
      name: 'Demo User',
      email: 'demo@example.com',
      provider: 'demo'
    };
    
    // Store user data in localStorage
    localStorage.setItem('leafx_user', JSON.stringify(demoUser));
    
    setIsLoading(false);
    onLogin(demoUser);
  };

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
          <div className="left-sub">A minimal, focused platform for prototype shipping and hackathon wins. Log in to continue to your workspace.</div>
          <div className="feature-list">
            <div className="feature-item"><div className="feature-dot" /> Instant prototypes</div>
            <div className="feature-item"><div className="feature-dot" /> Great defaults for demos</div>
            <div className="feature-item"><div className="feature-dot" /> Quick and easy setup</div>
          </div>
        </div>
        <div className="login-right">
          <div>
            <div className="signin-title">Welcome to LeafX</div>
            <div className="signin-sub">Sign in to access your LeafX dashboard and demos.</div>
          </div>

          <div className="cta-wrap">
            <button
              className="cta-btn"
              onClick={handleDemoLogin}
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="loading-spinner">
                  <div className="spinner"></div>
                  <span>Loading...</span>
                </div>
              ) : (
                <>
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                    <path d="M12 2L12 22" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" opacity="0.9" />
                    <path d="M5 11L12 4L19 11" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" opacity="0.95" />
                  </svg>
                  Continue with Demo Account
                </>
              )}
            </button>
          </div>

          {error && (
            <div className="error-message">
              <span className="error-icon">⚠️</span>
              {error}
            </div>
          )}

          <div className="small-note">
            By continuing you agree to the LeafX demo terms. This is a developer preview.
          </div>
        </div>
      </div>
    </div>
  );
}

export default AuthPage;