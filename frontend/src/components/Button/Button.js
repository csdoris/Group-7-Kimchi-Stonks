import React from 'react';

function Button({
  name,
  className,
  onClick,
  type,
  variant,
  disabled,
  value,
}) {
  return (
    <button
      className={`button ${styles[variant]} ${className}`}
      type={type === 'submit' ? 'submit' : 'button'}
      value={value}
      onClick={onClick}
      disabled={disabled}
    >
      {name}
    </button>
  );
}

export default Button;
