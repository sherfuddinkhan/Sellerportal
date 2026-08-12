import React, { useEffect } from "react";

import {Box,Button,Card,CardContent,Checkbox,CircularProgress,FormControlLabel,IconButton,InputAdornment,Link,TextField,Typography,Alert,Stack} from "@mui/material";
import {Visibility,VisibilityOff,LockOutlined} from "@mui/icons-material";
import {Logout as LogoutIcon} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

import authService from "./authService";
import { useAuth } from "../../contexts/AuthContext";
import "./AuthManagement.css";
const Logout = () => {
    const navigate = useNavigate();
    const { logout } = useAuth();
    useEffect(() => {
        const performLogout = async () => {
            try {
                // Call Logout API (optional)
                await authService.logout();

            }
            catch (error) {
                console.error("Logout API Error:", error);
            }
            finally {
                // Clear authentication
                logout();
                // Remove local storage/session storage if required
                localStorage.removeItem("token");
                localStorage.removeItem("refreshToken");
                localStorage.removeItem("user");
                sessionStorage.clear();
                // Redirect to Login
                navigate("/login", {replace: true});
            }
        };
        performLogout();
    }, [logout, navigate]);

    return (
        <Box className="auth-container">
            <Card className="auth-card">
                <CardContent>
                    <Box
                        display="flex"
                        flexDirection="column"
                        alignItems="center"
                        justifyContent="center"
                        py={5}
                    >
                        <LogoutIcon
                            color="primary"
                            sx={{
                                fontSize: 70,
                                mb: 2
                            }}
                        />
                        <Typography
                            variant="h5"
                            fontWeight="bold"
                            gutterBottom
                        >
                            Logging Out...
                        </Typography>
                        <Typography
                            color="text.secondary"
                            mb={3}
                        >
                            Please wait while we securely sign you out.
                        </Typography>
                        <CircularProgress />
                    </Box>
                </CardContent>
            </Card>
        </Box>
    );
};

export default Logout;