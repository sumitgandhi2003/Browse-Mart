const Button = ({ btntext, className, disabled, click }) => {
  return (
    <button className={className} disabled={disabled} onClick={click}>
      {btntext}
    </button>
  );
};

Button.defaultProps = {
  className:
    "bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded",
  disabled: false,
  click: () => "",
};
export default Button;
