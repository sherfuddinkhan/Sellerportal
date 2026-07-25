import "./Button.css";

const Button = ({
  type = "button",
  text,
  onClick,
  className = "",
  disabled = false,
}) => {
  return (
    <button
      type={type}
      className={`btn ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {text}
    </button>
  );
};

export default Button;