// =========================================================
// Notification.jsx
// =========================================================

import React, {
    useCallback,
    useEffect,
    useState,
} from "react";

import {
    Box,
    Button,
    Typography,
} from "@mui/material";

import {
    Refresh,
} from "@mui/icons-material";

import NotificationList from "./NotificationList";

import {
    getNotifications,
    markNotificationAsRead,
    deleteNotification,
} from "./notificationApi";

// =========================================================
// COMPONENT
// =========================================================

const Notification = () => {

    // =========================================================
    // STATE
    // =========================================================

    const [notifications, setNotifications] =
        useState([]);

    const [loading, setLoading] =
        useState(false);

    const [error, setError] =
        useState("");

    // =========================================================
    // LOAD NOTIFICATIONS
    // =========================================================

    const loadNotifications = useCallback(
        async () => {

            try {

                setLoading(true);
                setError("");

                const data =
                    await getNotifications();

                console.log(
                    "NOTIFICATIONS RESPONSE:",
                    data
                );

                // Handle normal array response
                if (Array.isArray(data)) {
                    setNotifications(data);
                }

                // Handle { data: [] }
                else if (
                    Array.isArray(data?.data)
                ) {
                    setNotifications(
                        data.data
                    );
                }

                // Handle { items: [] }
                else if (
                    Array.isArray(data?.items)
                ) {
                    setNotifications(
                        data.items
                    );
                }

                else {
                    setNotifications([]);
                }

            } catch (err) {

                console.error(
                    "LOAD NOTIFICATIONS ERROR:",
                    err
                );

                setError(
                    err.response?.data?.message ||
                    "Unable to load notifications."
                );

            } finally {

                setLoading(false);
            }

        },
        []
    );

    // =========================================================
    // INITIAL LOAD
    // =========================================================

    useEffect(() => {

        loadNotifications();

    }, [loadNotifications]);

    // =========================================================
    // MARK READ
    // =========================================================

    const handleMarkRead = async (
        notification
    ) => {

        const id =
            notification?.notificationId ??
            notification?.NotificationId ??
            notification?.id ??
            notification?.Id;

        if (!id) {
            console.error(
                "Notification ID not found:",
                notification
            );
            return;
        }

        try {

            await markNotificationAsRead(id);

            // Update local state immediately
            setNotifications((previous) =>
                previous.map((item) => {

                    const itemId =
                        item?.notificationId ??
                        item?.NotificationId ??
                        item?.id ??
                        item?.Id;

                    if (itemId !== id) {
                        return item;
                    }

                    return {
                        ...item,
                        isRead: true,
                        IsRead: true,
                    };
                })
            );

        } catch (err) {

            console.error(
                "MARK NOTIFICATION READ ERROR:",
                err
            );

            setError(
                err.response?.data?.message ||
                "Unable to mark notification as read."
            );
        }
    };

    // =========================================================
    // DELETE
    // =========================================================

    const handleDelete = async (
        notification
    ) => {

        const id =
            notification?.notificationId ??
            notification?.NotificationId ??
            notification?.id ??
            notification?.Id;

        if (!id) {
            console.error(
                "Notification ID not found:",
                notification
            );
            return;
        }

        try {

            await deleteNotification(id);

            // Remove immediately from UI
            setNotifications((previous) =>
                previous.filter((item) => {

                    const itemId =
                        item?.notificationId ??
                        item?.NotificationId ??
                        item?.id ??
                        item?.Id;

                    return itemId !== id;
                })
            );

        } catch (err) {

            console.error(
                "DELETE NOTIFICATION ERROR:",
                err
            );

            setError(
                err.response?.data?.message ||
                "Unable to delete notification."
            );
        }
    };

    // =========================================================
    // NOTIFICATION CLICK
    // =========================================================

    const handleNotificationClick = (
        notification
    ) => {

        console.log(
            "NOTIFICATION CLICKED:",
            notification
        );

        // Automatically mark unread notification as read
        const isRead =
            notification?.isRead ??
            notification?.IsRead;

        if (!isRead) {
            handleMarkRead(notification);
        }
    };

    // =========================================================
    // RENDER
    // =========================================================

    return (
        <Box
            sx={{
                width: "100%",
                p: 3,
            }}
        >

            {/* =================================================
                PAGE HEADER
               ================================================= */}

            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    mb: 3,
                }}
            >

                <Box>
                    <Typography
                        variant="h5"
                        fontWeight={700}
                    >
                        Notifications
                    </Typography>

                    <Typography
                        variant="body2"
                        color="text.secondary"
                    >
                        Manage your notifications
                    </Typography>
                </Box>

                <Button
                    variant="outlined"
                    startIcon={<Refresh />}
                    onClick={loadNotifications}
                    disabled={loading}
                >
                    Refresh
                </Button>

            </Box>

            {/* =================================================
                LIST
               ================================================= */}

            <NotificationList
                notifications={notifications}
                loading={loading}
                error={error}
                onNotificationClick={
                    handleNotificationClick
                }
                onMarkRead={
                    handleMarkRead
                }
                onDelete={
                    handleDelete
                }
            />

        </Box>
    );
};

export default Notification;
