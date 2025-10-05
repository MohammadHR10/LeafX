
function Navbar({ user, currentView, onViewChange, onLogout }) {
  return (
    <nav style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      backgroundColor: '#ffffff',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      padding: '1rem',
      zIndex: 1000
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 1rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
          <div style={{ 
            fontWeight: 'bold', 
            fontSize: '1.5rem',
            background: 'linear-gradient(135deg,#7dd3fc,#60a5fa)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            LeafX
          </div>
          
          <button 
            onClick={() => onViewChange('home')}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: currentView === 'home' ? '#3b82f6' : '#64748b',
              fontWeight: currentView === 'home' ? '600' : '400'
            }}
          >
            Home
          </button>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button
            onClick={() => onViewChange('profile')}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: currentView === 'profile' ? '#3b82f6' : '#64748b',
              fontWeight: currentView === 'profile' ? '600' : '400',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <span>👤</span>
            {user.name}
          </button>

          <button
            onClick={onLogout}
            style={{
              background: '#ef4444',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              padding: '0.5rem 1rem',
              cursor: 'pointer',
              fontSize: '0.875rem'
            }}
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;