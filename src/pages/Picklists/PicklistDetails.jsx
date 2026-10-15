
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
    IconButton,
    Paper,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Tooltip,
    Typography
} from "@mui/material";

import {
    ArrowBack,
    Refresh,
    Edit,
    Inventory2,
    CalendarMonth,
    Numbers,
    LocalShipping,
    Person,
    Business,
    CheckCircle,
    PendingActions
} from "@mui/icons-material";

/* =========================================================
   NODE.JS PROXY API
========================================================= */

const PICKLIST_API = "http://localhost:5000/api/Picklist";

/* =========================================================
   GET FIELD SUPPORTING CAMELCASE AND PASCALCASE
========================================================= */

const getValue = (object, fields, fallback = "") => {
    if (!object || typeof object !== "object") {
        return fallback;
    }

    for (const field of fields) {
        const value = object[field];

        if (value !== undefined && value !== null && value !== "") {
            return value;
        }
    }

    return fallback;
};

/* =========================================================
   EXTRACT PICKLIST FROM RESPONSE
========================================================= */

const extractPicklist = (data) => {
    let current = data;

    for (let i = 0; i < 5; i += 1) {
        if (
            !current ||
            typeof current !== "object" ||
            Array.isArray(current)
        ) {
            return null;
        }

        const nested = getValue(
            current,
            ["data", "result", "item", "picklist", "Picklist"],
            null
        );

        if (!nested || nested === current) {
            return current;
        }

        current = nested;
    }

    return current && typeof current === "object" && !Array.isArray(current)
        ? current
        : null;
};

/* =========================================================
   FORMAT DATE
========================================================= */

const formatDate = (value) => {
    if (!value) return "—";

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

/* =========================================================
   SHIPPING PACKAGE CODE PARSER
========================================================= */

const getPackageCodes = (value) => {
    if (!value) return [];

    if (Array.isArray(value)) {
        return value.map(String).filter(Boolean);
    }

    const raw = String(value).trim();

    if (!raw) return [];

    try {
        const parsed = JSON.parse(raw);

        if (Array.isArray(parsed)) {
            return parsed.map(String).filter(Boolean);
        }

        if (typeof parsed === "string" && parsed.trim()) {
            return [parsed.trim()];
        }
    } catch {
        // Existing database values may contain a plain package code.
    }

    return raw
        .split(/[\n,]+/)
        .map((code) => code.trim())
        .filter(Boolean);
};

/* =========================================================
   STATUS CHIP
========================================================= */

const StatusChip = ({ value }) => {
    const normalized = String(value || "Created")
        .trim()
        .toLowerCase();

    if (
        ["completed", "complete", "closed", "picked"].includes(normalized)
    ) {
        return (
            <Chip
                icon={<CheckCircle />}
                label="Completed"
                color="success"
                variant="outlined"
            />
        );
    }

    if (
        ["cancelled", "canceled"].includes(normalized)
    ) {
        return (
            <Chip
                label="Cancelled"
                color="error"
                variant="outlined"
            />
        );
    }

    if (
        ["in progress", "processing", "assigned"].includes(normalized)
    ) {
        return (
            <Chip
                icon={<LocalShipping />}
                label="In Progress"
                color="info"
                variant="outlined"
            />
        );
    }

    return (
        <Chip
            icon={<PendingActions />}
            label={value || "Created"}
            color="warning"
            variant="outlined"
        />
    );
};

/* =========================================================
   DETAIL FIELD
========================================================= */

const DetailField = ({ label, value, icon }) => (
    <Stack direction="row" spacing={1.5} alignItems="flex-start">
        {icon && (
            <Box sx={{ color: "primary.main", mt: 0.25 }}>
                {icon}
            </Box>
        )}

        <Box sx={{ minWidth: 0, flex: 1 }}>
            <Typography
                variant="caption"
                color="text.secondary"
                display="block"
                sx={{ mb: 0.5 }}
            >
                {label}
            </Typography>

            <Typography
                variant="body1"
                fontWeight={600}
                sx={{ overflowWrap: "anywhere", whiteSpace: "pre-wrap" }}
            >
                {value === undefined || value === null || value === ""
                    ? "—"
                    : String(value)}
            </Typography>
        </Box>
    </Stack>
);

/* =========================================================
   PICKLIST DETAILS COMPONENT
========================================================= */

const PicklistDetails = ({
    picklistId: suppliedPicklistId,
    apiUrl = PICKLIST_API,
    onEdit,
    onBack,
    onLoaded
}) => {
    const params = useParams();
    const navigate = useNavigate();

    // The route may contain either :picklistCode or :picklistId.
    const routeIdentifier =
        params.picklistCode ??
        params.id ??
        params.picklistId;

    const identifier =
        suppliedPicklistId ??
        routeIdentifier;

    const [picklist, setPicklist] = useState(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState("");

    /* =====================================================
       FETCH PICKLIST
    ===================================================== */

    const fetchPicklist = useCallback(
        async (isRefresh = false, signal) => {
            if (
                identifier === undefined ||
                identifier === null ||
                String(identifier).trim() === ""
            ) {
                setPicklist(null);
                setError("Picklist code or ID is missing.");
                setLoading(false);
                setRefreshing(false);
                return;
            }

            if (isRefresh) {
                setRefreshing(true);
            } else {
                setLoading(true);
            }

            setError("");

            try {
                const response = await axios.get(
                    `${apiUrl}/${encodeURIComponent(String(identifier))}`,
                    {
                        signal,
                        headers: {
                            Accept: "application/json"
                        },
                        timeout: 15000
                    }
                );

                const result = extractPicklist(response.data);

                if (!result) {
                    throw new Error(
                        "The server returned an invalid Picklist response."
                    );
                }

                setPicklist(result);

                if (typeof onLoaded === "function") {
                    onLoaded(result);
                }
            } catch (err) {
                if (
                    err.code === "ERR_CANCELED" ||
                    err.name === "CanceledError"
                ) {
                    return;
                }

                console.error("GET PICKLIST DETAILS ERROR:", {
                    identifier,
                    url: `${apiUrl}/${encodeURIComponent(String(identifier))}`,
                    status: err.response?.status,
                    data: err.response?.data,
                    message: err.message
                });

                if (err.response?.status === 404) {
                    setError(
                        `No picklist was found for "${identifier}". Verify that the Node proxy forwards this identifier to the correct ASP.NET endpoint.`
                    );
                } else if (err.response?.status === 401) {
                    setError("You are not authorized to view this picklist.");
                } else if (err.response?.status === 403) {
                    setError("You do not have permission to view this picklist.");
                } else if (!err.response) {
                    setError(
                        "Cannot connect to the Node proxy at http://localhost:5000."
                    );
                } else {
                    setError(
                        err.response?.data?.message ||
                        err.response?.data?.title ||
                        err.response?.data?.error ||
                        err.message ||
                        "Unable to load picklist details."
                    );
                }

                setPicklist(null);
            } finally {
                if (!signal?.aborted) {
                    setLoading(false);
                    setRefreshing(false);
                }
            }
        },
        [apiUrl, identifier, onLoaded]
    );

    /* =====================================================
       INITIAL LOAD
    ===================================================== */

    useEffect(() => {
        const controller = new AbortController();

        fetchPicklist(false, controller.signal);

        return () => controller.abort();
    }, [fetchPicklist]);

    /* =====================================================
       BACK NAVIGATION
    ===================================================== */

    const handleBack = () => {
        if (typeof onBack === "function") {
            onBack();
            return;
        }

        navigate("/picklists");
    };

    /* =====================================================
       EDIT NAVIGATION
    ===================================================== */

    const handleEdit = () => {
        if (typeof onEdit === "function") {
            onEdit(picklist);
            return;
        }

        const code = getValue(
            picklist,
            ["picklistCode", "PicklistCode"],
            identifier
        );

        navigate(
            `/picklists/edit/${encodeURIComponent(String(code))}`,
            { state: { picklist } }
        );
    };

    /* =====================================================
       LOADING
    ===================================================== */

    if (loading) {
        return (
            <Box
                sx={{
                    minHeight: 300,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 2,
                    p: 3
                }}
            >
                <CircularProgress />

                <Typography color="text.secondary">
                    Loading picklist details...
                </Typography>
            </Box>
        );
    }

    /* =====================================================
       ERROR
    ===================================================== */

    if (error && !picklist) {
        return (
            <Box sx={{ p: { xs: 2, md: 3 } }}>
                <Stack
                    direction="row"
                    spacing={1}
                    alignItems="center"
                    sx={{ mb: 3 }}
                >
                    <IconButton onClick={handleBack} aria-label="Go back">
                        <ArrowBack />
                    </IconButton>

                    <Typography variant="h5" fontWeight={700}>
                        Picklist Details
                    </Typography>
                </Stack>

                <Alert
                    severity="error"
                    action={
                        <Button
                            color="inherit"
                            size="small"
                            startIcon={<Refresh />}
                            onClick={() => fetchPicklist(true)}
                        >
                            Retry
                        </Button>
                    }
                >
                    {error}
                </Alert>
            </Box>
        );
    }

    if (!picklist) return null;

    /* =====================================================
       ACTUAL PICKLIST MODEL FIELDS
    ===================================================== */

    const picklistCode = getValue(
        picklist,
        ["picklistCode", "PicklistCode"],
        identifier
    );

    const picklistId = getValue(
        picklist,
        ["picklistId", "PicklistId"],
        ""
    );

    const destination = getValue(
        picklist,
        ["destination", "Destination"],
        ""
    );

    const shippingPackageCodes = getValue(
        picklist,
        ["shippingPackageCodes", "ShippingPackageCodes"],
        ""
    );

    const sellerId = getValue(
        picklist,
        ["sellerId", "SellerId"],
        ""
    );

    const customerId = getValue(
        picklist,
        ["customerId", "CustomerId"],
        ""
    );

    const createdDate = getValue(
        picklist,
        ["createdDate", "CreatedDate"],
        ""
    );

    const packageCodes = getPackageCodes(shippingPackageCodes);

    /* =====================================================
       RENDER
    ===================================================== */

    return (
        <Box sx={{ p: { xs: 2, md: 3 } }}>
            {/* HEADER */}

            <Stack
                direction={{ xs: "column", sm: "row" }}
                justifyContent="space-between"
                alignItems={{ xs: "stretch", sm: "center" }}
                spacing={2}
                sx={{ mb: 3 }}
            >
                <Stack direction="row" spacing={1.5} alignItems="center">
                    <Tooltip title="Back to Picklists">
                        <IconButton
                            onClick={handleBack}
                            aria-label="Go back"
                        >
                            <ArrowBack />
                        </IconButton>
                    </Tooltip>

                    <Box>
                        <Typography variant="h5" fontWeight={700}>
                            Picklist Details
                        </Typography>

                        <Typography
                            variant="body2"
                            color="text.secondary"
                        >
                            View shipping packages and picklist information.
                        </Typography>
                    </Box>
                </Stack>

                <Stack direction="row" spacing={1}>
                    <Button
                        variant="outlined"
                        startIcon={
                            refreshing
                                ? <CircularProgress size={16} />
                                : <Refresh />
                        }
                        disabled={refreshing}
                        onClick={() => fetchPicklist(true)}
                    >
                        Refresh
                    </Button>

                    <Button
                        variant="contained"
                        startIcon={<Edit />}
                        onClick={handleEdit}
                    >
                        Edit Picklist
                    </Button>
                </Stack>
            </Stack>

            {/* SUMMARY CARD */}

            <Card
                variant="outlined"
                sx={{ mb: 3, borderRadius: 2 }}
            >
                <CardContent sx={{ p: { xs: 2, md: 3 } }}>
                    <Typography
                        variant="overline"
                        color="text.secondary"
                    >
                        Picklist Code
                    </Typography>

                    <Typography
                        variant="h5"
                        fontWeight={700}
                        sx={{ overflowWrap: "anywhere", mb: 1.5 }}
                    >
                        {picklistCode}
                    </Typography>

                    <Chip
                        label="Picklist Loaded"
                        color="success"
                        variant="outlined"
                        size="small"
                    />

                    <Divider sx={{ my: 3 }} />

                    <Grid container spacing={3}>
                        <Grid xs={12} sm={6} md={3}>
                            <DetailField
                                label="Picklist ID"
                                value={picklistId}
                                icon={<Numbers />}
                            />
                        </Grid>

                        <Grid xs={12} sm={6} md={3}>
                            <DetailField
                                label="Destination"
                                value={destination}
                                icon={<LocalShipping />}
                            />
                        </Grid>

                        <Grid xs={12} sm={6} md={3}>
                            <DetailField
                                label="Seller ID"
                                value={sellerId}
                                icon={<Business />}
                            />
                        </Grid>

                        <Grid xs={12} sm={6} md={3}>
                            <DetailField
                                label="Customer ID"
                                value={customerId}
                                icon={<Person />}
                            />
                        </Grid>

                        <Grid xs={12} sm={6}>
                            <DetailField
                                label="Created Date"
                                value={formatDate(createdDate)}
                                icon={<CalendarMonth />}
                            />
                        </Grid>

                        <Grid xs={12} sm={6}>
                            <DetailField
                                label="Package Count"
                                value={packageCodes.length}
                                icon={<Inventory2 />}
                            />
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>

            {/* SHIPPING PACKAGES */}

            <Card variant="outlined" sx={{ borderRadius: 2 }}>
                <CardContent sx={{ p: { xs: 2, md: 3 } }}>
                    <Stack
                        direction={{ xs: "column", sm: "row" }}
                        justifyContent="space-between"
                        alignItems={{ xs: "flex-start", sm: "center" }}
                        spacing={1}
                        sx={{ mb: 2 }}
                    >
                        <Box>
                            <Typography variant="h6" fontWeight={700}>
                                Shipping Packages
                            </Typography>

                            <Typography
                                variant="body2"
                                color="text.secondary"
                            >
                                Packages assigned to this picklist.
                            </Typography>
                        </Box>

                        <Chip
                            label={`${packageCodes.length} package${packageCodes.length === 1 ? "" : "s"}`}
                            variant="outlined"
                        />
                    </Stack>

                    <Divider sx={{ mb: 2 }} />

                    {packageCodes.length > 0 ? (
                        <TableContainer component={Paper} variant="outlined">
                            <Table size="small">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>
                                            <strong>#</strong>
                                        </TableCell>

                                        <TableCell>
                                            <strong>Shipping Package Code</strong>
                                        </TableCell>
                                    </TableRow>
                                </TableHead>

                                <TableBody>
                                    {packageCodes.map((code, index) => (
                                        <TableRow key={`${code}-${index}`} hover>
                                            <TableCell>{index + 1}</TableCell>

                                            <TableCell>
                                                <Typography
                                                    fontWeight={600}
                                                    sx={{ overflowWrap: "anywhere" }}
                                                >
                                                    {code}
                                                </Typography>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    ) : (
                        <Paper
                            variant="outlined"
                            sx={{
                                p: 4,
                                textAlign: "center",
                                borderStyle: "dashed"
                            }}
                        >
                            <Inventory2
                                sx={{
                                    fontSize: 42,
                                    color: "text.secondary",
                                    mb: 1
                                }}
                            />

                            <Typography fontWeight={600}>
                                No shipping packages
                            </Typography>

                            <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{ mt: 0.5 }}
                            >
                                No package codes have been assigned to this picklist.
                            </Typography>
                        </Paper>
                    )}
                </CardContent>
            </Card>

            {/* RAW PACKAGE DATA */}

            <Card
                variant="outlined"
                sx={{ mt: 3, borderRadius: 2 }}
            >
                <CardContent>
                    <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
                        Additional Information
                    </Typography>

                    <Divider sx={{ mb: 2 }} />

                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mb: 1 }}
                    >
                        Stored shipping package codes
                    </Typography>

                    <Paper
                        variant="outlined"
                        sx={{
                            p: 2,
                            bgcolor: "action.hover",
                            overflowWrap: "anywhere",
                            whiteSpace: "pre-wrap"
                        }}
                    >
                        <Typography variant="body2">
                            {shippingPackageCodes || "No package data"}
                        </Typography>
                    </Paper>
                </CardContent>
            </Card>

            {/* FOOTER */}

            <Stack
                direction="row"
                justifyContent="flex-end"
                spacing={2}
                sx={{ mt: 3 }}
            >
                <Button
                    variant="outlined"
                    startIcon={<ArrowBack />}
                    onClick={handleBack}
                >
                    Back to Picklists
                </Button>

                <Button
                    variant="contained"
                    startIcon={<Edit />}
                    onClick={handleEdit}
                >
                    Edit Picklist
                </Button>
            </Stack>
        </Box>
    );
};

export default PicklistDetails;
