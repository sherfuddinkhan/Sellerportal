import React from "react";
import { Navigate, useLocation } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
    const location = useLocation();
    const token = localStorage.getItem("token") || localStorage.getItem("accessToken");

    const isValid = token && token !== "null" && token !== "undefined" && token.trim() !== "";

    if (!isValid) {
        return <Navigate to="/login" replace state={{ from: location }} />;
    }

    return children;
};

export default ProtectedRoute;