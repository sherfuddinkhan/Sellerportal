import "./RadioButton.css";

const RadioButton = ({
  name,
  value,
  label,
  checked = false,
  onChange,
  className = "",
  disabled = false,
}) => {
  return (
    <label className={`radio-container ${className}`}>
      <input
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={onChange}
        disabled={disabled}
      />
      <span>{label}</span>
    </label>
  );
};

export default RadioButton;