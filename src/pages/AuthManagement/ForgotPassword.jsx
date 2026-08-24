import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, ArrowLeft, Send, CheckCircle, AlertCircle } from "lucide-react";
import "./AuthManagement.css";

const API_URL = "https://localhost:7203/api";

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        setMessage("");
        setError("");

        if (!email.trim()) {
            setError("Please enter your email address.");
            return;
        }

        try {
            setLoading(true);

            const response = await fetch(
                `${API_URL}/AuthManagement/forgot-password`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Accept: "*/*"
                    },
                    body: JSON.stringify({
                        email: email.trim()
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data?.message || "Unable to process password reset request."
                );
            }

            setMessage(
                data?.message ||
                "If the email exists, password reset instructions have been generated."
            );

        } catch (err) {
            setError(err.message || "Something went wrong.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-card">

                <div className="auth-icon">
                    <Mail size={30} />
                </div>

                <h2>Forgot Password?</h2>

                <p className="auth-subtitle">
                    Enter your registered email address to reset your password.
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
                        <label>Email Address</label>

                        <div className="input-wrapper">
                            <Mail size={18} />

                            <input
                                type="email"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                autoComplete="email"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="auth-button"
                        disabled={loading}
                    >
                        <Send size={18} />

                        {loading
                            ? "Sending..."
                            : "Send Reset Request"}
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

export default ForgotPassword;