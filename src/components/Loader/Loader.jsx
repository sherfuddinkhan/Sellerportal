import "./Loader.css";

const Loader = ({
  text = "Loading...",
  className = "",
}) => {
  return (
    <div className={`loader-container ${className}`}>
      <div className="loader"></div>
      <p>{text}</p>
    </div>
  );
};

export default Loader;