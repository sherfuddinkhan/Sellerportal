import "./TextArea.css";

const TextArea = ({
  name,
  value,
  placeholder,
  rows = 4,
  onChange,
  className = "",
}) => {
  return (
    <textarea
      name={name}
      value={value}
      placeholder={placeholder}
      rows={rows}
      onChange={onChange}
      className={`textarea ${className}`}
    />
  );
};

export default TextArea;