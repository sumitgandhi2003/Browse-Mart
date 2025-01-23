import React from "react";

const Input = ({
  type,
  placeholder,
  onChange,
  value,
  name,
  id,
  className,
  checked,
  required,
  multiple,
  accept,
  pattern,
  disabled,
  onFocus,
  // Add any other props you need here for your specific use case. For example, a label tag for accessibility:
}) => {
  return (
    <input
      type={type}
      placeholder={placeholder}
      onChange={onChange}
      value={value}
      name={name}
      id={id}
      className={className}
      checked={checked}
      multiple={multiple}
      required={required}
      accept={accept}
      pattern={pattern}
      disabled={disabled}
      onFocus={onFocus}
    />
  );
};

export default Input;
