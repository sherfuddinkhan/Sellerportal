import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {Lock,Eye,EyeOff,KeyRound,CheckCircle,AlertCircle} from "lucide-react";
import "./AuthManagement.css";
const API_URL = "http://localhost:5000/api";

const ChangePassword = () => {
    const navigate = useNavigate();
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showCurrent, setShowCurrent] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");
        setError("");
        if (!currentPassword || !newPassword || !confirmPassword) {
            setError("Please fill in all password fields.");
            return;
        }
        if (newPassword.length < 6) {
            setError("New password must contain at least 6 characters.");
            return;
        }
        if (newPassword !== confirmPassword) {
            setError("New passwords do not match.");
            return;
        }
        try {
            setLoading(true);
            const token = localStorage.getItem("token");
            const response = await fetch(
                `${API_URL}/AuthManagement/change-password`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Accept: "*/*",
                        ...(token
                            ? {
                                Authorization: `Bearer ${token}`
                            }
                            : {})
                    },
                    body: JSON.stringify({
                        currentPassword,
                        newPassword
                    })
                }
            );

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data?.message || "Password change failed.");
            }
            setMessage(data?.message ||"Password changed successfully.");
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");

        } catch (err) {
            setError(err.message || "Unable to change password.");
        } finally {
            setLoading(false);
        }
    };

    const PasswordInput = ({
        value,
        setValue,
        show,
        setShow,
        placeholder
    }) => (
        <div className="input-wrapper">
            <Lock size={18} />

            <input
                type={show ? "text" : "password"}
                value={value}
                placeholder={placeholder}
                onChange={(e) => setValue(e.target.value)}
            />

            <button
                type="button"
                className="password-toggle"
                onClick={() => setShow(!show)}
            >
                {show
                    ? <EyeOff size={18} />
                    : <Eye size={18} />}
            </button>
        </div>
    );

    return (
        <div className="auth-page">
            <div className="auth-card">

                <div className="auth-icon">
                    <KeyRound size={30} />
                </div>

                <h2>Change Password</h2>

                <p className="auth-subtitle">
                    Update your account password.
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
                        <label>Current Password</label>

                        <PasswordInput
                            value={currentPassword}
                            setValue={setCurrentPassword}
                            show={showCurrent}
                            setShow={setShowCurrent}
                            placeholder="Enter current password"
                        />
                    </div>

                    <div className="form-group">
                        <label>New Password</label>

                        <PasswordInput
                            value={newPassword}
                            setValue={setNewPassword}
                            show={showNew}
                            setShow={setShowNew}
                            placeholder="Enter new password"
                        />
                    </div>

                    <div className="form-group">
                        <label>Confirm New Password</label>

                        <PasswordInput
                            value={confirmPassword}
                            setValue={setConfirmPassword}
                            show={showConfirm}
                            setShow={setShowConfirm}
                            placeholder="Confirm new password"
                        />
                    </div>

                    <button
                        type="submit"
                        className="auth-button"
                        disabled={loading}
                    >
                        <KeyRound size={18} />

                        {loading
                            ? "Updating..."
                            : "Change Password"}
                    </button>

                </form>

            </div>
        </div>
    );
};

export default ChangePassword;