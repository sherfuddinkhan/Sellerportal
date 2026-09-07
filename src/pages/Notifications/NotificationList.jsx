import React, {
    useCallback,
    useEffect,
    useState,
} from "react";

import {
    Alert,
    Box,
    Button,
    Card,
    CardContent,
    CircularProgress,
    Divider,
    IconButton,
    Typography,
} from "@mui/material";

import {
    Delete,
    Done,
    NotificationsNone,
    Refresh,
} from "@mui/icons-material";

import axios from "axios";

import {
    useNavigate,
} from "react-router-dom";


// =========================================================
// SERVER URL
// =========================================================

const SERVER_URL = "http://localhost:5000";


// =========================================================
// NOTIFICATION API
// =========================================================
//
// This matches the Node route:
//
// GET /api/Notification
//
// Node forwards to:
//
// GET https://localhost:7203/api/Notification
// =========================================================

const NOTIFICATION_URL =
    `${SERVER_URL}/api/Notification`;


// =========================================================
// COMPONENT
// =========================================================

const NotificationList = () => {

    // =====================================================
    // NAVIGATION
    // =====================================================

    const navigate = useNavigate();


    // =====================================================
    // STATE
    // =====================================================

    const [
        notifications,
        setNotifications
    ] = useState([]);


    const [
        loading,
        setLoading
    ] = useState(true);


    const [
        error,
        setError
    ] = useState("");


    // =====================================================
    // LOAD NOTIFICATIONS
    // =====================================================

    const loadNotifications =
        useCallback(async () => {

            try {

                setLoading(true);

                setError("");


                console.log(
                    "================================================="
                );

                console.log(
                    "LOADING NOTIFICATIONS"
                );

                console.log(
                    "GET:",
                    NOTIFICATION_URL
                );

                console.log(
                    "================================================="
                );


                // =================================================
                // DIRECT CALL TO NODE PROXY
                // =================================================

                const response =
                    await axios.get(
                        NOTIFICATION_URL
                    );


                console.log(
                    "NOTIFICATION RESPONSE:",
                    response
                );


                console.log(
                    "NOTIFICATION DATA:",
                    response.data
                );


                // =================================================
                // BACKEND RETURNS ARRAY
                // =================================================

                if (
                    Array.isArray(
                        response.data
                    )
                ) {

                    setNotifications(
                        response.data
                    );

                    return;
                }


                // =================================================
                // SUPPORT { data: [] }
                // =================================================

                if (
                    Array.isArray(
                        response.data?.data
                    )
                ) {

                    setNotifications(
                        response.data.data
                    );

                    return;
                }


                // =================================================
                // SUPPORT { items: [] }
                // =================================================

                if (
                    Array.isArray(
                        response.data?.items
                    )
                ) {

                    setNotifications(
                        response.data.items
                    );

                    return;
                }


                // =================================================
                // INVALID RESPONSE
                // =================================================

                console.error(
                    "INVALID NOTIFICATION RESPONSE:",
                    response.data
                );

                setNotifications([]);

            } catch (err) {

                console.error(
                    "================================================="
                );

                console.error(
                    "GET NOTIFICATIONS ERROR:",
                    err
                );

                console.error(
                    "================================================="
                );


                setNotifications([]);


                // =================================================
                // ERROR MESSAGE
                // =================================================

                setError(
                    err.response?.data?.message ||
                    err.response?.data ||
                    err.message ||
                    "Unable to load notifications."
                );

            } finally {

                setLoading(false);
            }

        }, []);


    // =====================================================
    // INITIAL LOAD
    // =====================================================

    useEffect(() => {

        loadNotifications();

    }, [
        loadNotifications
    ]);


    // =====================================================
    // GET NOTIFICATION ID
    // =====================================================

    const getNotificationId =
        (notification) => {

            return (
                notification?.notificationId ??
                notification?.NotificationId ??
                notification?.id ??
                notification?.Id
            );
        };


    // =====================================================
    // GET TITLE
    // =====================================================

    const getTitle =
        (notification) => {

            return (
                notification?.title ??
                notification?.Title ??
                "Notification"
            );
        };


    // =====================================================
    // GET MESSAGE
    // =====================================================

    const getMessage =
        (notification) => {

            return (
                notification?.message ??
                notification?.Message ??
                ""
            );
        };


    // =====================================================
    // GET READ STATUS
    // =====================================================

    const getIsRead =
        (notification) => {

            return (
                notification?.isRead ??
                notification?.IsRead ??
                false
            );
        };


    // =====================================================
    // GET CREATED DATE
    // =====================================================

    const getCreatedDate =
        (notification) => {

            return (
                notification?.createdDate ??
                notification?.CreatedDate ??
                null
            );
        };


    // =====================================================
    // FORMAT DATE
    // =====================================================

    const formatDate =
        (date) => {

            if (!date) {
                return "";
            }


            try {

                return new Date(
                    date
                ).toLocaleString(
                    "en-IN",
                    {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                    }
                );

            } catch {

                return date;
            }
        };


    // =====================================================
    // MARK NOTIFICATION AS READ
    // =====================================================

    const handleMarkAsRead =
        async (
            notification
        ) => {

            const id =
                getNotificationId(
                    notification
                );


            if (!id) {

                console.error(
                    "NOTIFICATION ID NOT FOUND:",
                    notification
                );

                return;
            }


            try {

                console.log(
                    "MARKING NOTIFICATION AS READ:",
                    id
                );


                // =================================================
                // IMPORTANT
                // =================================================
                //
                // Your Node proxy currently only exposes:
                //
                // GET /api/Notification
                //
                // Therefore this PUT will work ONLY after
                // the corresponding Node proxy route exists.
                //
                // =================================================

                await axios.put(
                    `${NOTIFICATION_URL}/${id}/read`
                );


                // =================================================
                // UPDATE FRONTEND
                // =================================================

                setNotifications(
                    previous =>
                        previous.map(
                            item => {

                                const itemId =
                                    getNotificationId(
                                        item
                                    );


                                if (
                                    itemId !== id
                                ) {

                                    return item;
                                }


                                return {
                                    ...item,

                                    isRead: true,
                                };
                            }
                        )
                );


            } catch (err) {

                console.error(
                    "MARK AS READ ERROR:",
                    err
                );


                setError(
                    err.response?.data?.message ||
                    err.message ||
                    "Unable to mark notification as read."
                );
            }
        };


    // =====================================================
    // DELETE NOTIFICATION
    // =====================================================

    const handleDelete =
        async (
            notification
        ) => {

            const id =
                getNotificationId(
                    notification
                );


            if (!id) {

                console.error(
                    "NOTIFICATION ID NOT FOUND:",
                    notification
                );

                return;
            }


            try {

                console.log(
                    "DELETING NOTIFICATION:",
                    id
                );


                // =================================================
                // IMPORTANT
                // =================================================
                //
                // This also requires:
                //
                // DELETE /api/Notification/{id}
                //
                // in Node proxy.
                //
                // =================================================

                await axios.delete(
                    `${NOTIFICATION_URL}/${id}`
                );


                // =================================================
                // REMOVE FROM FRONTEND
                // =================================================

                setNotifications(
                    previous =>
                        previous.filter(
                            item =>
                                getNotificationId(
                                    item
                                ) !== id
                        )
                );


            } catch (err) {

                console.error(
                    "DELETE NOTIFICATION ERROR:",
                    err
                );


                setError(
                    err.response?.data?.message ||
                    err.message ||
                    "Unable to delete notification."
                );
            }
        };


    // =====================================================
    // OPEN NOTIFICATION
    // =====================================================

    const handleOpen =
        async (
            notification
        ) => {

            const id =
                getNotificationId(
                    notification
                );


            if (!id) {

                return;
            }


            // =================================================
            // MARK AS READ
            // =================================================

            if (
                !getIsRead(
                    notification
                )
            ) {

                try {

                    await handleMarkAsRead(
                        notification
                    );

                } catch {

                    // Continue navigation
                }
            }


            // =================================================
            // NAVIGATE
            // =================================================

            navigate(
                `/notifications/view/${id}`
            );
        };


    // =====================================================
    // REFRESH
    // =====================================================

    const handleRefresh = () => {

        loadNotifications();
    };


    // =====================================================
    // LOADING
    // =====================================================

    if (
        loading
    ) {

        return (
            <Box
                sx={{
                    width: "100%",
                    minHeight: 350,

                    display: "flex",
                    flexDirection: "column",

                    alignItems: "center",
                    justifyContent: "center",

                    gap: 2,
                }}
            >

                <CircularProgress />

                <Typography
                    color="text.secondary"
                >
                    Loading notifications...
                </Typography>

            </Box>
        );
    }


    // =====================================================
    // MAIN RENDER
    // =====================================================

    return (
        <Box
            sx={{
                width: "100%",
                p: 3,
            }}
        >

            {/* =================================================
                HEADER
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
                        sx={{
                            mt: 0.5,
                        }}
                    >
                        {notifications.length}{" "}

                        notification
                        {notifications.length !== 1
                            ? "s"
                            : ""}
                    </Typography>

                </Box>


                <Button
                    variant="outlined"
                    startIcon={
                        <Refresh />
                    }
                    onClick={
                        handleRefresh
                    }
                    disabled={
                        loading
                    }
                >
                    Refresh
                </Button>

            </Box>


            {/* =================================================
                ERROR
               ================================================= */}

            {error && (

                <Alert
                    severity="error"
                    sx={{
                        mb: 2,
                    }}
                >
                    {error}
                </Alert>

            )}


            {/* =================================================
                EMPTY STATE
               ================================================= */}

            {notifications.length === 0 && (

                <Box
                    sx={{
                        minHeight: 300,

                        display: "flex",
                        flexDirection: "column",

                        alignItems: "center",
                        justifyContent: "center",

                        border: "1px dashed",
                        borderColor: "divider",

                        borderRadius: 2,

                        textAlign: "center",

                        p: 4,
                    }}
                >

                    <NotificationsNone
                        sx={{
                            fontSize: 64,
                            color: "text.disabled",
                            mb: 2,
                        }}
                    />


                    <Typography
                        variant="h6"
                        fontWeight={700}
                    >
                        No Notifications
                    </Typography>


                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                            mt: 1,
                        }}
                    >
                        You don't have any
                        notifications at the moment.
                    </Typography>

                </Box>

            )}


            {/* =================================================
                NOTIFICATION LIST
               ================================================= */}

            {notifications.length > 0 && (

                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",

                        gap: 2,
                    }}
                >

                    {notifications.map(
                        (
                            notification,
                            index
                        ) => {

                            const id =
                                getNotificationId(
                                    notification
                                ) ??
                                index;


                            const title =
                                getTitle(
                                    notification
                                );


                            const message =
                                getMessage(
                                    notification
                                );


                            const isRead =
                                getIsRead(
                                    notification
                                );


                            const createdDate =
                                getCreatedDate(
                                    notification
                                );


                            return (

                                <Card
                                    key={id}
                                    onClick={() =>
                                        handleOpen(
                                            notification
                                        )
                                    }
                                    sx={{
                                        cursor: "pointer",

                                        borderRadius: 2,

                                        border:
                                            "1px solid",

                                        borderColor:
                                            isRead
                                                ? "divider"
                                                : "primary.main",

                                        backgroundColor:
                                            isRead
                                                ? "background.paper"
                                                : "action.hover",

                                        transition:
                                            "0.2s",

                                        "&:hover": {
                                            boxShadow: 3,
                                        },
                                    }}
                                >

                                    <CardContent>

                                        {/* =================================================
                                            TOP ROW
                                           ================================================= */}

                                        <Box
                                            sx={{
                                                display: "flex",
                                                alignItems:
                                                    "flex-start",
                                                justifyContent:
                                                    "space-between",
                                            }}
                                        >

                                            <Box
                                                sx={{
                                                    flex: 1,
                                                }}
                                            >

                                                <Box
                                                    sx={{
                                                        display:
                                                            "flex",
                                                        alignItems:
                                                            "center",
                                                        gap: 1,
                                                    }}
                                                >

                                                    <Typography
                                                        variant="h6"
                                                        fontWeight={
                                                            isRead
                                                                ? 500
                                                                : 700
                                                        }
                                                    >
                                                        {title}
                                                    </Typography>


                                                    {!isRead && (

                                                        <Box
                                                            sx={{
                                                                width: 8,
                                                                height: 8,

                                                                borderRadius:
                                                                    "50%",

                                                                backgroundColor:
                                                                    "primary.main",
                                                            }}
                                                        />

                                                    )}

                                                </Box>


                                                {/* =================================================
                                                    MESSAGE
                                                   ================================================= */}

                                                <Typography
                                                    variant="body2"
                                                    color="text.secondary"
                                                    sx={{
                                                        mt: 1,
                                                    }}
                                                >
                                                    {message}
                                                </Typography>


                                                {/* =================================================
                                                    DATE
                                                   ================================================= */}

                                                <Typography
                                                    variant="caption"
                                                    color="text.disabled"
                                                    sx={{
                                                        display:
                                                            "block",
                                                        mt: 1.5,
                                                    }}
                                                >
                                                    {formatDate(
                                                        createdDate
                                                    )}
                                                </Typography>

                                            </Box>


                                            {/* =================================================
                                                ACTIONS
                                               ================================================= */}

                                            <Box
                                                sx={{
                                                    display:
                                                        "flex",
                                                    alignItems:
                                                        "center",
                                                }}
                                            >

                                                {!isRead && (

                                                    <IconButton
                                                        size="small"
                                                        title="Mark as read"
                                                        onClick={(
                                                            event
                                                        ) => {

                                                            event
                                                                .stopPropagation();

                                                            handleMarkAsRead(
                                                                notification
                                                            );
                                                        }}
                                                    >

                                                        <Done />

                                                    </IconButton>

                                                )}


                                                <IconButton
                                                    size="small"
                                                    title="Delete"
                                                    onClick={(
                                                        event
                                                    ) => {

                                                        event
                                                            .stopPropagation();

                                                        handleDelete(
                                                            notification
                                                        );
                                                    }}
                                                >

                                                    <Delete />

                                                </IconButton>

                                            </Box>

                                        </Box>


                                        <Divider
                                            sx={{
                                                mt: 2,
                                            }}
                                        />


                                        {/* =================================================
                                            CUSTOMER / SELLER INFO
                                           ================================================= */}

                                        <Box
                                            sx={{
                                                display: "flex",
                                                gap: 3,
                                                mt: 1.5,
                                            }}
                                        >

                                            <Typography
                                                variant="caption"
                                                color="text.secondary"
                                            >
                                                Customer ID:{" "}
                                                {
                                                    notification.customerId ??
                                                    notification.CustomerId ??
                                                    "-"
                                                }
                                            </Typography>


                                            <Typography
                                                variant="caption"
                                                color="text.secondary"
                                            >
                                                Seller ID:{" "}
                                                {
                                                    notification.sellerId ??
                                                    notification.SellerId ??
                                                    "-"
                                                }
                                            </Typography>

                                        </Box>

                                    </CardContent>

                                </Card>

                            );
                        }
                    )}

                </Box>

            )}

        </Box>
    );
};


// =========================================================
// EXPORT
// =========================================================

export default NotificationList;
