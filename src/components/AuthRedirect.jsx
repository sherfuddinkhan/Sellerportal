import React from "react";
import { Navigate } from "react-router-dom";

const AuthRedirect = () => {
    const token =
        localStorage.getItem("token") ||
        localStorage.getItem("accessToken");

    if (token) {
        return (
            <Navigate
                to="/dashboard"
                replace
            />
        );
    }

    return (
        <Navigate
            to="/login"
            replace
        />
    );
};

export default AuthRedirect;