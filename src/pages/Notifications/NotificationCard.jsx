// =========================================================
// NotificationCard.jsx
// =========================================================

import React from "react";

import {
    Avatar,
    Box,
    Card,
    CardContent,
    Chip,
    IconButton,
    Tooltip,
    Typography,
} from "@mui/material";

import {
    CheckCircle,
    Delete,
    Error,
    Info,
    Notifications,
    OpenInNew,
    PriorityHigh,
    Warning,
} from "@mui/icons-material";

// =========================================================
// COMPONENT
// =========================================================

const NotificationCard = ({
    notification = {},
    onClick,
    onMarkRead,
    onDelete,
    loading = false,
}) => {
    // =========================================================
    // SAFE VALUES
    // =========================================================

    const notificationId =
        notification?.notificationId ??
        notification?.id;

    const title =
        notification?.title ??
        notification?.notificationTitle ??
        "Notification";

    const message =
        notification?.message ??
        notification?.description ??
        notification?.content ??
        "";

    const type =
        notification?.type ??
        notification?.notificationType ??
        "Info";

    const priority =
        notification?.priority ??
        "Normal";

    const isRead =
        notification?.isRead ??
        notification?.read ??
        false;

    const createdAt =
        notification?.createdAt ??
        notification?.createdDate ??
        notification?.date ??
        notification?.timestamp;

    // =========================================================
    // TYPE
    // =========================================================

    const normalizedType =
        String(type).toLowerCase();

    const getTypeIcon = () => {
        switch (normalizedType) {
            case "success":
                return <CheckCircle />;

            case "warning":
                return <Warning />;

            case "error":
            case "danger":
                return <Error />;

            case "important":
                return <PriorityHigh />;

            case "info":
                return <Info />;

            default:
                return <Notifications />;
        }
    };

    const getTypeColor = () => {
        switch (normalizedType) {
            case "success":
                return "success";

            case "warning":
                return "warning";

            case "error":
            case "danger":
                return "error";

            case "important":
                return "error";

            case "info":
                return "info";

            default:
                return "primary";
        }
    };

    // =========================================================
    // PRIORITY COLOR
    // =========================================================

    const getPriorityColor = () => {
        switch (
            String(priority).toLowerCase()
        ) {
            case "high":
            case "urgent":
                return "error";

            case "medium":
                return "warning";

            case "low":
                return "default";

            default:
                return "default";
        }
    };

    // =========================================================
    // DATE FORMAT
    // =========================================================

    const formatDate = (date) => {
        if (!date) {
            return "";
        }

        const parsedDate =
            new Date(date);

        if (
            Number.isNaN(
                parsedDate.getTime()
            )
        ) {
            return String(date);
        }

        return parsedDate.toLocaleString(
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
    // HANDLE CARD CLICK
    // =========================================================

    const handleClick = () => {
        if (loading) {
            return;
        }

        if (
            !isRead &&
            onMarkRead
        ) {
            onMarkRead(
                notificationId,
                notification
            );
        }

        if (onClick) {
            onClick(notification);
        }
    };

    // =========================================================
    // DELETE
    // =========================================================

    const handleDelete = (event) => {
        event.stopPropagation();

        if (
            loading ||
            !onDelete
        ) {
            return;
        }

        onDelete(
            notificationId,
            notification
        );
    };

    // =========================================================
    // MARK READ
    // =========================================================

    const handleMarkRead = (event) => {
        event.stopPropagation();

        if (
            loading ||
            isRead ||
            !onMarkRead
        ) {
            return;
        }

        onMarkRead(
            notificationId,
            notification
        );
    };

    // =========================================================
    // RENDER
    // =========================================================

    return (
        <Card
            onClick={handleClick}
            elevation={isRead ? 0 : 2}
            sx={{
                width: "100%",
                cursor: onClick
                    ? "pointer"
                    : "default",

                borderRadius: 2,

                border: "1px solid",

                borderColor: isRead
                    ? "divider"
                    : "primary.main",

                bgcolor: isRead
                    ? "background.paper"
                    : "action.hover",

                opacity: loading ? 0.7 : 1,

                transition:
                    "all 0.2s ease",

                "&:hover": onClick
                    ? {
                          boxShadow: 3,
                          transform:
                              "translateY(-1px)",
                      }
                    : {},
            }}
        >
            <CardContent
                sx={{
                    p: 2,
                    "&:last-child": {
                        pb: 2,
                    },
                }}
            >
                <Box
                    sx={{
                        display: "flex",
                        alignItems:
                            "flex-start",
                        gap: 2,
                    }}
                >
                    {/* =================================================
                        ICON
                       ================================================= */}

                    <Avatar
                        sx={{
                            bgcolor: `${getTypeColor()}.main`,
                            color: `${getTypeColor()}.contrastText`,
                            width: 44,
                            height: 44,
                        }}
                    >
                        {getTypeIcon()}
                    </Avatar>

                    {/* =================================================
                        CONTENT
                       ================================================= */}

                    <Box
                        sx={{
                            flex: 1,
                            minWidth: 0,
                        }}
                    >
                        {/* TITLE */}

                        <Box
                            sx={{
                                display: "flex",
                                alignItems:
                                    "center",
                                gap: 1,
                                flexWrap:
                                    "wrap",
                            }}
                        >
                            <Typography
                                variant="subtitle1"
                                fontWeight={
                                    isRead
                                        ? 500
                                        : 700
                                }
                                sx={{
                                    wordBreak:
                                        "break-word",
                                }}
                            >
                                {title}
                            </Typography>

                            {!isRead && (
                                <Chip
                                    label="New"
                                    color="primary"
                                    size="small"
                                />
                            )}
                        </Box>

                        {/* MESSAGE */}

                        {message && (
                            <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{
                                    mt: 0.75,
                                    whiteSpace:
                                        "pre-wrap",
                                    wordBreak:
                                        "break-word",
                                }}
                            >
                                {message}
                            </Typography>
                        )}

                        {/* =================================================
                            META
                           ================================================= */}

                        <Box
                            sx={{
                                mt: 1.5,
                                display: "flex",
                                alignItems:
                                    "center",
                                gap: 1,
                                flexWrap:
                                    "wrap",
                            }}
                        >
                            <Chip
                                label={type}
                                size="small"
                                color={
                                    getTypeColor()
                                }
                                variant="outlined"
                            />

                            {priority &&
                                String(
                                    priority
                                ).toLowerCase() !==
                                    "normal" && (
                                    <Chip
                                        label={`Priority: ${priority}`}
                                        size="small"
                                        color={getPriorityColor()}
                                        variant="outlined"
                                    />
                                )}

                            {createdAt && (
                                <Typography
                                    variant="caption"
                                    color="text.secondary"
                                >
                                    {formatDate(
                                        createdAt
                                    )}
                                </Typography>
                            )}
                        </Box>
                    </Box>

                    {/* =================================================
                        ACTIONS
                       ================================================= */}

                    <Box
                        sx={{
                            display: "flex",
                            alignItems:
                                "center",
                            gap: 0.5,
                        }}
                    >
                        {!isRead && (
                            <Tooltip title="Mark as read">
                                <IconButton
                                    size="small"
                                    color="primary"
                                    onClick={
                                        handleMarkRead
                                    }
                                    disabled={
                                        loading
                                    }
                                >
                                    <CheckCircle fontSize="small" />
                                </IconButton>
                            </Tooltip>
                        )}

                        {onClick && (
                            <Tooltip title="Open">
                                <IconButton
                                    size="small"
                                    color="primary"
                                    onClick={(
                                        event
                                    ) => {
                                        event.stopPropagation();

                                        if (
                                            !isRead &&
                                            onMarkRead
                                        ) {
                                            onMarkRead(
                                                notificationId,
                                                notification
                                            );
                                        }

                                        onClick(
                                            notification
                                        );
                                    }}
                                    disabled={
                                        loading
                                    }
                                >
                                    <OpenInNew fontSize="small" />
                                </IconButton>
                            </Tooltip>
                        )}

                        {onDelete && (
                            <Tooltip title="Delete">
                                <IconButton
                                    size="small"
                                    color="error"
                                    onClick={
                                        handleDelete
                                    }
                                    disabled={
                                        loading
                                    }
                                >
                                    <Delete fontSize="small" />
                                </IconButton>
                            </Tooltip>
                        )}
                    </Box>
                </Box>
            </CardContent>
        </Card>
    );
};

export default NotificationCard;