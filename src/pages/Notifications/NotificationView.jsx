import React, { useMemo, useState } from "react";
import {
    Box,
    Paper,
    Typography,
    IconButton,
    Button,
    TextField,
    MenuItem,
    Chip,
    Divider,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Avatar,
    Badge,
    Tooltip,
    InputAdornment,
} from "@mui/material";

import {
    Notifications,
    NotificationsNone,
    ShoppingCart,
    Payment,
    Inventory,
    Warning,
    Person,
    Assessment,
    Delete,
    DoneAll,
    Search,
    MarkEmailRead,
} from "@mui/icons-material";

const NotificationView = () => {
    const [notifications, setNotifications] = useState([
        {
            id: 1,
            type: "order",
            title: "New Order Received",
            message: "A new order #ORD-10025 has been received.",
            time: "10 minutes ago",
            read: false,
        },
        {
            id: 2,
            type: "payment",
            title: "Payment Received",
            message: "Payment of ₹25,000 has been received successfully.",
            time: "30 minutes ago",
            read: false,
        },
        {
            id: 3,
            type: "inventory",
            title: "Inventory Updated",
            message: "Stock quantity for Product #PRD-1005 was updated.",
            time: "1 hour ago",
            read: true,
        },
        {
            id: 4,
            type: "low-stock",
            title: "Low Stock Alert",
            message: "Product #PRD-1020 has only 5 units remaining.",
            time: "2 hours ago",
            read: false,
        },
        {
            id: 5,
            type: "customer",
            title: "New Customer Added",
            message: "A new customer has been added to your customer list.",
            time: "3 hours ago",
            read: true,
        },
        {
            id: 6,
            type: "report",
            title: "Report Generated",
            message: "Your monthly sales report is ready.",
            time: "Yesterday",
            read: true,
        },
    ]);

    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("all");

    // =========================================================
    // UNREAD COUNT
    // =========================================================

    const unreadCount = notifications.filter(
        (notification) => !notification.read
    ).length;

    // =========================================================
    // NOTIFICATION ICON
    // =========================================================

    const getNotificationIcon = (type) => {
        switch (type) {
            case "order":
                return <ShoppingCart />;

            case "payment":
                return <Payment />;

            case "inventory":
                return <Inventory />;

            case "low-stock":
                return <Warning />;

            case "customer":
                return <Person />;

            case "report":
                return <Assessment />;

            default:
                return <Notifications />;
        }
    };

    // =========================================================
    // NOTIFICATION ICON COLOR
    // =========================================================

    const getNotificationColor = (type) => {
        switch (type) {
            case "order":
                return "primary";

            case "payment":
                return "success";

            case "inventory":
                return "info";

            case "low-stock":
                return "warning";

            case "customer":
                return "secondary";

            case "report":
                return "default";

            default:
                return "primary";
        }
    };

    // =========================================================
    // MARK AS READ
    // =========================================================

    const handleMarkAsRead = (id) => {
        setNotifications((prev) =>
            prev.map((notification) =>
                notification.id === id
                    ? {
                          ...notification,
                          read: true,
                      }
                    : notification
            )
        );
    };

    // =========================================================
    // MARK ALL AS READ
    // =========================================================

    const handleMarkAllAsRead = () => {
        setNotifications((prev) =>
            prev.map((notification) => ({
                ...notification,
                read: true,
            }))
        );
    };

    // =========================================================
    // DELETE NOTIFICATION
    // =========================================================

    const handleDelete = (id) => {
        setNotifications((prev) =>
            prev.filter((notification) => notification.id !== id)
        );
    };

    // =========================================================
    // FILTER NOTIFICATIONS
    // =========================================================

    const filteredNotifications = useMemo(() => {
        return notifications.filter((notification) => {
            const matchesSearch =
                notification.title
                    .toLowerCase()
                    .includes(search.toLowerCase()) ||
                notification.message
                    .toLowerCase()
                    .includes(search.toLowerCase());

            let matchesFilter = true;

            if (filter === "unread") {
                matchesFilter = !notification.read;
            }

            if (filter === "read") {
                matchesFilter = notification.read;
            }

            if (
                filter !== "all" &&
                filter !== "read" &&
                filter !== "unread"
            ) {
                matchesFilter = notification.type === filter;
            }

            return matchesSearch && matchesFilter;
        });
    }, [notifications, search, filter]);

    return (
        <Box sx={{ p: 3 }}>
            {/* =====================================================
                HEADER
               ===================================================== */}

            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: {
                        xs: "flex-start",
                        md: "center",
                    },
                    flexDirection: {
                        xs: "column",
                        md: "row",
                    },
                    gap: 2,
                    mb: 3,
                }}
            >
                <Box>
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 2,
                        }}
                    >
                        <Badge
                            badgeContent={unreadCount}
                            color="error"
                        >
                            <Notifications fontSize="large" />
                        </Badge>

                        <Typography
                            variant="h4"
                            fontWeight="bold"
                        >
                            Notifications
                        </Typography>
                    </Box>

                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mt: 1 }}
                    >
                        View and manage your latest notifications.
                    </Typography>
                </Box>

                <Button
                    variant="outlined"
                    startIcon={<DoneAll />}
                    onClick={handleMarkAllAsRead}
                    disabled={unreadCount === 0}
                >
                    Mark All as Read
                </Button>
            </Box>

            {/* =====================================================
                SUMMARY
               ===================================================== */}

            <Box
                sx={{
                    display: "flex",
                    gap: 2,
                    mb: 3,
                    flexWrap: "wrap",
                }}
            >
                <Chip
                    icon={<Notifications />}
                    label={`Total: ${notifications.length}`}
                />

                <Chip
                    icon={<NotificationsNone />}
                    label={`Unread: ${unreadCount}`}
                    color="error"
                    variant={unreadCount > 0 ? "filled" : "outlined"}
                />

                <Chip
                    icon={<MarkEmailRead />}
                    label={`Read: ${
                        notifications.length - unreadCount
                    }`}
                    color="success"
                    variant="outlined"
                />
            </Box>

            {/* =====================================================
                SEARCH & FILTER
               ===================================================== */}

            <Paper
                elevation={2}
                sx={{
                    p: 2,
                    mb: 3,
                    borderRadius: 2,
                }}
            >
                <Box
                    sx={{
                        display: "flex",
                        gap: 2,
                        flexDirection: {
                            xs: "column",
                            md: "row",
                        },
                    }}
                >
                    <TextField
                        fullWidth
                        label="Search Notifications"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search by title or message..."
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Search />
                                </InputAdornment>
                            ),
                        }}
                    />

                    <TextField
                        select
                        label="Filter"
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        sx={{
                            minWidth: {
                                xs: "100%",
                                md: 220,
                            },
                        }}
                    >
                        <MenuItem value="all">
                            All Notifications
                        </MenuItem>

                        <MenuItem value="unread">
                            Unread
                        </MenuItem>

                        <MenuItem value="read">
                            Read
                        </MenuItem>

                        <MenuItem value="order">
                            Orders
                        </MenuItem>

                        <MenuItem value="payment">
                            Payments
                        </MenuItem>

                        <MenuItem value="inventory">
                            Inventory
                        </MenuItem>

                        <MenuItem value="low-stock">
                            Low Stock
                        </MenuItem>

                        <MenuItem value="customer">
                            Customers
                        </MenuItem>

                        <MenuItem value="report">
                            Reports
                        </MenuItem>
                    </TextField>
                </Box>
            </Paper>

            {/* =====================================================
                NOTIFICATION LIST
               ===================================================== */}

            <Paper
                elevation={2}
                sx={{
                    borderRadius: 2,
                    overflow: "hidden",
                }}
            >
                {filteredNotifications.length === 0 ? (
                    <Box
                        sx={{
                            py: 8,
                            textAlign: "center",
                        }}
                    >
                        <NotificationsNone
                            sx={{
                                fontSize: 70,
                                color: "text.secondary",
                                mb: 2,
                            }}
                        />

                        <Typography
                            variant="h6"
                            fontWeight="bold"
                        >
                            No Notifications Found
                        </Typography>

                        <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ mt: 1 }}
                        >
                            There are no notifications matching your
                            search or filter.
                        </Typography>
                    </Box>
                ) : (
                    <List disablePadding>
                        {filteredNotifications.map(
                            (notification, index) => (
                                <React.Fragment
                                    key={notification.id}
                                >
                                    <ListItem
                                        alignItems="flex-start"
                                        sx={{
                                            py: 2,
                                            px: 3,
                                            backgroundColor:
                                                notification.read
                                                    ? "transparent"
                                                    : "action.hover",
                                            "&:hover": {
                                                backgroundColor:
                                                    "action.selected",
                                            },
                                        }}
                                        secondaryAction={
                                            <Box
                                                sx={{
                                                    display: "flex",
                                                    gap: 0.5,
                                                }}
                                            >
                                                {!notification.read && (
                                                    <Tooltip title="Mark as read">
                                                        <IconButton
                                                            onClick={() =>
                                                                handleMarkAsRead(
                                                                    notification.id
                                                                )
                                                            }
                                                        >
                                                            <MarkEmailRead />
                                                        </IconButton>
                                                    </Tooltip>
                                                )}

                                                <Tooltip title="Delete">
                                                    <IconButton
                                                        color="error"
                                                        onClick={() =>
                                                            handleDelete(
                                                                notification.id
                                                            )
                                                        }
                                                    >
                                                        <Delete />
                                                    </IconButton>
                                                </Tooltip>
                                            </Box>
                                        }
                                    >
                                        <ListItemAvatar>
                                            <Avatar
                                                sx={{
                                                    bgcolor: "background.default",
                                                    color: "text.primary",
                                                }}
                                            >
                                                {getNotificationIcon(
                                                    notification.type
                                                )}
                                            </Avatar>
                                        </ListItemAvatar>

                                        <ListItemText
                                            sx={{
                                                mr: 10,
                                            }}
                                            primary={
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
                                                            notification.read
                                                                ? "normal"
                                                                : "bold"
                                                        }
                                                    >
                                                        {
                                                            notification.title
                                                        }
                                                    </Typography>

                                                    {!notification.read && (
                                                        <Chip
                                                            label="Unread"
                                                            size="small"
                                                            color="error"
                                                        />
                                                    )}
                                                </Box>
                                            }
                                            secondary={
                                                <Box sx={{ mt: 0.5 }}>
                                                    <Typography
                                                        variant="body2"
                                                        color="text.secondary"
                                                    >
                                                        {
                                                            notification.message
                                                        }
                                                    </Typography>

                                                    <Typography
                                                        variant="caption"
                                                        color="text.secondary"
                                                        sx={{
                                                            display:
                                                                "block",
                                                            mt: 0.5,
                                                        }}
                                                    >
                                                        {
                                                            notification.time
                                                        }
                                                    </Typography>
                                                </Box>
                                            }
                                        />
                                    </ListItem>

                                    {index <
                                        filteredNotifications.length -
                                            1 && <Divider />}
                                </React.Fragment>
                            )
                        )}
                    </List>
                )}
            </Paper>
        </Box>
    );
};

export default NotificationView;