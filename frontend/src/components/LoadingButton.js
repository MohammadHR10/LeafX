
const LoadingButton = ({ isLoading, onClick, disabled, children, className }) => {
  return (
    <button
      className={`cta-btn ${className || ''}`}
      onClick={onClick}
      disabled={disabled || isLoading}
    >
      {isLoading ? (
        <div className="loading-spinner">
          <div className="spinner"></div>
          <span>Loading...</span>
        </div>
      ) : (
        children
      )}
    </button>
  );
};

export default LoadingButton;