import React from "react";
import {
    Navigate,
    useLocation,
} from "react-router-dom";

const ProtectedRoute = ({ children }) => {

    const location = useLocation();

    const token =
        localStorage.getItem("token") ||
        localStorage.getItem("accessToken");

    if (!token || token.trim() === "") {

        return (
            <Navigate
                to="/login"
                replace
                state={{
                    from: location,
                }}
            />
        );

    }

    return children;
};

export default ProtectedRoute;