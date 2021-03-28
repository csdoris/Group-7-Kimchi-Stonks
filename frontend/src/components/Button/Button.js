import React from 'react';

import './Button.scss';

function Button({
  text,
  className,
  onClick,
  type,
  variant,
  disabled,
  value,
}) {
  return (
    <button
      className={`button ${variant} ${className}`}
      type={type === 'submit' ? 'submit' : 'button'}
      value={value}
      onClick={onClick}
      disabled={disabled}
    >
      {text}
    </button>
  );
}

export default Button;
