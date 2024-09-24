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
    />
  );
};

export default Input;
