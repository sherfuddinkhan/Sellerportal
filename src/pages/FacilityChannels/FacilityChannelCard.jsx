import React from "react";

import {
    Card,
    CardContent,
    CardActions,
    Typography,
    Box,
    Chip,
    Button,
    Divider,
    Stack,
    Tooltip
} from "@mui/material";

import {
    Business,
    Hub,
    Tag,
    Description,
    Visibility,
    Edit,
    Delete,
    CalendarToday
} from "@mui/icons-material";

/* =========================================================
   FORMAT DATE
========================================================= */

const formatDate = (value) => {
    if (!value) {
        return "N/A";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return "N/A";
    }

    return date.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric"
    });
};

/* =========================================================
   GET STATUS CONFIGURATION
========================================================= */

const getStatusConfig = (status) => {
    const normalizedStatus = String(status || "pending")
        .trim()
        .toLowerCase();

    switch (normalizedStatus) {
        case "active":
            return {
                label: "Active",
                color: "success"
            };

        case "inactive":
            return {
                label: "Inactive",
                color: "default"
            };

        case "pending":
            return {
                label: "Pending",
                color: "warning"
            };

        default:
            return {
                label: status || "Unknown",
                color: "default"
            };
    }
};

/* =========================================================
   GET FACILITY CHANNEL ID
========================================================= */

const getFacilityChannelId = (facilityChannel) => {
    return (
        facilityChannel?.facilityChannelId ??
        facilityChannel?.id ??
        null
    );
};

/* =========================================================
   FACILITY CHANNEL CARD
========================================================= */

const FacilityChannelCard = ({
    facilityChannel = {},
    onView,
    onEdit,
    onDelete,
    loading = false
}) => {
    const facilityChannelId =
        getFacilityChannelId(facilityChannel);

    const facilityName =
        facilityChannel?.facilityName || "N/A";

    const channelName =
        facilityChannel?.channelName || "N/A";

    const channelCode =
        facilityChannel?.channelCode || "N/A";

    const description =
        facilityChannel?.description || "No description available.";

    const statusConfig =
        getStatusConfig(facilityChannel?.status);

    const createdAt =
        facilityChannel?.createdAt ??
        facilityChannel?.createdDate;

    const updatedAt =
        facilityChannel?.updatedAt ??
        facilityChannel?.updatedDate;

    /* =====================================================
       VIEW HANDLER
    ===================================================== */

    const handleView = () => {
        if (typeof onView === "function") {
            onView(facilityChannel);
        }
    };

    /* =====================================================
       EDIT HANDLER
    ===================================================== */

    const handleEdit = () => {
        if (typeof onEdit === "function") {
            onEdit(facilityChannel);
        }
    };

    /* =====================================================
       DELETE HANDLER
    ===================================================== */

    const handleDelete = () => {
        if (typeof onDelete === "function") {
            onDelete(facilityChannel);
        }
    };

    /* =====================================================
       RENDER CARD
    ===================================================== */

    return (
        <Card
            elevation={2}
            sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                borderRadius: 3,
                border: "1px solid",
                borderColor: "divider",
                transition: "all 0.2s ease-in-out",

                "&:hover": {
                    elevation: 6,
                    transform: "translateY(-3px)",
                    boxShadow: 5
                }
            }}
        >
            {/* =============================================
               CARD HEADER
            ============================================= */}

            <Box
                sx={{
                    px: 2.5,
                    py: 2,
                    display: "flex",
                    alignItems: "flex-start",
                    justifyContent: "space-between",
                    gap: 2,
                    backgroundColor: "action.hover"
                }}
            >
                <Stack
                    direction="row"
                    spacing={1.5}
                    alignItems="center"
                    sx={{ minWidth: 0 }}
                >
                    <Box
                        sx={{
                            width: 44,
                            height: 44,
                            flexShrink: 0,
                            borderRadius: 2,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            backgroundColor: "primary.main",
                            color: "primary.contrastText"
                        }}
                    >
                        <Hub />
                    </Box>

                    <Box sx={{ minWidth: 0 }}>
                        <Typography
                            variant="subtitle1"
                            fontWeight={700}
                            noWrap
                            title={channelName}
                        >
                            {channelName}
                        </Typography>

                        <Typography
                            variant="caption"
                            color="text.secondary"
                            noWrap
                        >
                            Facility Channel
                        </Typography>
                    </Box>
                </Stack>

                <Chip
                    label={statusConfig.label}
                    color={statusConfig.color}
                    size="small"
                    variant="outlined"
                    sx={{
                        fontWeight: 600,
                        flexShrink: 0
                    }}
                />
            </Box>

            <Divider />

            {/* =============================================
               CARD CONTENT
            ============================================= */}

            <CardContent
                sx={{
                    p: 2.5,
                    flexGrow: 1
                }}
            >
                {/* Facility Name */}

                <Stack
                    direction="row"
                    spacing={1.5}
                    alignItems="flex-start"
                    sx={{ mb: 2 }}
                >
                    <Business
                        color="action"
                        fontSize="small"
                        sx={{ mt: 0.4 }}
                    />

                    <Box sx={{ minWidth: 0, flex: 1 }}>
                        <Typography
                            variant="caption"
                            color="text.secondary"
                        >
                            Facility Name
                        </Typography>

                        <Typography
                            variant="body2"
                            fontWeight={600}
                            sx={{
                                overflowWrap: "anywhere"
                            }}
                        >
                            {facilityName}
                        </Typography>
                    </Box>
                </Stack>

                {/* Channel Code */}

                <Stack
                    direction="row"
                    spacing={1.5}
                    alignItems="flex-start"
                    sx={{ mb: 2 }}
                >
                    <Tag
                        color="action"
                        fontSize="small"
                        sx={{ mt: 0.4 }}
                    />

                    <Box sx={{ minWidth: 0, flex: 1 }}>
                        <Typography
                            variant="caption"
                            color="text.secondary"
                        >
                            Channel Code
                        </Typography>

                        <Typography
                            variant="body2"
                            fontWeight={600}
                            sx={{
                                overflowWrap: "anywhere"
                            }}
                        >
                            {channelCode}
                        </Typography>
                    </Box>
                </Stack>

                {/* Description */}

                <Stack
                    direction="row"
                    spacing={1.5}
                    alignItems="flex-start"
                    sx={{ mb: 2 }}
                >
                    <Description
                        color="action"
                        fontSize="small"
                        sx={{ mt: 0.4 }}
                    />

                    <Box sx={{ minWidth: 0, flex: 1 }}>
                        <Typography
                            variant="caption"
                            color="text.secondary"
                        >
                            Description
                        </Typography>

                        <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{
                                overflowWrap: "anywhere",
                                display: "-webkit-box",
                                WebkitLineClamp: 3,
                                WebkitBoxOrient: "vertical",
                                overflow: "hidden"
                            }}
                        >
                            {description}
                        </Typography>
                    </Box>
                </Stack>

                <Divider sx={{ my: 2 }} />

                {/* Created Date */}

                <Stack
                    direction="row"
                    spacing={1}
                    alignItems="center"
                    sx={{ mb: 1 }}
                >
                    <CalendarToday
                        fontSize="small"
                        color="action"
                    />

                    <Typography
                        variant="caption"
                        color="text.secondary"
                    >
                        Created: {formatDate(createdAt)}
                    </Typography>
                </Stack>

                {/* Updated Date */}

                {updatedAt && (
                    <Stack
                        direction="row"
                        spacing={1}
                        alignItems="center"
                    >
                        <CalendarToday
                            fontSize="small"
                            color="action"
                        />

                        <Typography
                            variant="caption"
                            color="text.secondary"
                        >
                            Updated: {formatDate(updatedAt)}
                        </Typography>
                    </Stack>
                )}
            </CardContent>

            <Divider />

            {/* =============================================
               CARD ACTIONS
            ============================================= */}

            <CardActions
                sx={{
                    px: 2,
                    py: 1.5,
                    justifyContent: "space-between",
                    gap: 1,
                    flexWrap: "wrap"
                }}
            >
                <Button
                    size="small"
                    variant="outlined"
                    startIcon={<Visibility />}
                    onClick={handleView}
                    disabled={loading || !facilityChannelId}
                >
                    View
                </Button>

                <Box
                    sx={{
                        display: "flex",
                        gap: 0.5
                    }}
                >
                    <Tooltip title="Edit facility channel">
                        <span>
                            <Button
                                size="small"
                                color="primary"
                                variant="outlined"
                                onClick={handleEdit}
                                disabled={
                                    loading || !facilityChannelId
                                }
                                sx={{ minWidth: 40, px: 1 }}
                            >
                                <Edit fontSize="small" />
                            </Button>
                        </span>
                    </Tooltip>

                    <Tooltip title="Delete facility channel">
                        <span>
                            <Button
                                size="small"
                                color="error"
                                variant="outlined"
                                onClick={handleDelete}
                                disabled={
                                    loading || !facilityChannelId
                                }
                                sx={{ minWidth: 40, px: 1 }}
                            >
                                <Delete fontSize="small" />
                            </Button>
                        </span>
                    </Tooltip>
                </Box>
            </CardActions>
        </Card>
    );
};

export default FacilityChannelCard;

