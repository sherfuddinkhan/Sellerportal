import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  KeyRound,
  Lock,
  Eye,
  EyeOff,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  Mail,
  Loader2
} from "lucide-react";

import "./AuthManagement.css";

const API_URL = "http://localhost:5000/api";

const ResetPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Data passed via state from ForgotPassword step
  const forgotPasswordData = location.state || {};

  const [token, setToken] = useState(forgotPasswordData.token || "");
  const [email] = useState(forgotPasswordData.email || "");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [responseData, setResponseData] = useState(null);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setResponseData(null);

    // Validation
    if (!token.trim()) {
      setError("Reset token is required.");
      return;
    }

    if (!newPassword) {
      setError("Please enter a new password.");
      return;
    }

    if (newPassword.length < 6) {
      setError("Password must contain at least 6 characters.");
      return;
    }

    if (!confirmPassword) {
      setError("Please confirm your password.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(`${API_URL}/auth/reset-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json"
        },
        body: JSON.stringify({
          token: token.trim(),
          newPassword
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.message ||
            data?.error ||
            `Password reset failed with status ${response.status}`
        );
      }

      setResponseData(data);
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      console.error("RESET PASSWORD ERROR:", err);
      setError(err.message || "Unable to reset password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        {/* Header */}
        <div className="auth-header">
          <div className="auth-icon-badge">
            <KeyRound size={24} />
          </div>
          <h2>Reset Password</h2>
          <p className="auth-subtitle">
            Provide your reset token and choose a new password.
          </p>
        </div>

        {/* Email Context Banner */}
        {email && (
          <div className="reset-email-display">
            <Mail size={16} />
            <span>
              Resetting for: <strong>{email}</strong>
            </span>
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <div className="auth-alert error">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        {/* Success Alert */}
        {responseData && (
          <div className="auth-alert success">
            <CheckCircle size={20} className="success-icon" />
            <div>
              <strong>Password Reset Successful</strong>
              <p>
                {responseData.message ||
                  "Your password has been successfully updated."}
              </p>
            </div>
          </div>
        )}

        {/* Form Controls */}
        {!responseData ? (
          <form onSubmit={handleSubmit} className="auth-form">
            {/* Token Input */}
            <div className="form-group">
              <label htmlFor="token">Reset Token</label>
              <div className="input-wrapper">
                <KeyRound size={18} className="input-icon" />
                <input
                  id="token"
                  type="text"
                  placeholder="Paste reset token"
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  disabled={loading}
                />
              </div>
            </div>

            {/* New Password Input */}
            <div className="form-group">
              <label htmlFor="newPassword">New Password</label>
              <div className="input-wrapper">
                <Lock size={18} className="input-icon" />
                <input
                  id="newPassword"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter new password (min. 6 characters)"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  autoComplete="new-password"
                  disabled={loading}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Confirm Password Input */}
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <div className="input-wrapper">
                <Lock size={18} className="input-icon" />
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Re-enter new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  autoComplete="new-password"
                  disabled={loading}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() =>
                    setShowConfirmPassword(!showConfirmPassword)
                  }
                  tabIndex={-1}
                >
                  {showConfirmPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
            </div>

            {/* Action Button */}
            <button type="submit" className="auth-button" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 size={18} className="spinner" />
                  <span>Resetting...</span>
                </>
              ) : (
                <>
                  <KeyRound size={18} />
                  <span>Reset Password</span>
                </>
              )}
            </button>
          </form>
        ) : (
          /* Post-Success Actions */
          <div className="reset-success-actions">
            <button
              type="button"
              className="auth-button"
              onClick={() => navigate("/login")}
            >
              <ArrowLeft size={18} />
              <span>Proceed to Login</span>
            </button>
          </div>
        )}

        {/* Footer Link */}
        {!responseData && (
          <div className="auth-footer">
            <Link to="/login" className="back-link">
              <ArrowLeft size={16} />
              <span>Back to Login</span>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;