function Feedback({ title, children, action, actionLabel }) {
  return (
    <div className="feedback-panel" role="status">
      <span className="feedback-icon" aria-hidden="true">
        {action ? '!' : '⌕'}
      </span>
      <h2>{title}</h2>
      <p>{children}</p>
      {action && (
        <button className="button button-dark" onClick={action} type="button">
          {actionLabel || 'Try again'}
        </button>
      )}
    </div>
  );
}

export default Feedback;
