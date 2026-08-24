import React, { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import {
    KeyRound,
    Lock,
    Eye,
    EyeOff,
    ArrowLeft,
    CheckCircle,
    AlertCircle
} from "lucide-react";
import "./AuthManagement.css";

const API_URL = "https://localhost:7203/api";

const ResetPassword = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const [token, setToken] = useState(
        searchParams.get("token") || ""
    );

    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        setMessage("");
        setError("");

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

        if (newPassword !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        try {
            setLoading(true);

            const response = await fetch(
                `${API_URL}/AuthManagement/reset-password`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Accept: "*/*"
                    },
                    body: JSON.stringify({
                        token: token.trim(),
                        newPassword: newPassword
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data?.message || "Password reset failed."
                );
            }

            setMessage(
                data?.message ||
                "Password reset successfully."
            );

            setNewPassword("");
            setConfirmPassword("");

            setTimeout(() => {
                navigate("/login");
            }, 2000);

        } catch (err) {
            setError(err.message || "Unable to reset password.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-card">

                <div className="auth-icon">
                    <KeyRound size={30} />
                </div>

                <h2>Reset Password</h2>

                <p className="auth-subtitle">
                    Enter your reset token and create a new password.
                </p>

                {message && (
                    <div className="auth-success">
                        <CheckCircle size={18} />
                        <span>{message}</span>
                    </div>
                )}

                {error && (
                    <div className="auth-error">
                        <AlertCircle size={18} />
                        <span>{error}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit}>

                    <div className="form-group">
                        <label>Reset Token</label>

                        <div className="input-wrapper">
                            <KeyRound size={18} />

                            <input
                                type="text"
                                placeholder="Enter reset token"
                                value={token}
                                onChange={(e) =>
                                    setToken(e.target.value)
                                }
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>New Password</label>

                        <div className="input-wrapper">
                            <Lock size={18} />

                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="Enter new password"
                                value={newPassword}
                                onChange={(e) =>
                                    setNewPassword(e.target.value)
                                }
                                autoComplete="new-password"
                            />

                            <button
                                type="button"
                                className="password-toggle"
                                onClick={() =>
                                    setShowPassword(!showPassword)
                                }
                            >
                                {showPassword
                                    ? <EyeOff size={18} />
                                    : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Confirm Password</label>

                        <div className="input-wrapper">
                            <Lock size={18} />

                            <input
                                type={
                                    showConfirmPassword
                                        ? "text"
                                        : "password"
                                }
                                placeholder="Confirm new password"
                                value={confirmPassword}
                                onChange={(e) =>
                                    setConfirmPassword(e.target.value)
                                }
                                autoComplete="new-password"
                            />

                            <button
                                type="button"
                                className="password-toggle"
                                onClick={() =>
                                    setShowConfirmPassword(
                                        !showConfirmPassword
                                    )
                                }
                            >
                                {showConfirmPassword
                                    ? <EyeOff size={18} />
                                    : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="auth-button"
                        disabled={loading}
                    >
                        <KeyRound size={18} />

                        {loading
                            ? "Resetting..."
                            : "Reset Password"}
                    </button>

                </form>

                <div className="auth-footer">
                    <Link to="/login">
                        <ArrowLeft size={16} />
                        Back to Login
                    </Link>
                </div>

            </div>
        </div>
    );
};

export default ResetPassword;