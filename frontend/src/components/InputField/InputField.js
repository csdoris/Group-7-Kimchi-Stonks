import React from 'react';

import './InputField.scss';

function InputField({
  name,
  value,
  className,
  onChange,
  type,
  disabled,
  placeholder,
  autoComplete,
}) {
  return (
    <input
      className={`input-field ${className}`}
      autoComplete={autoComplete}
      type={type}
      name={name}
      value={value}
      placeholder={placeholder}
      disabled={disabled}
      onChange={onChange}
    />
  );
}

export default InputField;
