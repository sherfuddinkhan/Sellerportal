import { useState } from "react";
import { Link } from "react-router-dom";

import Input from "../../../components/Input";
import Button from "../../../components/Button";
import Checkbox from "../../../components/Checkbox";
import Loader from "../../../components/Loader";

import { validateLoginForm } from "./LoginValidation";

const LoginForm = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  const [errors, setErrors] = useState({});

  const [loading, setLoading] = useState(false);

  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateLoginForm(formData);

    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors);
      return;
    }

    try {
      setLoading(true);

      await onLogin(formData);

    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="login-form">
      <Input
        label="Email Address"
        name="email"
        type="email"
        placeholder="Enter your email"
        value={formData.email}
        onChange={handleChange}
        error={errors.email}
        required
      />

      <Input
        label="Password"
        name="password"
        type={showPassword ? "text" : "password"}
        placeholder="Enter password"
        value={formData.password}
        onChange={handleChange}
        error={errors.password}
        required
      />

      <button
        type="button"
        className="show-password"
        onClick={() => setShowPassword((prev) => !prev)}
      >
        {showPassword ? "Hide" : "Show"}
      </button>

      <div className="login-options">
        <Checkbox
          name="rememberMe"
          label="Remember Me"
          checked={formData.rememberMe}
          onChange={handleChange}
        />

        <Link to="/forgot-password" className="login-link">
          Forgot Password?
        </Link>
      </div>

      <Button
        type="submit"
        text={loading ? "Logging in..." : "Login"}
        disabled={loading}
      />

      {loading && <Loader />}
    </form>
  );
};

export default LoginForm;