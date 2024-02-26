const ModalBtn = ({ text, style, onClick, className, disabled }) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{ ...style, padding: 0, border: "none" }}
      className={`${disabled ? "bg-gray-300" : "bg-blue-500 hover:bg-blue-600"} ${className}`}
    >
      {text}
    </button>
  );
};

export default ModalBtn;
