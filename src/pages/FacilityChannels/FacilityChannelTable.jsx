import React from "react";

import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    IconButton,
    Tooltip,
    Typography,
    Box,
    Chip,
    CircularProgress,
    Stack
} from "@mui/material";

import {
    Visibility,
    Edit,
    Delete,
    Apartment
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
   GET STATUS COLOR
========================================================= */

const getStatusColor = (value) => {
    if (value === true) {
        return "success";
    }

    if (value === false) {
        return "default";
    }

    const status = String(value ?? "")
        .trim()
        .toLowerCase();

    switch (status) {
        case "active":
        case "enabled":
        case "available":
        case "true":
            return "success";

        case "inactive":
        case "disabled":
        case "unavailable":
        case "false":
            return "default";

        case "pending":
            return "warning";

        case "failed":
        case "error":
            return "error";

        default:
            return "info";
    }
};

/* =========================================================
   FORMAT VALUE
========================================================= */

const formatValue = (value) => {
    if (value === null || value === undefined || value === "") {
        return "N/A";
    }

    if (typeof value === "boolean") {
        return value ? "Yes" : "No";
    }

    return String(value);
};

/* =========================================================
   FACILITY CHANNEL TABLE
========================================================= */

const FacilityChannelTable = ({
    facilityChannels = [],
    loading = false,
    error = "",

    onView,
    onEdit,
    onDelete,

    showActions = true,
    emptyMessage = "No facility channels found."
}) => {

    /* =====================================================
       NORMALIZE DATA
    ===================================================== */

    const rows = Array.isArray(facilityChannels)
        ? facilityChannels
        : [];

    /* =====================================================
       RENDER
    ===================================================== */

    return (
        <TableContainer
            component={Paper}
            elevation={0}
            sx={{
                width: "100%",
                overflowX: "auto",
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 2
            }}
        >
            <Table
                sx={{ minWidth: 850 }}
                aria-label="Facility channels table"
            >
                {/* TABLE HEADER */}

                <TableHead>
                    <TableRow
                        sx={{
                            bgcolor: "action.hover",
                            "& th": {
                                fontWeight: 700,
                                whiteSpace: "nowrap",
                                color: "text.secondary"
                            }
                        }}
                    >
                        <TableCell>Facility Channel ID</TableCell>
                        <TableCell>Facility Name</TableCell>
                        <TableCell>Channel Name</TableCell>
                        <TableCell>Channel Code</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Created At</TableCell>

                        {showActions && (
                            <TableCell align="right">
                                Actions
                            </TableCell>
                        )}
                    </TableRow>
                </TableHead>

                {/* TABLE BODY */}

                <TableBody>
                    {/* LOADING STATE */}

                    {loading && (
                        <TableRow>
                            <TableCell
                                colSpan={showActions ? 7 : 6}
                                align="center"
                                sx={{ py: 6 }}
                            >
                                <Stack
                                    spacing={1.5}
                                    alignItems="center"
                                >
                                    <CircularProgress size={30} />

                                    <Typography
                                        variant="body2"
                                        color="text.secondary"
                                    >
                                        Loading facility channels...
                                    </Typography>
                                </Stack>
                            </TableCell>
                        </TableRow>
                    )}

                    {/* ERROR STATE */}

                    {!loading && error && (
                        <TableRow>
                            <TableCell
                                colSpan={showActions ? 7 : 6}
                                align="center"
                                sx={{ py: 4 }}
                            >
                                <Typography
                                    color="error"
                                    variant="body2"
                                >
                                    {error}
                                </Typography>
                            </TableCell>
                        </TableRow>
                    )}

                    {/* EMPTY STATE */}

                    {!loading &&
                        !error &&
                        rows.length === 0 && (
                            <TableRow>
                                <TableCell
                                    colSpan={showActions ? 7 : 6}
                                    align="center"
                                    sx={{ py: 6 }}
                                >
                                    <Box
                                        display="flex"
                                        flexDirection="column"
                                        alignItems="center"
                                        gap={1}
                                    >
                                        <Apartment
                                            sx={{
                                                fontSize: 42,
                                                color: "text.disabled"
                                            }}
                                        />

                                        <Typography
                                            variant="body1"
                                            fontWeight={600}
                                        >
                                            {emptyMessage}
                                        </Typography>

                                        <Typography
                                            variant="body2"
                                            color="text.secondary"
                                        >
                                            Add a facility channel or
                                            change your search filters.
                                        </Typography>
                                    </Box>
                                </TableCell>
                            </TableRow>
                        )}

                    {/* DATA ROWS */}

                    {!loading &&
                        !error &&
                        rows.map((item, index) => {
                            const id =
                                item.id ??
                                item.facilityChannelId ??
                                item.channelId;

                            const facilityName =
                                item.facilityName ??
                                item.facility?.name ??
                                item.name;

                            const channelName =
                                item.channelName ??
                                item.channel?.name ??
                                item.channel;

                            const channelCode =
                                item.channelCode ??
                                item.code;

                            const status =
                                item.status ??
                                item.channelStatus ??
                                item.isActive ??
                                item.active;

                            const createdAt =
                                item.createdAt ??
                                item.createdDate ??
                                item.createdOn;

                            return (
                                <TableRow
                                    key={id ?? index}
                                    hover
                                    sx={{
                                        "&:last-child td": {
                                            borderBottom: 0
                                        }
                                    }}
                                >
                                    {/* ID */}

                                    <TableCell>
                                        <Typography
                                            variant="body2"
                                            fontWeight={600}
                                        >
                                            {formatValue(id)}
                                        </Typography>
                                    </TableCell>

                                    {/* FACILITY NAME */}

                                    <TableCell>
                                        <Typography
                                            variant="body2"
                                            fontWeight={500}
                                        >
                                            {formatValue(facilityName)}
                                        </Typography>
                                    </TableCell>

                                    {/* CHANNEL NAME */}

                                    <TableCell>
                                        {formatValue(channelName)}
                                    </TableCell>

                                    {/* CHANNEL CODE */}

                                    <TableCell>
                                        <Chip
                                            size="small"
                                            variant="outlined"
                                            label={formatValue(channelCode)}
                                        />
                                    </TableCell>

                                    {/* STATUS */}

                                    <TableCell>
                                        <Chip
                                            size="small"
                                            color={getStatusColor(status)}
                                            label={formatValue(status)}
                                            variant="outlined"
                                        />
                                    </TableCell>

                                    {/* CREATED DATE */}

                                    <TableCell>
                                        {formatDate(createdAt)}
                                    </TableCell>

                                    {/* ACTIONS */}

                                    {showActions && (
                                        <TableCell align="right">
                                            <Stack
                                                direction="row"
                                                spacing={0.5}
                                                justifyContent="flex-end"
                                            >
                                                <Tooltip title="View">
                                                    <IconButton
                                                        size="small"
                                                        color="info"
                                                        aria-label="View facility channel"
                                                        onClick={() =>
                                                            onView?.(item)
                                                        }
                                                    >
                                                        <Visibility fontSize="small" />
                                                    </IconButton>
                                                </Tooltip>

                                                <Tooltip title="Edit">
                                                    <IconButton
                                                        size="small"
                                                        color="primary"
                                                        aria-label="Edit facility channel"
                                                        onClick={() =>
                                                            onEdit?.(item)
                                                        }
                                                    >
                                                        <Edit fontSize="small" />
                                                    </IconButton>
                                                </Tooltip>

                                                <Tooltip title="Delete">
                                                    <IconButton
                                                        size="small"
                                                        color="error"
                                                        aria-label="Delete facility channel"
                                                        onClick={() =>
                                                            onDelete?.(item)
                                                        }
                                                    >
                                                        <Delete fontSize="small" />
                                                    </IconButton>
                                                </Tooltip>
                                            </Stack>
                                        </TableCell>
                                    )}
                                </TableRow>
                            );
                        })}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default FacilityChannelTable;

