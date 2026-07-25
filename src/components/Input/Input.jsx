import "./Input.css";

const Input = ({
  label,
  name,
  type = "text",
  placeholder = "",
  value,
  onChange,
  error,
  required = false,
  disabled = false,
}) => {
  return (
    <div className="input-group">

      {label && (
        <label className="input-label">
          {label}
          {required && <span className="required">*</span>}
        </label>
      )}

      <input
        className={`input-field ${error ? "input-error" : ""}`}
        type={type}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
      />

      {error && (
        <span className="error-message">
          {error}
        </span>
      )}

    </div>
  );
};

export default Input;