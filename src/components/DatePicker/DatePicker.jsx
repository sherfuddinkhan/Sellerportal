import "./DatePicker.css";

const DatePicker = ({
  name,
  value,
  onChange,
  className = "",
  disabled = false,
  min,
  max,
}) => {
  return (
    <input
      type="date"
      name={name}
      value={value}
      onChange={onChange}
      className={`datepicker ${className}`}
      disabled={disabled}
      min={min}
      max={max}
    />
  );
};

export default DatePicker;