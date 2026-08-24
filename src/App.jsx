import React from "react";

import {
    Routes,
    Route,
    Navigate
} from "react-router-dom";

// =========================================================
// AUTH MANAGEMENT
// =========================================================

import Login from "./pages/AuthManagement/Login";
import Register from "./pages/AuthManagement/Register";
import ForgotPassword from "./pages/AuthManagement/ForgotPassword";
import ResetPassword from "./pages/AuthManagement/ResetPassword";
import Unauthorized from "./pages/AuthManagement/Unauthorized";


function App() {
    return (
        <Routes>

            {/* =====================================================
                LOGIN
            ===================================================== */}

            <Route
                path="/"
                element={<Login />}
            />

            <Route
                path="/login"
                element={<Login />}
            />


            {/* =====================================================
                REGISTER
            ===================================================== */}

            <Route
                path="/register"
                element={<Register />}
            />


            {/* =====================================================
                FORGOT PASSWORD
            ===================================================== */}

            <Route
                path="/forgot-password"
                element={<ForgotPassword />}
            />


            {/* =====================================================
                RESET PASSWORD
            ===================================================== */}

            <Route
                path="/reset-password"
                element={<ResetPassword />}
            />


            {/* =====================================================
                UNAUTHORIZED
            ===================================================== */}

            <Route
                path="/unauthorized"
                element={<Unauthorized />}
            />


            {/* =====================================================
                INVALID ROUTE
            ===================================================== */}

            <Route
                path="*"
                element={
                    <Navigate
                        to="/"
                        replace
                    />
                }
            />

        </Routes>
    );
}

export default App;