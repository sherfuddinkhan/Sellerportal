// =========================================================
// GatepassCard.jsx
// =========================================================

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
    Grid,
    Tooltip
} from "@mui/material";

import {
    Visibility,
    Edit,
    Delete,
    LocalShipping,
    Person,
    CalendarMonth,
    ConfirmationNumber,
    Assignment
} from "@mui/icons-material";

// =========================================================
// HELPER: GET PROPERTY SUPPORTING CAMELCASE/PASCALCASE
// =========================================================

const getValue = (record, keys, fallback = "") => {
    for (const key of keys) {
        const value = record?.[key];

        if (value !== undefined && value !== null && value !== "") {
            return value;
        }
    }

    return fallback;
};

// =========================================================
// FORMAT DATE
// =========================================================

const formatDate = (value) => {
    if (!value) return "—";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return String(value);
    }

    return date.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric"
    });
};

// =========================================================
// STATUS COLOR
// =========================================================

const getStatusColor = (status) => {
    switch (String(status || "").toLowerCase()) {
        case "approved":
            return "success";

        case "completed":
            return "info";

        case "rejected":
        case "cancelled":
        case "canceled":
            return "error";

        case "pending":
            return "warning";

        default:
            return "default";
    }
};

// =========================================================
// GATEPASS CARD
// =========================================================

const GatepassCard = ({
    gatepass,
    onView,
    onEdit,
    onDelete,
    loading = false
}) => {
    if (!gatepass) return null;

    // -----------------------------------------------------
    // GATEPASS DETAILS
    // -----------------------------------------------------

    const gatepassId = getValue(gatepass, [
        "gatepassId",
        "GatepassId",
        "gatePassId",
        "GatePassId",
        "id",
        "Id"
    ]);

    const gatepassCode = getValue(gatepass, [
        "gatepassCode",
        "GatepassCode",
        "gatepassNumber",
        "GatepassNumber",
        "gatePassCode",
        "GatePassCode"
    ], gatepassId ? `GP-${gatepassId}` : "Gatepass");

    const gatepassDate = getValue(gatepass, [
        "gatepassDate",
        "GatepassDate",
        "gatePassDate",
        "GatePassDate",
        "date",
        "Date"
    ]);

    const vehicleNumber = getValue(gatepass, [
        "vehicleNumber",
        "VehicleNumber",
        "vehicleNo",
        "VehicleNo"
    ], "—");

    const driverName = getValue(gatepass, [
        "driverName",
        "DriverName"
    ], "—");

    const driverPhone = getValue(gatepass, [
        "driverPhone",
        "DriverPhone",
        "driverMobile",
        "DriverMobile"
    ], "—");

    const purpose = getValue(gatepass, [
        "purpose",
        "Purpose"
    ], "—");

    const remarks = getValue(gatepass, [
        "remarks",
        "Remarks"
    ], "");

    const status = getValue(gatepass, [
        "status",
        "Status",
        "gatepassStatus",
        "GatepassStatus"
    ], "Pending");

    // -----------------------------------------------------
    // CARD
    // -----------------------------------------------------

    return (
        <Card
            elevation={2}
            sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                borderRadius: 2,
                transition: "all 0.2s ease-in-out",
                "&:hover": {
                    boxShadow: 6,
                    transform: "translateY(-2px)"
                }
            }}
        >
            {/* CARD HEADER */}

            <Box
                sx={{
                    px: 2,
                    py: 1.5,
                    display: "flex",
                    alignItems: "flex-start",
                    justifyContent: "space-between",
                    gap: 1
                }}
            >
                <Box sx={{ minWidth: 0 }}>
                    <Typography
                        variant="h6"
                        fontWeight={700}
                        noWrap
                    >
                        {gatepassCode}
                    </Typography>

                    <Typography
                        variant="caption"
                        color="text.secondary"
                    >
                        ID: {gatepassId || "—"}
                    </Typography>
                </Box>

                <Chip
                    label={status}
                    color={getStatusColor(status)}
                    size="small"
                    variant="outlined"
                    sx={{
                        fontWeight: 600,
                        textTransform: "capitalize"
                    }}
                />
            </Box>

            <Divider />

            {/* CARD CONTENT */}

            <CardContent sx={{ flexGrow: 1 }}>
                <Grid container spacing={2}>
                    {/* DATE */}

                    <Grid item xs={12} sm={6}>
                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "flex-start",
                                gap: 1
                            }}
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
                                    Gatepass Date
                                </Typography>

                                <Typography variant="body2" fontWeight={600}>
                                    {formatDate(gatepassDate)}
                                </Typography>
                            </Box>
                        </Box>
                    </Grid>

                    {/* VEHICLE */}

                    <Grid item xs={12} sm={6}>
                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "flex-start",
                                gap: 1
                            }}
                        >
                            <LocalShipping
                                fontSize="small"
                                color="action"
                            />

                            <Box sx={{ minWidth: 0 }}>
                                <Typography
                                    variant="caption"
                                    color="text.secondary"
                                >
                                    Vehicle Number
                                </Typography>

                                <Typography
                                    variant="body2"
                                    fontWeight={600}
                                    sx={{ overflowWrap: "anywhere" }}
                                >
                                    {vehicleNumber}
                                </Typography>
                            </Box>
                        </Box>
                    </Grid>

                    {/* DRIVER */}

                    <Grid item xs={12} sm={6}>
                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "flex-start",
                                gap: 1
                            }}
                        >
                            <Person
                                fontSize="small"
                                color="action"
                            />

                            <Box sx={{ minWidth: 0 }}>
                                <Typography
                                    variant="caption"
                                    color="text.secondary"
                                >
                                    Driver Name
                                </Typography>

                                <Typography
                                    variant="body2"
                                    fontWeight={600}
                                >
                                    {driverName}
                                </Typography>

                                {driverPhone !== "—" && (
                                    <Typography
                                        variant="caption"
                                        color="text.secondary"
                                    >
                                        {driverPhone}
                                    </Typography>
                                )}
                            </Box>
                        </Box>
                    </Grid>

                    {/* PURPOSE */}

                    <Grid item xs={12} sm={6}>
                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "flex-start",
                                gap: 1
                            }}
                        >
                            <Assignment
                                fontSize="small"
                                color="action"
                            />

                            <Box sx={{ minWidth: 0 }}>
                                <Typography
                                    variant="caption"
                                    color="text.secondary"
                                >
                                    Purpose
                                </Typography>

                                <Typography
                                    variant="body2"
                                    sx={{
                                        overflowWrap: "anywhere"
                                    }}
                                >
                                    {purpose}
                                </Typography>
                            </Box>
                        </Box>
                    </Grid>

                    {/* REMARKS */}

                    {remarks && (
                        <Grid item xs={12}>
                            <Typography
                                variant="caption"
                                color="text.secondary"
                            >
                                Remarks
                            </Typography>

                            <Typography
                                variant="body2"
                                sx={{
                                    overflowWrap: "anywhere"
                                }}
                            >
                                {remarks}
                            </Typography>
                        </Grid>
                    )}
                </Grid>
            </CardContent>

            <Divider />

            {/* CARD ACTIONS */}

            <CardActions
                sx={{
                    px: 2,
                    py: 1.5,
                    display: "flex",
                    justifyContent: "space-between",
                    gap: 0.5,
                    flexWrap: "wrap"
                }}
            >
                <Tooltip title="View gatepass details">
                    <span>
                        <Button
                            size="small"
                            startIcon={<Visibility />}
                            onClick={() => onView?.(gatepass)}
                            disabled={loading}
                        >
                            View
                        </Button>
                    </span>
                </Tooltip>

                <Box sx={{ display: "flex", gap: 0.5 }}>
                    <Tooltip title="Edit gatepass">
                        <span>
                            <Button
                                size="small"
                                color="primary"
                                startIcon={<Edit />}
                                onClick={() => onEdit?.(gatepass)}
                                disabled={loading}
                            >
                                Edit
                            </Button>
                        </span>
                    </Tooltip>

                    <Tooltip title="Delete gatepass">
                        <span>
                            <Button
                                size="small"
                                color="error"
                                startIcon={<Delete />}
                                onClick={() => onDelete?.(gatepass)}
                                disabled={loading}
                            >
                                Delete
                            </Button>
                        </span>
                    </Tooltip>
                </Box>
            </CardActions>
        </Card>
    );
};

export default GatepassCard;

