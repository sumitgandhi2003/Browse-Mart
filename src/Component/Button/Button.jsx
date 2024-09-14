const Button = ({ btntext, className, disabled, onClick }) => {
  return (
    <button className={className} disabled={disabled} onClick={onClick}>
      {btntext}
    </button>
  );
};

Button.defaultProps = {
  className:
    "bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded",
  disabled: false,
  onClick: () => "",
};
export default Button;
