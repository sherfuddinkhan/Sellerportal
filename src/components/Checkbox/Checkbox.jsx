import "./Checkbox.css";

const Checkbox = ({
  name,
  label,
  checked = false,
  onChange,
  className = "",
  disabled = false,
}) => {
  return (
    <label className={`checkbox-container ${className}`}>
      <input
        type="checkbox"
        name={name}
        checked={checked}
        onChange={onChange}
        disabled={disabled}
      />
      <span>{label}</span>
    </label>
  );
};

export default Checkbox;