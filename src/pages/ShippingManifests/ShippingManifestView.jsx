import React, { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

import {
    Alert,
    Box,
    Button,
    Chip,
    CircularProgress,
    Divider,
    Grid,
    Paper,
    Stack,
    Typography
} from "@mui/material";

import {
    ArrowBack,
    CalendarMonth,
    CheckCircle,
    Cancel,
    Description,
    Inventory2,
    LocalShipping,
    LocationOn,
    Numbers,
    Payments,
    PendingActions,
    Person,
    Refresh,
    Scale,
    Edit
} from "@mui/icons-material";

const API_URL = "http://localhost:5000/api/shipping-manifests";
const getField = (record,...keys) => {
    if (!record) return "";
    for (const key of keys) {
        const value = record[key];
        if (value!== undefined && value!== null && value!== "") {
            return value;
        }
    }
    return "";
};

const hasValue = (value) => value!== "" && value!== null && value!== undefined;

const getManifestId = (manifest) => {
    if (!manifest || typeof manifest !== "object") {
        return null;
    }

    return (
        manifest.shippingManifestId ??
        manifest.ShippingManifestId ??
        manifest.shippingManifestCode ??
        manifest.ShippingManifestCode ??
        manifest.manifestNumber ??
        manifest.ManifestNumber ??
        manifest.manifestId ??
        manifest.ManifestId ??
        manifest.id ??
        manifest.Id ??
        null
    );
};

const unwrapManifest = (responseData, requestedId) => {
    if (!responseData) {
        return null;
    }

    // Handle APIs that return an array of manifests.
    if (Array.isArray(responseData)) {
        const matchingManifest = responseData.find((item) => {
            const itemId = getManifestId(item);

            return itemId != null &&
                String(itemId).trim().toLowerCase() ===
                String(requestedId).trim().toLowerCase();
        });

        return matchingManifest ?? null;
    }

    if (typeof responseData !== "object") {
        return null;
    }

    // Direct manifest object.
    if (getManifestId(responseData) != null) {
        return responseData;
    }

    // Handle common API response wrappers.
    const possibleKeys = [
        "manifest",
        "Manifest",
        "data",
        "Data",
        "result",
        "Result",
        "item",
        "Item",
        "value",
        "Value",
        "items",
        "Items"
    ];

    for (const key of possibleKeys) {
        if (responseData[key] !== undefined &&
            responseData[key] !== null) {
            const result = unwrapManifest(
                responseData[key],
                requestedId
            );

            if (result) {
                return result;
            }
        }
    }

    return null;
};



// FIXED: Allow SM-..., MAN-001, etc. Both id and code same value
const isValidId = (value) => {
    const id = String(value?? "").trim();
    return id.length > 0 && id.length <= 50 && /^[A-Za-z0-9\-_]+$/.test(id);
};



const formatDate = (value) => {
    if (!hasValue(value)) return "—";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return String(value);
    return date.toLocaleString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
    });
};

const formatNumber = (value, decimals = 2) => {
    if (!hasValue(value)) return "—";
    const number = Number(value);
    return Number.isFinite(number)
       ? number.toLocaleString("en-IN", { maximumFractionDigits: decimals })
        : String(value);
};

const formatCurrency = (value) => {
    if (!hasValue(value)) return "—";
    const number = Number(value);
    return Number.isFinite(number)
       ? `₹ ${number.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
        : String(value);
};

const getStatusConfig = (status) => {
    const normalized = String(status || "Pending").trim().toLowerCase();
    if (normalized === "delivered") return { label: "Delivered", color: "success", icon: <CheckCircle fontSize="small" /> };
    if (normalized === "shipped" || normalized === "in transit") return { label: normalized === "shipped"? "Shipped" : "In Transit", color: "info", icon: <LocalShipping fontSize="small" /> };
    if (normalized === "cancelled" || normalized === "canceled") return { label: "Cancelled", color: "error", icon: <Cancel fontSize="small" /> };
    if (normalized === "processing") return { label: "Processing", color: "warning", icon: <PendingActions fontSize="small" /> };
    if (normalized === "packed" || normalized === "ready") return { label: normalized === "packed"? "Packed" : "Ready", color: "secondary", icon: <Inventory2 fontSize="small" /> };
    return { label: status || "Pending", color: "default", icon: <PendingActions fontSize="small" /> };
};

const DetailField = ({ label, value, icon, fullWidth = false }) => (
    <Grid xs={12} sm={fullWidth? 12 : 6} md={fullWidth? 12 : 4}>
        <Box sx={{ display: "flex", gap: 1.25, py: 1, minWidth: 0 }}>
            {icon && <Box sx={{ color: "text.secondary", mt: 0.25 }}>{icon}</Box>}
            <Box sx={{ minWidth: 0, flex: 1 }}>
                <Typography variant="caption" color="text.secondary" display="block">{label}</Typography>
                <Typography variant="body2" fontWeight={500} sx={{ overflowWrap: "anywhere", whiteSpace: "pre-wrap" }}>
                    {hasValue(value)? String(value) : "—"}
                </Typography>
            </Box>
        </Box>
    </Grid>
);

const SectionHeader = ({ icon, title }) => (
    <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1.5 }}>
        <Box sx={{ display: "flex", color: "primary.main" }}>{icon}</Box>
        <Typography variant="subtitle1" fontWeight={700}>{title}</Typography>
    </Stack>
);

const ShippingManifestView = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [manifest, setManifest] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

  
const loadManifest = useCallback(async () => {
    setManifest(null);
    setError("");

    console.log("ID from URL:", id);

    if (!isValidId(id)) {
        setLoading(false);
        setError(`Invalid shipping manifest ID: "${id ?? ""}".`);
        return;
    }

    setLoading(true);

    try {
        const url = `${API_URL}/${encodeURIComponent(id)}`;

        console.log("Fetching through Node proxy:", url);

        const response = await axios.get(url);

        console.log("Response status:", response.status);
        console.log("Response data:", response.data);

        const record = unwrapManifest(response.data);

        if (!record || !getManifestId(record)) {
            throw new Error(
                `No shipping manifest was returned for ID "${id}".`
            );
        }

        const returnedId = String(getManifestId(record)).trim();
        const requestedId = String(id).trim();

        if (returnedId.toLowerCase() !== requestedId.toLowerCase()) {
            throw new Error(
                `Requested manifest "${requestedId}", but the API returned "${returnedId}".`
            );
        }

        setManifest(record);
    } catch (err) {
        console.error("LOAD SHIPPING MANIFEST ERROR:", {
            message: err.message,
            status: err.response?.status,
            data: err.response?.data,
            url: `${API_URL}/${encodeURIComponent(id ?? "")}`
        });

        setError(
            err.response?.data?.message ||
            err.response?.data?.Message ||
            err.response?.data?.title ||
            err.message ||
            "Failed to load shipping manifest."
        );
    } finally {
        setLoading(false);
    }
}, [id]);


    useEffect(() => { loadManifest(); }, [loadManifest]);

    const handleEdit = () => {
        if (!isValidId(id)) return;
        navigate(`/shipping-manifests/${id}/edit`);
    };

    const status = getField(manifest, "status", "Status") || "Pending";
    const statusConfig = getStatusConfig(status);

    return (
        <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: 1400, mx: "auto" }}>
            <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" alignItems={{ xs: "stretch", sm: "center" }} spacing={2} sx={{ mb: 3 }}>
                <Box>
                    <Typography variant="h5" fontWeight={700}>Shipping Manifest Details</Typography>
                    <Typography variant="body2" color="text.secondary">View shipping, delivery, carrier, and package information.</Typography>
                </Box>
                <Stack direction="row" spacing={1} flexWrap="wrap">
                    <Button variant="outlined" startIcon={<ArrowBack />} onClick={() => navigate(-1)}>Back</Button>
                    <Button variant="outlined" startIcon={<Refresh />} onClick={loadManifest} disabled={loading}>Refresh</Button>
                    <Button variant="contained" startIcon={<Edit />} onClick={handleEdit} disabled={!manifest ||!isValidId(id)}>Edit Manifest</Button>
                </Stack>
            </Stack>

            {loading && <Paper sx={{ p: 6, textAlign: "center" }}><CircularProgress /><Typography color="text.secondary" sx={{ mt: 2 }}>Loading shipping manifest details...</Typography></Paper>}
            {!loading && error && <Alert severity="error" action={<Button color="inherit" size="small" onClick={loadManifest}>Retry</Button>} sx={{ mb: 2 }}>{error}</Alert>}
            {!loading &&!error && manifest && (
                <>
                    <Paper variant="outlined" sx={{ p: { xs: 2, md: 3 }, mb: 3, borderRadius: 2 }}>
                        <Stack direction={{ xs: "column", sm: "row" }} alignItems={{ xs: "flex-start", sm: "center" }} justifyContent="space-between" spacing={2}>
                            <Stack direction="row" spacing={2} alignItems="center">
                                <Box sx={{ width: 54, height: 54, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 2, bgcolor: "primary.main", color: "primary.contrastText" }}><LocalShipping fontSize="large" /></Box>
                                <Box sx={{ minWidth: 0 }}>
                                    <Typography variant="h6" fontWeight={700} sx={{ overflowWrap: "anywhere" }}>{getField(manifest, "manifestNumber", "ManifestNumber", "shippingManifestCode", "ShippingManifestCode") || `Manifest #${id}`}</Typography>
                                    <Typography variant="body2" color="text.secondary">Order Number: {getField(manifest, "orderNumber", "OrderNumber") || "—"}</Typography>
                                    <Typography variant="caption" color="text.secondary">Record ID: {id}</Typography>
                                </Box>
                            </Stack>
                            <Chip icon={statusConfig.icon} label={statusConfig.label} color={statusConfig.color} variant="outlined" />
                        </Stack>
                    </Paper>

                    <Paper variant="outlined" sx={{ p: { xs: 2, md: 3 }, mb: 3, borderRadius: 2 }}>
                        <SectionHeader icon={<Person />} title="Customer and Carrier" />
                        <Grid container spacing={1}>
                            <DetailField label="Customer / Consignee" value={getField(manifest, "customerName", "CustomerName")} icon={<Person fontSize="small" />} />
                            <DetailField label="Carrier" value={getField(manifest, "carrierName", "CarrierName", "shippingProviderName", "ShippingProviderName")} icon={<LocalShipping fontSize="small" />} />
                            <DetailField label="Tracking Number" value={getField(manifest, "trackingNumber", "TrackingNumber")} />
                            <DetailField label="Manifest Code" value={getField(manifest, "shippingManifestCode", "ShippingManifestCode")} icon={<Numbers fontSize="small" />} />
                        </Grid>
                    </Paper>

                    <Paper variant="outlined" sx={{ p: { xs: 2, md: 3 }, mb: 3, borderRadius: 2 }}>
                        <SectionHeader icon={<CalendarMonth />} title="Dates" />
                        <Grid container spacing={1}>
                            <DetailField label="Created Date" value={formatDate(getField(manifest, "createdDate", "CreatedDate", "createdAt", "CreatedAt"))} icon={<CalendarMonth fontSize="small" />} />
                            <DetailField label="Status" value={getField(manifest, "status", "Status")} />
                        </Grid>
                    </Paper>

                    <Paper variant="outlined" sx={{ p: { xs: 2, md: 3 }, mb: 3, borderRadius: 2 }}>
                        <SectionHeader icon={<Description />} title="Notes" />
                        <Typography variant="body2" sx={{ whiteSpace: "pre-wrap", overflowWrap: "anywhere" }}>{getField(manifest, "comments", "Comments", "notes", "Notes") || "No additional notes."}</Typography>
                    </Paper>
                </>
            )}
        </Box>
    );
};

export default ShippingManifestView;
