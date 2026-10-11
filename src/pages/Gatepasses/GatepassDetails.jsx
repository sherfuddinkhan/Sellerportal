// =========================================================
// GatepassDetails.jsx
// =========================================================

import React, { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

import {
    Alert,
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    CircularProgress,
    Divider,
    Grid,
    Typography
} from "@mui/material";

import {
    ArrowBack,
    Edit,
    Refresh,
    ConfirmationNumber,
    LocalShipping,
    Person,
    CalendarMonth,
    Assignment,
    Phone,
    InfoOutlined
} from "@mui/icons-material";

// =========================================================
// API CONFIGURATION
// =========================================================

const API_URL = "http://localhost:5000/api/Gatepass";

// =========================================================
// GET LOCAL STORAGE VALUE
// =========================================================

const getStoredId = (...keys) => {
    for (const key of keys) {
        const value = localStorage.getItem(key);

        if (value && value !== "null" && value !== "undefined") {
            return value;
        }
    }

    return "";
};

// =========================================================
// READ RESPONSE PROPERTY
// =========================================================

const getValue = (record, keys, fallback = "—") => {
    for (const key of keys) {
        const value = record?.[key];

        if (
            value !== undefined &&
            value !== null &&
            value !== ""
        ) {
            return value;
        }
    }

    return fallback;
};

// =========================================================
// UNWRAP API RESPONSE
// =========================================================

const unwrapGatepass = (responseData) => {
    if (!responseData) return null;

    if (Array.isArray(responseData)) {
        return responseData[0] ?? null;
    }

    return (
        responseData.gatepass ??
        responseData.Gatepass ??
        responseData.gatePass ??
        responseData.GatePass ??
        responseData.data?.gatepass ??
        responseData.data?.Gatepass ??
        responseData.data ??
        responseData
    );
};

// =========================================================
// FORMAT DATE
// =========================================================

const formatDate = (value) => {
    if (!value || value === "—") return "—";

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
// DETAIL ITEM
// =========================================================

const DetailItem = ({
    icon,
    label,
    value,
    fullWidth = false
}) => (
    <Grid item xs={12} md={fullWidth ? 12 : 6}>
        <Box
            sx={{
                display: "flex",
                alignItems: "flex-start",
                gap: 1.5,
                py: 1
            }}
        >
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    minWidth: 38,
                    height: 38,
                    borderRadius: 2,
                    bgcolor: "action.hover",
                    color: "primary.main"
                }}
            >
                {icon}
            </Box>

            <Box sx={{ minWidth: 0, flex: 1 }}>
                <Typography
                    variant="caption"
                    color="text.secondary"
                    display="block"
                >
                    {label}
                </Typography>

                <Typography
                    variant="body1"
                    fontWeight={500}
                    sx={{
                        whiteSpace: "pre-wrap",
                        overflowWrap: "anywhere"
                    }}
                >
                    {value === undefined ||
                    value === null ||
                    value === ""
                        ? "—"
                        : String(value)}
                </Typography>
            </Box>
        </Box>
    </Grid>
);

// =========================================================
// GATEPASS DETAILS
// =========================================================

const GatepassDetails = ({
    gatepassId: gatepassIdProp,
    sellerId: sellerIdProp,
    customerId: customerIdProp
}) => {
    const navigate = useNavigate();
    const params = useParams();

    const gatepassId =
        gatepassIdProp ||
        params.id ||
        params.gatepassId;

    const sellerId =
        sellerIdProp ||
        getStoredId("sellerId", "SellerId");

    const customerId =
        customerIdProp ||
        getStoredId("customerId", "CustomerId");

    const [gatepass, setGatepass] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // -----------------------------------------------------
    // FETCH GATEPASS DETAILS
    // -----------------------------------------------------

    const fetchGatepass = useCallback(async () => {
        if (!gatepassId) {
            setError(
                "Gatepass ID is missing. Open this page using a valid gatepass record."
            );
            setGatepass(null);
            setLoading(false);
            return;
        }

        if (!sellerId || !customerId) {
            setError(
                "Seller ID or Customer ID is missing. Please select the seller and customer first."
            );
            setGatepass(null);
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            setError("");

            const endpoint =
                `${API_URL}/${encodeURIComponent(gatepassId)}` +
                `/seller/${encodeURIComponent(sellerId)}` +
                `/customer/${encodeURIComponent(customerId)}`;

            const response = await axios.get(endpoint);

            const result = unwrapGatepass(response.data);

            if (!result) {
                setGatepass(null);
                setError("No gatepass details were returned by the server.");
                return;
            }

            setGatepass(result);
        } catch (err) {
            console.error(
                "Error fetching gatepass details:",
                err.response?.data || err.message
            );

            const responseData = err.response?.data;

            setError(
                typeof responseData === "string"
                    ? responseData
                    : responseData?.message ||
                      responseData?.title ||
                      responseData?.detail ||
                      err.message ||
                      "Unable to load gatepass details."
            );

            setGatepass(null);
        } finally {
            setLoading(false);
        }
    }, [gatepassId, sellerId, customerId]);

    // -----------------------------------------------------
    // LOAD ON PAGE OPEN
    // -----------------------------------------------------

    useEffect(() => {
        fetchGatepass();
    }, [fetchGatepass]);

    // -----------------------------------------------------
    // NAVIGATION
    // -----------------------------------------------------

    const handleBack = () => {
        navigate("/gatepasses");
    };

    const handleEdit = () => {
        if (!gatepassId) return;

        navigate(`/gatepasses/${gatepassId}/edit`);
    };

    // -----------------------------------------------------
    // GET DISPLAY VALUES
    // -----------------------------------------------------

    const gatepassCode = getValue(gatepass, [
        "gatepassCode",
        "GatepassCode",
        "gatepassNumber",
        "GatepassNumber",
        "gatePassCode",
        "GatePassCode"
    ]);

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
    ]);

    const driverName = getValue(gatepass, [
        "driverName",
        "DriverName"
    ]);

    const driverPhone = getValue(gatepass, [
        "driverPhone",
        "DriverPhone",
        "driverMobile",
        "DriverMobile"
    ]);

    const purpose = getValue(gatepass, [
        "purpose",
        "Purpose"
    ]);

    const remarks = getValue(gatepass, [
        "remarks",
        "Remarks"
    ]);

    const status = getValue(gatepass, [
        "status",
        "Status",
        "gatepassStatus",
        "GatepassStatus"
    ], "Pending");

    const actualId = getValue(gatepass, [
        "gatepassId",
        "GatepassId",
        "gatePassId",
        "GatePassId",
        "id",
        "Id"
    ], gatepassId || "—");

    // -----------------------------------------------------
    // LOADING STATE
    // -----------------------------------------------------

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

    // -----------------------------------------------------
    // PAGE
    // -----------------------------------------------------

    return (
        <Box sx={{ p: { xs: 1, sm: 2, md: 3 } }}>
            {/* HEADER */}

            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: 2,
                    mb: 3
                }}
            >
                <Box>
                    <Typography variant="h4" fontWeight={700}>
                        Gatepass Details
                    </Typography>

                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mt: 0.5 }}
                    >
                        View complete gatepass information.
                    </Typography>
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
                        disabled={!gatepass}
                    >
                        Edit
                    </Button>
                </Box>
            </Box>

            {/* ERROR */}

            {error && (
                <Alert
                    severity="error"
                    sx={{ mb: 3 }}
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
                    {error}
                </Alert>
            )}

            {/* DETAILS */}

            {gatepass && (
                <>
                    {/* OVERVIEW */}

                    <Card
                        elevation={2}
                        sx={{
                            mb: 3,
                            borderRadius: 2
                        }}
                    >
                        <Box
                            sx={{
                                p: 3,
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                flexWrap: "wrap",
                                gap: 2
                            }}
                        >
                            <Box
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 2
                                }}
                            >
                                <Box
                                    sx={{
                                        width: 54,
                                        height: 54,
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        borderRadius: 2,
                                        bgcolor: "action.hover",
                                        color: "primary.main"
                                    }}
                                >
                                    <ConfirmationNumber fontSize="large" />
                                </Box>

                                <Box>
                                    <Typography
                                        variant="h5"
                                        fontWeight={700}
                                    >
                                        {gatepassCode}
                                    </Typography>

                                    <Typography
                                        variant="body2"
                                        color="text.secondary"
                                    >
                                        Gatepass ID: {actualId}
                                    </Typography>
                                </Box>
                            </Box>

                            <Chip
                                label={String(status)}
                                color={getStatusColor(status)}
                                variant="outlined"
                                sx={{
                                    fontWeight: 700,
                                    textTransform: "capitalize"
                                }}
                            />
                        </Box>
                    </Card>

                    {/* GENERAL INFORMATION */}

                    <Card
                        elevation={2}
                        sx={{
                            mb: 3,
                            borderRadius: 2
                        }}
                    >
                        <CardContent sx={{ p: { xs: 2, md: 3 } }}>
                            <Typography
                                variant="h6"
                                fontWeight={700}
                                sx={{ mb: 2 }}
                            >
                                General Information
                            </Typography>

                            <Divider sx={{ mb: 2 }} />

                            <Grid container spacing={2}>
                                <DetailItem
                                    icon={<ConfirmationNumber />}
                                    label="Gatepass Code"
                                    value={gatepassCode}
                                />

                                <DetailItem
                                    icon={<CalendarMonth />}
                                    label="Gatepass Date"
                                    value={formatDate(gatepassDate)}
                                />

                                <DetailItem
                                    icon={<InfoOutlined />}
                                    label="Status"
                                    value={status}
                                />

                                <DetailItem
                                    icon={<InfoOutlined />}
                                    label="Gatepass ID"
                                    value={actualId}
                                />
                            </Grid>
                        </CardContent>
                    </Card>

                    {/* VEHICLE AND DRIVER */}

                    <Card
                        elevation={2}
                        sx={{
                            mb: 3,
                            borderRadius: 2
                        }}
                    >
                        <CardContent sx={{ p: { xs: 2, md: 3 } }}>
                            <Typography
                                variant="h6"
                                fontWeight={700}
                                sx={{ mb: 2 }}
                            >
                                Vehicle and Driver Information
                            </Typography>

                            <Divider sx={{ mb: 2 }} />

                            <Grid container spacing={2}>
                                <DetailItem
                                    icon={<LocalShipping />}
                                    label="Vehicle Number"
                                    value={vehicleNumber}
                                />

                                <DetailItem
                                    icon={<Person />}
                                    label="Driver Name"
                                    value={driverName}
                                />

                                <DetailItem
                                    icon={<Phone />}
                                    label="Driver Phone"
                                    value={driverPhone}
                                />
                            </Grid>
                        </CardContent>
                    </Card>

                    {/* PURPOSE AND REMARKS */}

                    <Card
                        elevation={2}
                        sx={{
                            mb: 3,
                            borderRadius: 2
                        }}
                    >
                        <CardContent sx={{ p: { xs: 2, md: 3 } }}>
                            <Typography
                                variant="h6"
                                fontWeight={700}
                                sx={{ mb: 2 }}
                            >
                                Purpose and Remarks
                            </Typography>

                            <Divider sx={{ mb: 2 }} />

                            <Grid container spacing={2}>
                                <DetailItem
                                    icon={<Assignment />}
                                    label="Purpose"
                                    value={purpose}
                                    fullWidth
                                />

                                <DetailItem
                                    icon={<InfoOutlined />}
                                    label="Remarks"
                                    value={remarks}
                                    fullWidth
                                />
                            </Grid>
                        </CardContent>
                    </Card>

                    {/* FOOTER ACTIONS */}

                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "flex-end",
                            gap: 1
                        }}
                    >
                        <Button
                            variant="outlined"
                            startIcon={<ArrowBack />}
                            onClick={handleBack}
                        >
                            Back to Gatepasses
                        </Button>

                        <Button
                            variant="contained"
                            startIcon={<Edit />}
                            onClick={handleEdit}
                        >
                            Edit Gatepass
                        </Button>
                    </Box>
                </>
            )}
        </Box>
    );
};

export default GatepassDetails;

