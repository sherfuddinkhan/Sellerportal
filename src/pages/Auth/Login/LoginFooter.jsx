import { Link } from "react-router-dom";

const LoginFooter = () => {
  return (
    <div className="register-section">
      <span>Don't have an account?</span>

      <Link to="/register" className="login-link">
        Register
      </Link>
    </div>
  );
};

export default LoginFooter;