import React, { useEffect, useState } from "react";

import {
    Alert,
    Avatar,
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    CircularProgress,
    Divider,
    Grid,
    Stack,
    Typography
} from "@mui/material";

import {
    AccountCircle,
    Badge,
    CalendarMonth,
    Email,
    Person,
    Phone,
    Refresh,
    VerifiedUser
} from "@mui/icons-material";

import authService from "./authService";

import "./AuthManagement.css";

const UserProfile = () => {

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

    const [user, setUser] = useState(null);

    //=========================================
    // Load Profile
    //=========================================

    const loadProfile = async () => {

        try {

            setLoading(true);

            setError("");

            const response = await authService.getCurrentUser();

            setUser(

                response?.data ||

                response

            );

        }
        catch (err) {

            setError(

                err?.response?.data?.message ||

                "Unable to load profile."

            );

        }
        finally {

            setLoading(false);

        }

    };

    useEffect(() => {

        loadProfile();

    }, []);

    if (loading) {

        return (

            <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                height="80vh"
            >

                <CircularProgress />

            </Box>

        );

    }

    return (

        <Box className="auth-container">

            <Card className="profile-card">

                <CardContent>

                    <Stack
                        spacing={2}
                        alignItems="center"
                        mb={4}
                    >

                        <Avatar
                            sx={{
                                width: 90,
                                height: 90,
                                bgcolor: "primary.main",
                                fontSize: 36
                            }}
                        >

                            {

                                user?.firstName

                                    ?

                                    user.firstName.charAt(0).toUpperCase()

                                    :

                                    <AccountCircle fontSize="large" />

                            }

                        </Avatar>

                        <Typography
                            variant="h4"
                            fontWeight="bold"
                        >

                            {

                                `${user?.firstName || ""} ${user?.lastName || ""}`

                            }

                        </Typography>

                        <Chip
                            color="primary"
                            icon={<VerifiedUser />}
                            label={

                                user?.role ||

                                "User"

                            }
                        />

                    </Stack>

                    {

                        error &&

                        <Alert
                            severity="error"
                            sx={{ mb: 3 }}
                        >

                            {error}

                        </Alert>

                    }

                    <Divider sx={{ mb: 3 }} />

                    <Grid container spacing={3}>

                        <Grid item xs={12} md={6}>

                            <Stack spacing={2}>

                                <Box display="flex" gap={2}>

                                    <Person color="primary" />

                                    <Box>

                                        <Typography
                                            variant="subtitle2"
                                        >

                                            Username

                                        </Typography>

                                        <Typography>

                                            {user?.username || "-"}

                                        </Typography>

                                    </Box>

                                </Box>

                                <Box display="flex" gap={2}>

                                    <Email color="primary" />

                                    <Box>

                                        <Typography
                                            variant="subtitle2"
                                        >

                                            Email

                                        </Typography>

                                        <Typography>

                                            {user?.email || "-"}

                                        </Typography>

                                    </Box>

                                </Box>

                                <Box display="flex" gap={2}>

                                    <Phone color="primary" />

                                    <Box>

                                        <Typography
                                            variant="subtitle2"
                                        >

                                            Phone Number

                                        </Typography>

                                        <Typography>

                                            {user?.phoneNumber || "-"}

                                        </Typography>

                                    </Box>

                                </Box>

                            </Stack>

                        </Grid>

                        <Grid item xs={12} md={6}>

                            <Stack spacing={2}>

                                <Box display="flex" gap={2}>

                                    <Badge color="primary" />

                                    <Box>

                                        <Typography
                                            variant="subtitle2"
                                        >

                                            User Id

                                        </Typography>

                                        <Typography>

                                            {user?.id ||

                                                user?.userId ||

                                                "-"}

                                        </Typography>

                                    </Box>

                                </Box>

                                <Box display="flex" gap={2}>

                                    <CalendarMonth color="primary" />

                                    <Box>

                                        <Typography
                                            variant="subtitle2"
                                        >

                                            Created Date

                                        </Typography>

                                        <Typography>

                                            {

                                                user?.createdDate

                                                    ?

                                                    new Date(
                                                        user.createdDate
                                                    ).toLocaleString()

                                                    :

                                                    "-"

                                            }

                                        </Typography>

                                    </Box>

                                </Box>

                                <Box display="flex" gap={2}>

                                    <VerifiedUser color="primary" />

                                    <Box>

                                        <Typography
                                            variant="subtitle2"
                                        >

                                            Status

                                        </Typography>

                                        <Chip
                                            color="success"
                                            label={

                                                user?.status ||

                                                "Active"

                                            }
                                        />

                                    </Box>

                                </Box>

                            </Stack>

                        </Grid>

                    </Grid>

                    <Divider sx={{ my: 4 }} />

                    <Box
                        display="flex"
                        justifyContent="center"
                    >

                        <Button
                            variant="contained"
                            startIcon={<Refresh />}
                            onClick={loadProfile}
                        >

                            Refresh Profile

                        </Button>

                    </Box>

                </CardContent>

            </Card>

        </Box>

    );

};

export default UserProfile;