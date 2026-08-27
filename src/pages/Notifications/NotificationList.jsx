// =========================================================
// NotificationList.jsx
// =========================================================

import React from "react";

import {
    Alert,
    Box,
    CircularProgress,
    Divider,
    Typography,
} from "@mui/material";

import {
    NotificationsNone,
} from "@mui/icons-material";

import NotificationCard from "./NotificationCard";

// =========================================================
// COMPONENT
// =========================================================

const NotificationList = ({
    notifications = [],
    loading = false,
    error = "",
    onNotificationClick,
    onMarkRead,
    onDelete,
}) => {
    // =========================================================
    // SAFE ARRAY
    // =========================================================

    const notificationItems =
        Array.isArray(notifications)
            ? notifications
            : [];

    // =========================================================
    // LOADING
    // =========================================================

    if (loading) {
        return (
            <Box
                sx={{
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    py: 8,
                    gap: 2,
                }}
            >
                <CircularProgress />

                <Typography
                    variant="body2"
                    color="text.secondary"
                >
                    Loading notifications...
                </Typography>
            </Box>
        );
    }

    // =========================================================
    // ERROR
    // =========================================================

    if (error) {
        return (
            <Alert
                severity="error"
                sx={{
                    width: "100%",
                }}
            >
                {error}
            </Alert>
        );
    }

    // =========================================================
    // EMPTY
    // =========================================================

    if (notificationItems.length === 0) {
        return (
            <Box
                sx={{
                    width: "100%",
                    py: 8,
                    px: 3,
                    textAlign: "center",
                    border: "1px dashed",
                    borderColor: "divider",
                    borderRadius: 2,
                }}
            >
                <NotificationsNone
                    sx={{
                        fontSize: 56,
                        color: "text.disabled",
                        mb: 1,
                    }}
                />

                <Typography
                    variant="h6"
                    fontWeight="bold"
                >
                    No Notifications
                </Typography>

                <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                        mt: 0.5,
                    }}
                >
                    You don't have any
                    notifications at the moment.
                </Typography>
            </Box>
        );
    }

    // =========================================================
    // RENDER
    // =========================================================

    return (
        <Box
            sx={{
                width: "100%",
            }}
        >
            {/* =================================================
                HEADER
               ================================================= */}

            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent:
                        "space-between",
                    mb: 2,
                }}
            >
                <Box>
                    <Typography
                        variant="h6"
                        fontWeight="bold"
                    >
                        Notifications
                    </Typography>

                    <Typography
                        variant="body2"
                        color="text.secondary"
                    >
                        {notificationItems.length}{" "}
                        notification
                        {notificationItems.length !==
                        1
                            ? "s"
                            : ""}
                    </Typography>
                </Box>
            </Box>

            {/* =================================================
                NOTIFICATION ITEMS
               ================================================= */}

            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 1.5,
                }}
            >
                {notificationItems.map(
                    (
                        notification,
                        index
                    ) => {
                        const notificationId =
                            notification?.notificationId ??
                            notification?.id ??
                            index;

                        return (
                            <React.Fragment
                                key={
                                    notificationId
                                }
                            >
                                <NotificationCard
                                    notification={
                                        notification
                                    }
                                    loading={
                                        loading
                                    }
                                    onClick={
                                        onNotificationClick
                                    }
                                    onMarkRead={
                                        onMarkRead
                                    }
                                    onDelete={
                                        onDelete
                                    }
                                />

                                {index <
                                    notificationItems.length -
                                        1 && (
                                    <Divider
                                        sx={{
                                            display:
                                                "none",
                                        }}
                                    />
                                )}
                            </React.Fragment>
                        );
                    }
                )}
            </Box>
        </Box>
    );
};

export default NotificationList;