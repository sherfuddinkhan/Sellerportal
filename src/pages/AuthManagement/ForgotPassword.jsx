import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Mail,
  ArrowLeft,
  Send,
  CheckCircle,
  AlertCircle,
  Copy,
  KeyRound,
  User,
  ShieldCheck,
  Check,
  Loader2
} from "lucide-react";

import "./AuthManagement.css";

const API_URL = "http://localhost:5000/api";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [responseData, setResponseData] = useState(null);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setResponseData(null);

    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/auth/forgot-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json"
        },
        body: JSON.stringify({ email: email.trim() })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.message ||
            data?.error ||
            `Request failed with status ${response.status}`
        );
      }

      setResponseData(data);
    } catch (err) {
      console.error("FORGOT PASSWORD ERROR:", err);
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const copyToken = async () => {
    if (!responseData?.token) return;

    try {
      await navigator.clipboard.writeText(responseData.token);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Copy failed:", err);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        {/* Header */}
        <div className="auth-header">
          <div className="auth-icon-badge">
            <Mail size={24} />
          </div>
          <h2>Forgot Password?</h2>
          <p className="auth-subtitle">
            Enter your registered email address to receive a password reset token.
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="auth-alert error">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <div className="input-wrapper">
              <Mail size={18} className="input-icon" />
              <input
                id="email"
                type="email"
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                disabled={loading}
              />
            </div>
          </div>

          <button type="submit" className="auth-button" disabled={loading}>
            {loading ? (
              <>
                <Loader2 size={18} className="spinner" />
                <span>Generating...</span>
              </>
            ) : (
              <>
                <Send size={18} />
                <span>Generate Reset Token</span>
              </>
            )}
          </button>
        </form>

        {/* Response Data */}
        {responseData && (
          <div className="reset-response">
            <div className="reset-success-header">
              <CheckCircle size={22} className="success-icon" />
              <div>
                <strong>
                  {responseData.success
                    ? "Password Reset Request Successful"
                    : "Password Reset Request"}
                </strong>
                <p>{responseData.message}</p>
              </div>
            </div>

            {/* Account Info */}
            <div className="response-section">
              <h4>
                <User size={16} />
                Account Details
              </h4>
              <div className="response-grid">
                <div className="response-item">
                  <span>Full Name</span>
                  <strong>{responseData.fullName || "-"}</strong>
                </div>
                <div className="response-item">
                  <span>Username</span>
                  <strong>{responseData.userName || "-"}</strong>
                </div>
                <div className="response-item">
                  <span>Email</span>
                  <strong>{responseData.email || "-"}</strong>
                </div>
                <div className="response-item">
                  <span>Role</span>
                  <strong>{responseData.role || "-"}</strong>
                </div>
                <div className="response-item">
                  <span>User ID</span>
                  <strong>{responseData.userId ?? "-"}</strong>
                </div>
                <div className="response-item">
                  <span>Seller ID</span>
                  <strong>{responseData.sellerId ?? "-"}</strong>
                </div>
              </div>
            </div>

            {/* Token Section */}
            <div className="response-section">
              <h4>
                <KeyRound size={16} />
                Reset Token
              </h4>
              <div className="token-box">
                <code>{responseData.token || "-"}</code>
                <button
                  type="button"
                  onClick={copyToken}
                  className={`copy-btn ${copied ? "copied" : ""}`}
                  title="Copy reset token"
                >
                  {copied ? <Check size={16} /> : <Copy size={16} />}
                </button>
              </div>
            </div>

            {/* Expiration Section */}
            <div className="response-section">
              <h4>
                <ShieldCheck size={16} />
                Token Information
              </h4>
              <div className="response-item horizontal">
                <span>Expiration:</span>
                <strong>{responseData.expiration || "-"}</strong>
              </div>
            </div>

            <Link
              to="/reset-password"
              state={{
                token: responseData.token,
                email: responseData.email,
                userId: responseData.userId,
                sellerId: responseData.sellerId
              }}
              className="reset-password-link"
            >
              Continue to Reset Password →
            </Link>
          </div>
        )}

        {/* Footer */}
        <div className="auth-footer">
          <Link to="/login" className="back-link">
            <ArrowLeft size={16} />
            <span>Back to Login</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;