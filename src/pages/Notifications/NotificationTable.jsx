import React from "react";

import {
    Alert,
    Box,
    Chip,
    CircularProgress,
    IconButton,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Tooltip,
    Typography,
} from "@mui/material";

import {
    DeleteOutline,
    Done,
    NotificationsNone,
    Visibility,
} from "@mui/icons-material";


// =========================================================
// HELPERS
// =========================================================

// =========================================================
// NOTIFICATION ID
// =========================================================

const getNotificationId = (
    notification
) => {

    return (
        notification?.notificationId ??
        notification?.NotificationId ??
        notification?.id ??
        notification?.Id
    );
};


// =========================================================
// CUSTOMER ID
// =========================================================

const getCustomerId = (
    notification
) => {

    return (
        notification?.customerId ??
        notification?.CustomerId ??
        "-"
    );
};


// =========================================================
// SELLER ID
// =========================================================

const getSellerId = (
    notification
) => {

    return (
        notification?.sellerId ??
        notification?.SellerId ??
        "-"
    );
};


// =========================================================
// READ STATUS
// =========================================================

const getIsRead = (
    notification
) => {

    return (
        notification?.isRead ??
        notification?.IsRead ??
        false
    );
};


// =========================================================
// TITLE
// =========================================================

const getTitle = (
    notification
) => {

    return (
        notification?.title ??
        notification?.Title ??
        "Notification"
    );
};


// =========================================================
// MESSAGE
// =========================================================

const getMessage = (
    notification
) => {

    return (
        notification?.message ??
        notification?.Message ??
        ""
    );
};


// =========================================================
// CREATED DATE
// =========================================================

const getCreatedDate = (
    notification
) => {

    return (
        notification?.createdDate ??
        notification?.CreatedDate ??
        null
    );
};


// =========================================================
// DATE FORMAT
// =========================================================

const formatDate = (
    value
) => {

    if (!value) {

        return "-";
    }


    const date =
        new Date(value);


    if (
        Number.isNaN(
            date.getTime()
        )
    ) {

        return value;
    }


    return date.toLocaleString(
        "en-IN",
        {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        }
    );
};


// =========================================================
// COMPONENT
// =========================================================

const NotificationTable = ({
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
        Array.isArray(
            notifications
        )
            ? notifications
            : Array.isArray(
                notifications?.data
            )
                ? notifications.data
                : Array.isArray(
                    notifications?.items
                )
                    ? notifications.items
                    : [];


    // =========================================================
    // LOADING
    // =========================================================

    if (loading) {

        return (

            <Paper
                elevation={0}
                sx={{
                    width: "100%",

                    border: "1px solid",
                    borderColor: "divider",

                    borderRadius: 2,
                }}
            >

                <Box
                    sx={{
                        minHeight: 300,

                        display: "flex",
                        flexDirection: "column",

                        alignItems: "center",
                        justifyContent: "center",

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

            </Paper>
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

    if (
        notificationItems.length === 0
    ) {

        return (

            <Paper
                elevation={0}
                sx={{
                    width: "100%",

                    border: "1px solid",
                    borderColor: "divider",

                    borderRadius: 2,
                }}
            >

                <Box
                    sx={{
                        py: 8,
                        px: 3,

                        textAlign: "center",
                    }}
                >

                    <NotificationsNone
                        sx={{
                            fontSize: 56,

                            color:
                                "text.disabled",

                            mb: 1,
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
                            mt: 0.5,
                        }}
                    >
                        You don't have any
                        notifications at the moment.
                    </Typography>

                </Box>

            </Paper>
        );
    }


    // =========================================================
    // TABLE
    // =========================================================

    return (

        <TableContainer
            component={Paper}
            elevation={0}
            sx={{
                width: "100%",

                border: "1px solid",
                borderColor: "divider",

                borderRadius: 2,

                overflowX: "auto",
            }}
        >

            <Table
                sx={{
                    minWidth: 1100,
                }}
            >

                {/* =================================================
                    TABLE HEADER
                   ================================================= */}

                <TableHead>

                    <TableRow>

                        {/* ID */}

                        <TableCell
                            sx={{
                                fontWeight: 700,
                                whiteSpace: "nowrap",
                            }}
                        >
                            ID
                        </TableCell>


                        {/* CUSTOMER */}

                        <TableCell
                            sx={{
                                fontWeight: 700,
                                whiteSpace: "nowrap",
                            }}
                        >
                            Customer ID
                        </TableCell>


                        {/* SELLER */}

                        <TableCell
                            sx={{
                                fontWeight: 700,
                                whiteSpace: "nowrap",
                            }}
                        >
                            Seller ID
                        </TableCell>


                        {/* TITLE */}

                        <TableCell
                            sx={{
                                fontWeight: 700,
                                minWidth: 180,
                            }}
                        >
                            Title
                        </TableCell>


                        {/* MESSAGE */}

                        <TableCell
                            sx={{
                                fontWeight: 700,
                                minWidth: 350,
                            }}
                        >
                            Message
                        </TableCell>


                        {/* STATUS */}

                        <TableCell
                            sx={{
                                fontWeight: 700,
                                whiteSpace: "nowrap",
                            }}
                        >
                            Status
                        </TableCell>


                        {/* CREATED */}

                        <TableCell
                            sx={{
                                fontWeight: 700,
                                whiteSpace: "nowrap",
                            }}
                        >
                            Created
                        </TableCell>


                        {/* ACTIONS */}

                        <TableCell
                            align="center"
                            sx={{
                                fontWeight: 700,
                                whiteSpace: "nowrap",
                            }}
                        >
                            Actions
                        </TableCell>

                    </TableRow>

                </TableHead>


                {/* =================================================
                    TABLE BODY
                   ================================================= */}

                <TableBody>

                    {notificationItems.map(
                        (
                            notification,
                            index
                        ) => {

                            const id =
                                getNotificationId(
                                    notification
                                ) ??
                                index;


                            const customerId =
                                getCustomerId(
                                    notification
                                );


                            const sellerId =
                                getSellerId(
                                    notification
                                );


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

                                <TableRow
                                    key={id}
                                    hover

                                    sx={{
                                        cursor:
                                            onNotificationClick
                                                ? "pointer"
                                                : "default",

                                        backgroundColor:
                                            !isRead
                                                ? "action.hover"
                                                : "transparent",

                                        "&:last-child td, &:last-child th":
                                            {
                                                border: 0,
                                            },
                                    }}

                                    onClick={() =>
                                        onNotificationClick?.(
                                            notification
                                        )
                                    }
                                >

                                    {/* =================================================
                                        ID
                                       ================================================= */}

                                    <TableCell>

                                        <Typography
                                            variant="body2"
                                            fontWeight={600}
                                        >
                                            #{id}
                                        </Typography>

                                    </TableCell>


                                    {/* =================================================
                                        CUSTOMER ID
                                       ================================================= */}

                                    <TableCell>

                                        <Typography
                                            variant="body2"
                                        >
                                            {customerId}
                                        </Typography>

                                    </TableCell>


                                    {/* =================================================
                                        SELLER ID
                                       ================================================= */}

                                    <TableCell>

                                        <Typography
                                            variant="body2"
                                        >
                                            {sellerId}
                                        </Typography>

                                    </TableCell>


                                    {/* =================================================
                                        TITLE
                                       ================================================= */}

                                    <TableCell>

                                        <Typography
                                            variant="body2"
                                            fontWeight={
                                                isRead
                                                    ? 500
                                                    : 700
                                            }
                                        >
                                            {title}
                                        </Typography>

                                    </TableCell>


                                    {/* =================================================
                                        MESSAGE
                                       ================================================= */}

                                    <TableCell>

                                        <Typography
                                            variant="body2"
                                            color="text.secondary"

                                            sx={{
                                                maxWidth: 450,

                                                overflow:
                                                    "hidden",

                                                textOverflow:
                                                    "ellipsis",

                                                whiteSpace:
                                                    "nowrap",
                                            }}
                                        >
                                            {message || "-"}
                                        </Typography>

                                    </TableCell>


                                    {/* =================================================
                                        STATUS
                                       ================================================= */}

                                    <TableCell>

                                        {isRead ? (

                                            <Chip
                                                label="Read"
                                                size="small"
                                                icon={
                                                    <Done />
                                                }
                                            />

                                        ) : (

                                            <Chip
                                                label="Unread"
                                                size="small"
                                                color="primary"
                                            />

                                        )}

                                    </TableCell>


                                    {/* =================================================
                                        CREATED
                                       ================================================= */}

                                    <TableCell>

                                        <Typography
                                            variant="body2"
                                            color="text.secondary"

                                            sx={{
                                                whiteSpace:
                                                    "nowrap",
                                            }}
                                        >
                                            {formatDate(
                                                createdDate
                                            )}
                                        </Typography>

                                    </TableCell>


                                    {/* =================================================
                                        ACTIONS
                                       ================================================= */}

                                    <TableCell
                                        align="center"

                                        onClick={(
                                            event
                                        ) =>
                                            event.stopPropagation()
                                        }
                                    >

                                        <Box
                                            sx={{
                                                display:
                                                    "flex",

                                                justifyContent:
                                                    "center",

                                                gap: 0.5,
                                            }}
                                        >

                                            {/* =================================================
                                                VIEW
                                               ================================================= */}

                                            <Tooltip
                                                title="View"
                                            >

                                                <IconButton
                                                    size="small"

                                                    onClick={() =>
                                                        onNotificationClick?.(
                                                            notification
                                                        )
                                                    }
                                                >

                                                    <Visibility
                                                        fontSize="small"
                                                    />

                                                </IconButton>

                                            </Tooltip>


                                            {/* =================================================
                                                MARK AS READ
                                               ================================================= */}

                                            {!isRead && (

                                                <Tooltip
                                                    title="Mark as read"
                                                >

                                                    <IconButton
                                                        size="small"

                                                        onClick={() =>
                                                            onMarkRead?.(
                                                                notification
                                                            )
                                                        }
                                                    >

                                                        <Done
                                                            fontSize="small"
                                                        />

                                                    </IconButton>

                                                </Tooltip>

                                            )}


                                            {/* =================================================
                                                DELETE
                                               ================================================= */}

                                            <Tooltip
                                                title="Delete"
                                            >

                                                <IconButton
                                                    size="small"
                                                    color="error"

                                                    onClick={() =>
                                                        onDelete?.(
                                                            notification
                                                        )
                                                    }
                                                >

                                                    <DeleteOutline
                                                        fontSize="small"
                                                    />

                                                </IconButton>

                                            </Tooltip>

                                        </Box>

                                    </TableCell>

                                </TableRow>
                            );
                        }
                    )}

                </TableBody>

            </Table>

        </TableContainer>
    );
};


// =========================================================
// EXPORT
// =========================================================

export default NotificationTable;

