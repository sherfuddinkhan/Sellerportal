// =========================================================
// GatepassView.jsx
// =========================================================

import React, { useEffect, useState } from "react";

import axios from "axios";

import {
    Box,
    Paper,
    Typography,
    Grid,
    Button,
    Chip,
    Divider,
    CircularProgress,
    Alert
} from "@mui/material";

import {
    ArrowBack,
    Edit,
    Refresh,
    LocalShipping
} from "@mui/icons-material";

import {
    useNavigate,
    useParams
} from "react-router-dom";

// =========================================================
// API CONFIGURATION
// =========================================================

const API_URL = "http://localhost:5000/api/Gatepass";

// =========================================================
// GET FIELD VALUE
// Supports camelCase and PascalCase.
// =========================================================

const getField = (record, ...keys) => {
    for (const key of keys) {
        if (
            record?.[key] !== undefined &&
            record?.[key] !== null
        ) {
            return record[key];
        }
    }

    return "";
};

// =========================================================
// FORMAT DATE
// =========================================================

const formatDate = (value) => {
    if (!value) {
        return "—";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return String(value);
    }

    return date.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "long",
        year: "numeric"
    });
};

// =========================================================
// FORMAT DATE AND TIME
// =========================================================

const formatDateTime = (value) => {
    if (!value) {
        return "—";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return String(value);
    }

    return date.toLocaleString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
    });
};

// =========================================================
// STATUS CHIP
// =========================================================

const GatepassStatus = ({ status }) => {
    const normalizedStatus = String(status || "")
        .trim()
        .toLowerCase();

    let color = "default";

    switch (normalizedStatus) {
        case "pending":
            color = "warning";
            break;

        case "approved":
        case "authorized":
        case "authorised":
            color = "info";
            break;

        case "completed":
        case "closed":
            color = "success";
            break;

        case "rejected":
        case "cancelled":
        case "canceled":
            color = "error";
            break;

        default:
            color = "default";
    }

    return (
        <Chip
            label={status || "Unknown"}
            color={color}
            variant="outlined"
            size="medium"
        />
    );
};

// =========================================================
// DETAIL FIELD
// =========================================================

const DetailField = ({ label, value }) => {
    const displayValue =
        value !== undefined &&
        value !== null &&
        String(value).trim() !== ""
            ? String(value)
            : "—";

    return (
        <Box sx={{ minWidth: 0 }}>
            <Typography
                variant="caption"
                color="text.secondary"
                sx={{
                    display: "block",
                    mb: 0.5,
                    textTransform: "uppercase",
                    letterSpacing: 0.5
                }}
            >
                {label}
            </Typography>

            <Typography
                variant="body1"
                fontWeight={500}
                sx={{
                    overflowWrap: "anywhere",
                    whiteSpace: "pre-wrap"
                }}
            >
                {displayValue}
            </Typography>
        </Box>
    );
};

// =========================================================
// GATEPASS VIEW
// =========================================================

const GatepassView = ({
    gatepassId: gatepassIdProp,
    sellerId: sellerIdProp,
    customerId: customerIdProp
}) => {

    const navigate = useNavigate();

    const params = useParams();

    const gatepassId =
        gatepassIdProp ??
        params.id ??
        params.gatepassId;

    const sellerId =
        sellerIdProp ??
        localStorage.getItem("sellerId") ??
        localStorage.getItem("SellerId");

    const customerId =
        customerIdProp ??
        localStorage.getItem("customerId") ??
        localStorage.getItem("CustomerId");

    // =====================================================
    // STATE
    // =====================================================

    const [gatepass, setGatepass] = useState(null);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

    // =====================================================
    // FETCH GATEPASS DETAILS
    // =====================================================

    const fetchGatepass = async () => {
        if (
            gatepassId === undefined ||
            gatepassId === null ||
            String(gatepassId).trim() === ""
        ) {
            setError(
                "Gatepass ID is missing. Open this page using a valid gatepass record ID."
            );

            setGatepass(null);
            setLoading(false);

            return;
        }

        if (
            sellerId === undefined ||
            sellerId === null ||
            String(sellerId).trim() === "" ||
            customerId === undefined ||
            customerId === null ||
            String(customerId).trim() === ""
        ) {
            setError(
                "Seller ID or Customer ID is missing. Please verify your stored IDs or pass them as component props."
            );

            setGatepass(null);
            setLoading(false);

            return;
        }

        try {
            setLoading(true);
            setError("");

            const response = await axios.get(
                `${API_URL}/${encodeURIComponent(gatepassId)}` +
                `/seller/${encodeURIComponent(sellerId)}` +
                `/customer/${encodeURIComponent(customerId)}`
            );

            const result = response.data;

            // Handle either a direct record or a wrapped response.
            const record =
                result?.data ??
                result?.gatepass ??
                result?.Gatepass ??
                result;

            if (
                !record ||
                typeof record !== "object" ||
                Array.isArray(record)
            ) {
                throw new Error(
                    "The API did not return a valid gatepass record."
                );
            }

            setGatepass(record);
        } catch (err) {
            console.error(
                "Error fetching gatepass details:",
                err
            );

            setGatepass(null);

            setError(
                err.response?.data?.message ||
                err.response?.data?.title ||
                err.message ||
                "Failed to load gatepass details."
            );
        } finally {
            setLoading(false);
        }
    };

    // =====================================================
    // LOAD ON MOUNT / ID CHANGE
    // =====================================================

    useEffect(() => {
        fetchGatepass();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [gatepassId, sellerId, customerId]);

    // =====================================================
    // NAVIGATION
    // =====================================================

    const handleBack = () => {
        navigate("/gatepasses");
    };

    const handleEdit = () => {
        navigate(`/gatepasses/${encodeURIComponent(gatepassId)}/edit`);
    };

    // =====================================================
    // LOADING STATE
    // =====================================================

    if (loading) {
        return (
            <Box
                sx={{
                    minHeight: 300,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 2
                }}
            >
                <CircularProgress />

                <Typography color="text.secondary">
                    Loading gatepass details...
                </Typography>
            </Box>
        );
    }

    // =====================================================
    // ERROR STATE
    // =====================================================

    if (error || !gatepass) {
        return (
            <Box sx={{ p: { xs: 2, md: 3 } }}>
                <Alert
                    severity="error"
                    sx={{ mb: 2 }}
                    action={
                        <Button
                            color="inherit"
                            size="small"
                            onClick={fetchGatepass}
                        >
                            Retry
                        </Button>
                    }
                >
                    {error || "Gatepass record was not found."}
                </Alert>

                <Button
                    startIcon={<ArrowBack />}
                    onClick={handleBack}
                >
                    Back to Gatepasses
                </Button>
            </Box>
        );
    }

    // =====================================================
    // MAP RECORD FIELDS
    // =====================================================

    const code = getField(
        gatepass,
        "gatepassCode",
        "GatepassCode",
        "gatepassNumber",
        "GatepassNumber",
        "gatePassCode",
        "GatePassCode"
    );

    const status = getField(
        gatepass,
        "status",
        "Status",
        "gatepassStatus",
        "GatepassStatus"
    );

    const gatepassDate = getField(
        gatepass,
        "gatepassDate",
        "GatepassDate",
        "gatePassDate",
        "GatePassDate",
        "date",
        "Date"
    );

    const vehicleNumber = getField(
        gatepass,
        "vehicleNumber",
        "VehicleNumber",
        "vehicleNo",
        "VehicleNo"
    );

    const driverName = getField(
        gatepass,
        "driverName",
        "DriverName"
    );

    const driverPhone = getField(
        gatepass,
        "driverPhone",
        "DriverPhone",
        "driverMobile",
        "DriverMobile"
    );

    const purpose = getField(
        gatepass,
        "purpose",
        "Purpose"
    );

    const remarks = getField(
        gatepass,
        "remarks",
        "Remarks"
    );

    const createdAt = getField(
        gatepass,
        "createdAt",
        "CreatedAt",
        "createdDate",
        "CreatedDate"
    );

    const updatedAt = getField(
        gatepass,
        "updatedAt",
        "UpdatedAt",
        "modifiedAt",
        "ModifiedAt"
    );

    // =====================================================
    // RENDER DETAILS
    // =====================================================

    return (
        <Box sx={{ p: { xs: 2, md: 3 } }}>

            {/* =================================================
                PAGE HEADER
            ================================================= */}

            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: {
                        xs: "flex-start",
                        sm: "center"
                    },
                    flexDirection: {
                        xs: "column",
                        sm: "row"
                    },
                    gap: 2,
                    mb: 3
                }}
            >
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1.5
                    }}
                >
                    <LocalShipping
                        color="primary"
                        sx={{ fontSize: 36 }}
                    />

                    <Box>
                        <Typography
                            variant="h5"
                            component="h1"
                            fontWeight={700}
                        >
                            Gatepass Details
                        </Typography>

                        <Typography
                            variant="body2"
                            color="text.secondary"
                        >
                            {code || `Gatepass ID: ${gatepassId}`}
                        </Typography>
                    </Box>
                </Box>

                <Box
                    sx={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: 1
                    }}
                >
                    <Button
                        variant="outlined"
                        startIcon={<ArrowBack />}
                        onClick={handleBack}
                    >
                        Back
                    </Button>

                    <Button
                        variant="outlined"
                        startIcon={<Refresh />}
                        onClick={fetchGatepass}
                    >
                        Refresh
                    </Button>

                    <Button
                        variant="contained"
                        startIcon={<Edit />}
                        onClick={handleEdit}
                    >
                        Edit Gatepass
                    </Button>
                </Box>
            </Box>

            {/* =================================================
                MAIN DETAILS CARD
            ================================================= */}

            <Paper
                elevation={2}
                sx={{
                    p: { xs: 2, md: 3 },
                    borderRadius: 3
                }}
            >
                {/* OVERVIEW */}

                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        flexWrap: "wrap",
                        gap: 2,
                        mb: 3
                    }}
                >
                    <Typography
                        variant="h6"
                        fontWeight={700}
                    >
                        Gatepass Overview
                    </Typography>

                    <GatepassStatus status={status} />
                </Box>

                <Divider sx={{ mb: 3 }} />

                <Grid container spacing={3}>
                    <Grid item xs={12} sm={6} md={4}>
                        <DetailField
                            label="Gatepass ID"
                            value={getField(
                                gatepass,
                                "gatepassId",
                                "GatepassId",
                                "gatePassId",
                                "GatePassId",
                                "id",
                                "Id"
                            )}
                        />
                    </Grid>

                    <Grid item xs={12} sm={6} md={4}>
                        <DetailField
                            label="Gatepass Code"
                            value={code}
                        />
                    </Grid>

                    <Grid item xs={12} sm={6} md={4}>
                        <DetailField
                            label="Gatepass Date"
                            value={formatDate(gatepassDate)}
                        />
                    </Grid>

                    <Grid item xs={12} sm={6} md={4}>
                        <DetailField
                            label="Vehicle Number"
                            value={vehicleNumber}
                        />
                    </Grid>

                    <Grid item xs={12} sm={6} md={4}>
                        <DetailField
                            label="Driver Name"
                            value={driverName}
                        />
                    </Grid>

                    <Grid item xs={12} sm={6} md={4}>
                        <DetailField
                            label="Driver Phone"
                            value={driverPhone}
                        />
                    </Grid>

                    <Grid item xs={12} sm={6} md={6}>
                        <DetailField
                            label="Purpose"
                            value={purpose}
                        />
                    </Grid>

                    <Grid item xs={12} sm={6} md={6}>
                        <DetailField
                            label="Remarks"
                            value={remarks}
                        />
                    </Grid>
                </Grid>

                {/* AUDIT DETAILS */}

                {(createdAt || updatedAt) && (
                    <>
                        <Divider sx={{ my: 3 }} />

                        <Typography
                            variant="h6"
                            fontWeight={700}
                            sx={{ mb: 2 }}
                        >
                            Record Information
                        </Typography>

                        <Grid container spacing={3}>
                            {createdAt && (
                                <Grid item xs={12} sm={6}>
                                    <DetailField
                                        label="Created At"
                                        value={formatDateTime(createdAt)}
                                    />
                                </Grid>
                            )}

                            {updatedAt && (
                                <Grid item xs={12} sm={6}>
                                    <DetailField
                                        label="Updated At"
                                        value={formatDateTime(updatedAt)}
                                    />
                                </Grid>
                            )}
                        </Grid>
                    </>
                )}
            </Paper>
        </Box>
    );
};

export default GatepassView;

