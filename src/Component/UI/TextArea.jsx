import React from "react";

const TextArea = ({
  name,
  placeholder,
  onChange,
  value,
  id,
  className,
  rows,
  cols,
}) => {
  return (
    <textarea
      name={name}
      placeholder={placeholder}
      onChange={onChange}
      value={value}
      className={`${className} transition-all duration-300`}
      id={id}
      rows={rows}
      cols={cols}
    ></textarea>
  );
};
export default TextArea;
