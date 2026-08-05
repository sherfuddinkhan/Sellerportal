import React from "react";

import {
    Navigate,
    Outlet,
    useLocation
} from "react-router-dom";

import {
    Box,
    CircularProgress
} from "@mui/material";

import { useAuth } from "../../contexts/AuthContext";

const ProtectedRoute = ({

    children,

    roles = []

}) => {

    const location = useLocation();

    const {

        user,

        isAuthenticated,

        loading

    } = useAuth();

    //=========================================
    // Loading
    //=========================================

    if (loading) {

        return (

            <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                height="100vh"
            >

                <CircularProgress />

            </Box>

        );

    }

    //=========================================
    // Not Logged In
    //=========================================

    if (!isAuthenticated) {

        return (

            <Navigate

                to="/login"

                replace

                state={{

                    from: location

                }}

            />

        );

    }

    //=========================================
    // Role Authorization
    //=========================================

    if (

        roles.length > 0 &&

        !roles.includes(user?.role)

    ) {

        return (

            <Navigate

                to="/unauthorized"

                replace

            />

        );

    }

    //=========================================
    // Render
    //=========================================

    if (children) {

        return children;

    }

    return <Outlet />;

};

export default ProtectedRoute;