import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./premium-auth.css";

export default function AuthPage({ user, onLogin, redirectPath }) {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [theme, setTheme] = useState('premium');
  const [focusedField, setFocusedField] = useState('');
  const [successAnimation, setSuccessAnimation] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const progressInterval = useRef(null);

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      const targetPath = redirectPath || location.state?.from || '/';
      navigate(targetPath, { replace: true });
    }
  }, [user, navigate, redirectPath, location.state]);

  // Premium sound effects (placeholder for now)
  const playSound = useCallback((type) => {
    console.log('🔊 Playing ' + type + ' sound effect');
  }, []);

  // Enhanced form validation
  const validateForm = () => {
    const newErrors = {};
    
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_\`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    if (!formData.email) {
      newErrors.email = "Email is required for premium access";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid corporate email";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (!isLogin && formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Premium progress simulation
  const simulateProgress = () => {
    setProgress(0);
    progressInterval.current = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval.current);
          return 100;
        }
        return prev + Math.random() * 15 + 5;
      });
    }, 200);
  };

  // Enhanced form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      playSound('error');
      return;
    }

    setLoading(true);
    simulateProgress();
    playSound('processing');

    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setSuccessAnimation(true);
      playSound('success');
      
      const mockUser = { 
        email: formData.email, 
        name: formData.email.split('@')[0],
        plan: 'premium'
      };
      
      setTimeout(() => {
        onLogin(mockUser);
      }, 1500);
      
    } catch (error) {
      setErrors({ submit: "Authentication failed. Please try again." });
      playSound('error');
      setLoading(false);
      setProgress(0);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const toggleTheme = () => {
    const themes = ['premium', 'dark', 'corporate'];
    const currentIndex = themes.indexOf(theme);
    const nextTheme = themes[(currentIndex + 1) % themes.length];
    setTheme(nextTheme);
    playSound('click');
  };

  const handleFocus = (fieldName) => {
    setFocusedField(fieldName);
    playSound('focus');
  };

  const handleBlur = () => {
    setFocusedField('');
  };

  return (
    <div className={`auth-container theme-${theme} ${successAnimation ? 'success-mode' : ''}`}>
      <div className="auth-background">
        <div className="particle-field">
          {[...Array(50)].map((_, i) => (
            <div key={i} className={`particle particle-${i % 5}`} style={{
              left: Math.random() * 100 + '%',
              top: Math.random() * 100 + '%',
              animationDelay: Math.random() * 20 + 's'
            }}></div>
          ))}
        </div>
        <div className="auth-shape-1"></div>
        <div className="auth-shape-2"></div>
        <div className="auth-shape-3"></div>
        <div className="gradient-orb orb-1"></div>
        <div className="gradient-orb orb-2"></div>
        <div className="gradient-orb orb-3"></div>
      </div>
      
      <button className="theme-switcher" onClick={toggleTheme} disabled={loading}>
        {theme === 'premium' ? '🌟' : theme === 'dark' ? '🌙' : '💼'}
      </button>
      
      <div className="auth-content">
        <div className={`auth-card ${loading ? 'loading-mode' : ''} ${focusedField ? 'focused-mode' : ''}`}>
          <div className="auth-header">
            <div className="auth-logo">
              <div className="logo-container">
                <span className="auth-logo-icon">🌿</span>
                <div className="logo-pulse"></div>
              </div>
              <div className="brand-text">
                <h1 className="auth-logo-text">LeafX</h1>
                <span className="brand-tagline">PREMIUM</span>
              </div>
            </div>
            <p className="auth-subtitle">Enterprise AI-Powered Sustainability Platform</p>
            <div className="trust-indicators">
              <span className="trust-badge">🔒 Enterprise Security</span>
              <span className="trust-badge">⚡ AI-Powered</span>
              <span className="trust-badge">🌍 Global Scale</span>
            </div>
          </div>
          
          {loading && (
            <div className="premium-progress">
              <div className="progress-bar">
                <div className="progress-fill" style={{width: progress + '%'}}></div>
                <div className="progress-shimmer"></div>
              </div>
              <span className="progress-text">{Math.round(progress)}% Complete</span>
            </div>
          )}

          {successAnimation && (
            <div className="success-overlay">
              <div className="success-checkmark">
                <div className="check-icon">✓</div>
                <h3>Welcome to LeafX Premium!</h3>
                <p>Redirecting to your dashboard...</p>
              </div>
              <div className="success-confetti"></div>
            </div>
          )}

          <div className="form-tabs">
            <button
              type="button"
              className={`tab-button ${isLogin ? 'active' : ''}`}
              onClick={() => {
                setIsLogin(true);
                setErrors({});
                playSound('tab');
              }}
              disabled={loading}
            >
              <span className="tab-icon">🔐</span>
              Sign In
            </button>
            <button
              type="button"
              className={`tab-button ${!isLogin ? 'active' : ''}`}
              onClick={() => {
                setIsLogin(false);
                setErrors({});
                playSound('tab');
              }}
              disabled={loading}
            >
              <span className="tab-icon">✨</span>
              Join Premium
            </button>
            <div className="tab-indicator"></div>
          </div>

          <form onSubmit={handleSubmit} className="auth-form" noValidate>
            <div className={`form-group ${errors.email ? 'error' : ''} ${focusedField === 'email' ? 'focused' : ''}`}>
              <label htmlFor="email" className="form-label">
                <span className="label-icon">📧</span>
                Corporate Email
                <span className="required-indicator">*</span>
              </label>
              <div className="input-container">
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  onFocus={() => handleFocus('email')}
                  onBlur={handleBlur}
                  placeholder="your.name@company.com"
                  disabled={loading}
                  className="form-input"
                  autoComplete="email"
                />
                <div className="input-border"></div>
                <div className="input-focus-bg"></div>
              </div>
              {errors.email && <span className="error-message">{errors.email}</span>}
            </div>

            <div className={`form-group ${errors.password ? 'error' : ''} ${focusedField === 'password' ? 'focused' : ''}`}>
              <label htmlFor="password" className="form-label">
                <span className="label-icon">🔒</span>
                Password
                <span className="required-indicator">*</span>
              </label>
              <div className="input-container">
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  onFocus={() => handleFocus('password')}
                  onBlur={handleBlur}
                  placeholder="Enter your secure password"
                  disabled={loading}
                  className="form-input"
                  autoComplete={isLogin ? "current-password" : "new-password"}
                />
                <div className="input-border"></div>
                <div className="input-focus-bg"></div>
              </div>
              {errors.password && <span className="error-message">{errors.password}</span>}
            </div>

            {!isLogin && (
              <div className={`form-group ${errors.confirmPassword ? 'error' : ''} ${focusedField === 'confirmPassword' ? 'focused' : ''}`}>
                <label htmlFor="confirmPassword" className="form-label">
                  <span className="label-icon">🔐</span>
                  Confirm Password
                  <span className="required-indicator">*</span>
                </label>
                <div className="input-container">
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    onFocus={() => handleFocus('confirmPassword')}
                    onBlur={handleBlur}
                    placeholder="Confirm your password"
                    disabled={loading}
                    className="form-input"
                    autoComplete="new-password"
                  />
                  <div className="input-border"></div>
                  <div className="input-focus-bg"></div>
                </div>
                {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className={`submit-button ${loading ? 'loading' : ''}`}
            >
              <span className="button-content">
                <span className="button-icon">
                  {loading ? '⟳' : isLogin ? '🚀' : '✨'}
                </span>
                <span className="button-text">
                  {loading ? 'Authenticating...' : isLogin ? 'Access Premium Dashboard' : 'Join LeafX Premium'}
                </span>
              </span>
              <div className="button-glow"></div>
              <div className="button-ripple"></div>
            </button>

            {errors.submit && (
              <div className="submit-error">
                <span className="error-icon">⚠️</span>
                {errors.submit}
              </div>
            )}
          </form>

          <div className="premium-features">
            <div className="features-header">
              <h3>Premium Benefits</h3>
              <span className="hackathon-badge">🏆 Award Winner</span>
            </div>
            <div className="features-grid">
              <div className="feature-item">
                <span className="feature-icon">🤖</span>
                <span className="feature-text">Advanced AI Analytics</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">📊</span>
                <span className="feature-text">Real-time Insights</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">🔐</span>
                <span className="feature-text">Enterprise Security</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">🌱</span>
                <span className="feature-text">Sustainability Tracking</span>
              </div>
            </div>
          </div>

          <div className="auth-footer">
            <div className="security-badge">
              <span className="security-icon">🛡️</span>
              <div className="security-text">
                <strong>Bank-level Security</strong>
                <small>256-bit SSL encryption</small>
              </div>
            </div>
            <div className="compliance-badges">
              <span className="compliance-badge">SOC 2</span>
              <span className="compliance-badge">GDPR</span>
              <span className="compliance-badge">ISO 27001</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
