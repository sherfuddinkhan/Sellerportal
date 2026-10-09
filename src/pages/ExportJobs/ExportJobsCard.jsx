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
    Visibility,
    Edit,
    Delete,
    FileDownload,
    CalendarMonth,
    AccessTime
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

    return date.toLocaleString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
    });
};

/* =========================================================
   STATUS CONFIGURATION
========================================================= */

const getStatusColor = (status) => {
    const normalizedStatus = String(status || "")
        .trim()
        .toLowerCase();

    switch (normalizedStatus) {
        case "completed":
        case "success":
            return "success";

        case "pending":
        case "queued":
            return "warning";

        case "processing":
        case "in progress":
        case "running":
            return "info";

        case "failed":
        case "error":
            return "error";

        case "cancelled":
        case "canceled":
            return "default";

        default:
            return "default";
    }
};

/* =========================================================
   EXPORT JOB CARD
========================================================= */

const ExportJobsCard = ({
    exportJob = {},
    onView,
    onEdit,
    onDelete,
    loading = false,
    showActions = true
}) => {

    /* =====================================================
       SUPPORT COMMON PROPERTY NAMES
    ===================================================== */

    const jobId =
        exportJob.id ??
        exportJob.exportJobId ??
        exportJob.exportId ??
        "N/A";

    const jobName =
        exportJob.jobName ??
        exportJob.name ??
        exportJob.title ??
        "Untitled Export Job";

    const exportType =
        exportJob.exportType ??
        exportJob.type ??
        "N/A";

    const format =
        exportJob.format ??
        exportJob.exportFormat ??
        "N/A";

    const status =
        exportJob.status ??
        exportJob.jobStatus ??
        "Unknown";

    const createdAt =
        exportJob.createdAt ??
        exportJob.createdDate ??
        exportJob.createdOn;

    const updatedAt =
        exportJob.updatedAt ??
        exportJob.updatedDate ??
        exportJob.updatedOn;

    const description =
        exportJob.description ??
        exportJob.remarks ??
        "";

    /* =====================================================
       RENDER
    ===================================================== */

    return (
        <Card
            elevation={2}
            sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                borderRadius: 2,
                border: "1px solid",
                borderColor: "divider",
                transition: "all 0.2s ease-in-out",

                "&:hover": {
                    boxShadow: 5,
                    transform: "translateY(-3px)"
                }
            }}
        >
            {/* CARD HEADER */}

            <Box
                sx={{
                    p: 2,
                    display: "flex",
                    alignItems: "flex-start",
                    justifyContent: "space-between",
                    gap: 1
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
                            bgcolor: "primary.light",
                            color: "primary.contrastText"
                        }}
                    >
                        <FileDownload />
                    </Box>

                    <Box sx={{ minWidth: 0 }}>
                        <Typography
                            variant="subtitle1"
                            fontWeight={700}
                            noWrap
                            title={jobName}
                        >
                            {jobName}
                        </Typography>

                        <Typography
                            variant="caption"
                            color="text.secondary"
                        >
                            Job ID: {jobId}
                        </Typography>
                    </Box>
                </Stack>

                <Chip
                    label={status}
                    color={getStatusColor(status)}
                    size="small"
                    variant="outlined"
                    sx={{ flexShrink: 0 }}
                />
            </Box>

            <Divider />

            {/* CARD CONTENT */}

            <CardContent sx={{ flexGrow: 1 }}>
                <Stack spacing={2}>

                    {/* EXPORT TYPE */}

                    <Box>
                        <Typography
                            variant="caption"
                            color="text.secondary"
                        >
                            Export Type
                        </Typography>

                        <Typography
                            variant="body2"
                            fontWeight={600}
                        >
                            {exportType}
                        </Typography>
                    </Box>

                    {/* EXPORT FORMAT */}

                    <Box>
                        <Typography
                            variant="caption"
                            color="text.secondary"
                        >
                            Export Format
                        </Typography>

                        <Box sx={{ mt: 0.5 }}>
                            <Chip
                                label={format}
                                size="small"
                                color="primary"
                                variant="outlined"
                            />
                        </Box>
                    </Box>

                    {/* DESCRIPTION */}

                    {description && (
                        <Box>
                            <Typography
                                variant="caption"
                                color="text.secondary"
                            >
                                Description
                            </Typography>

                            <Typography
                                variant="body2"
                                sx={{
                                    mt: 0.5,
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
                    )}

                    <Divider />

                    {/* CREATED DATE */}

                    <Stack
                        direction="row"
                        spacing={1}
                        alignItems="flex-start"
                    >
                        <CalendarMonth
                            fontSize="small"
                            color="action"
                        />

                        <Box>
                            <Typography
                                variant="caption"
                                color="text.secondary"
                            >
                                Created At
                            </Typography>

                            <Typography variant="body2">
                                {formatDate(createdAt)}
                            </Typography>
                        </Box>
                    </Stack>

                    {/* UPDATED DATE */}

                    {updatedAt && (
                        <Stack
                            direction="row"
                            spacing={1}
                            alignItems="flex-start"
                        >
                            <AccessTime
                                fontSize="small"
                                color="action"
                            />

                            <Box>
                                <Typography
                                    variant="caption"
                                    color="text.secondary"
                                >
                                    Last Updated
                                </Typography>

                                <Typography variant="body2">
                                    {formatDate(updatedAt)}
                                </Typography>
                            </Box>
                        </Stack>
                    )}

                </Stack>
            </CardContent>

            {/* CARD ACTIONS */}

            {showActions && (
                <>
                    <Divider />

                    <CardActions
                        sx={{
                            p: 1.5,
                            justifyContent: "flex-end",
                            gap: 0.5,
                            flexWrap: "wrap"
                        }}
                    >
                        <Tooltip title="View export job">
                            <span>
                                <Button
                                    size="small"
                                    startIcon={<Visibility />}
                                    onClick={() =>
                                        onView?.(exportJob)
                                    }
                                    disabled={loading}
                                >
                                    View
                                </Button>
                            </span>
                        </Tooltip>

                        <Tooltip title="Edit export job">
                            <span>
                                <Button
                                    size="small"
                                    color="primary"
                                    startIcon={<Edit />}
                                    onClick={() =>
                                        onEdit?.(exportJob)
                                    }
                                    disabled={loading}
                                >
                                    Edit
                                </Button>
                            </span>
                        </Tooltip>

                        <Tooltip title="Delete export job">
                            <span>
                                <Button
                                    size="small"
                                    color="error"
                                    startIcon={<Delete />}
                                    onClick={() =>
                                        onDelete?.(exportJob)
                                    }
                                    disabled={loading}
                                >
                                    Delete
                                </Button>
                            </span>
                        </Tooltip>
                    </CardActions>
                </>
            )}
        </Card>
    );
};

export default ExportJobsCard;

