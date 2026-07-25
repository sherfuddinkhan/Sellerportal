import "./Select.css";

const Select = ({
  name,
  value,
  options = [],
  onChange,
  className = "",
  disabled = false,
}) => {
  return (
    <select
      name={name}
      value={value}
      onChange={onChange}
      className={`select ${className}`}
      disabled={disabled}
    >
      <option value="">-- Select --</option>

      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
};

export default Select;