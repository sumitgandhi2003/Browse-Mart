// const Button = ({
//   btntext,
//   className,
//   disabled,
//   onClick,
//   loading,
//   loaderColor,
// }) => {
//   return (
//     <button className={className} disabled={disabled} onClick={onClick}>
//       {loading ? (
//         <div className="loader inline-block w-4 h-4 border-2 border-t-2 border-t-white border-blue-400 rounded-full animate-spin"></div>
//       ) : (
//         btntext
//       )}
//     </button>
//   );
// };

// Button.defaultProps = {
//   className:
//     "bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded",
//   disabled: false,
//   onClick: () => "",
//   loading: false,
//   loaderColor: "",
// };
// export default Button;

const Button = ({
  btntext,
  className = "bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded",
  disabled = false,
  onClick = () => "",
  loading = false,
  loaderColor = "",
}) => {
  return (
    <button className={className} disabled={disabled} onClick={onClick}>
      {loading ? (
        <div className="loader inline-block w-4 h-4 border-2 border-t-2 border-t-white border-blue-400 rounded-full animate-spin"></div>
      ) : (
        btntext
      )}
    </button>
  );
};

export default Button;
