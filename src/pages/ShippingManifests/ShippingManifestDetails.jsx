
import React, { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

import {
    Alert,
    Box,
    Button,
    CircularProgress,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Divider,
    Grid,
    IconButton,
    Paper,
    Chip,
    Stack,
    Typography
} from "@mui/material";

import {
    Close,
    LocalShipping,
    Inventory2,
    Person,
    LocationOn,
    CalendarMonth,
    Payments,
    Scale,
    Numbers,
    CheckCircle,
    PendingActions,
    Cancel,
    Edit,
    Description,
    ArrowBack,
    Refresh
} from "@mui/icons-material";

const API_URL = "/api/shipping-manifests";

/* =========================================================
   FIELD HELPERS
========================================================= */

const getField = (record, ...keys) => {
    if (!record) return "";

    for (const key of keys) {
        if (record[key] !== undefined && record[key] !== null) {
            return record[key];
        }
    }

    return "";
};

const hasValue = (value) =>
    value !== "" && value !== null && value !== undefined;

const getManifestId = (record) =>
    getField(
        record,
        "shippingManifestId",
        "ShippingManifestId",
        "shippingManifestsId",
        "ShippingManifestsId",
        "manifestId",
        "ManifestId",
        "id",
        "Id"
    );

const isValidId = (id) =>
    /^\d+$/.test(String(id ?? "").trim()) &&
    Number.isSafeInteger(Number(id)) &&
    Number(id) > 0;

const unwrapManifest = (responseData) => {
    if (!responseData) return null;

    let result =
        responseData.manifest ??
        responseData.Manifest ??
        responseData.data ??
        responseData.Data ??
        responseData;

    if (Array.isArray(result)) {
        result = result[0] ?? null;
    }

    return result && typeof result === "object" ? result : null;
};

const formatDate = (value) => {
    if (!hasValue(value)) return "—";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) return String(value);

    return date.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric"
    });
};

const formatNumber = (value, decimals = 2) => {
    if (!hasValue(value)) return "—";

    const number = Number(value);

    return Number.isFinite(number)
        ? number.toLocaleString("en-IN", {
              maximumFractionDigits: decimals
          })
        : String(value);
};

const formatCurrency = (value) => {
    if (!hasValue(value)) return "—";

    const number = Number(value);

    return Number.isFinite(number)
        ? `₹ ${number.toLocaleString("en-IN", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2
          })}`
        : String(value);
};

/* =========================================================
   STATUS
========================================================= */

const getStatusConfig = (status) => {
    const normalized = String(status || "Pending").toLowerCase().trim();

    if (normalized === "delivered") {
        return {
            label: "Delivered",
            color: "success",
            icon: <CheckCircle fontSize="small" />
        };
    }

    if (normalized === "shipped" || normalized === "in transit") {
        return {
            label: normalized === "shipped" ? "Shipped" : "In Transit",
            color: "info",
            icon: <LocalShipping fontSize="small" />
        };
    }

    if (normalized === "cancelled" || normalized === "canceled") {
        return {
            label: "Cancelled",
            color: "error",
            icon: <Cancel fontSize="small" />
        };
    }

    if (normalized === "packed" || normalized === "ready") {
        return {
            label: normalized === "packed" ? "Packed" : "Ready",
            color: "secondary",
            icon: <Inventory2 fontSize="small" />
        };
    }

    if (normalized === "processing") {
        return {
            label: "Processing",
            color: "warning",
            icon: <PendingActions fontSize="small" />
        };
    }

    return {
        label: status || "Pending",
        color: "default",
        icon: <PendingActions fontSize="small" />
    };
};

/* =========================================================
   REUSABLE DETAILS FIELD
========================================================= */

const DetailField = ({ label, value, icon, fullWidth = false }) => (
    <Grid item xs={12} sm={fullWidth ? 12 : 6} md={fullWidth ? 12 : 4}>
        <Box sx={{ display: "flex", gap: 1.25, py: 0.75, minWidth: 0 }}>
            {icon && (
                <Box sx={{ color: "text.secondary", display: "flex", mt: 0.25 }}>
                    {icon}
                </Box>
            )}

            <Box sx={{ minWidth: 0, flex: 1 }}>
                <Typography variant="caption" color="text.secondary" display="block">
                    {label}
                </Typography>

                <Typography
                    variant="body2"
                    fontWeight={500}
                    sx={{ overflowWrap: "anywhere", whiteSpace: "pre-wrap" }}
                >
                    {hasValue(value) ? String(value) : "—"}
                </Typography>
            </Box>
        </Box>
    </Grid>
);

const SectionHeader = ({ icon, title }) => (
    <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
        <Box sx={{ display: "flex", color: "primary.main" }}>{icon}</Box>
        <Typography variant="subtitle1" fontWeight={700}>
            {title}
        </Typography>
    </Stack>
);

/* =========================================================
   SHIPPING MANIFEST DETAILS
========================================================= */

const ShippingManifestDetails = ({
    open = true,
    onClose,
    manifest: suppliedManifest = null,
    record = null,
    data = null,
    loading: suppliedLoading = false,
    onEdit,
    embedded = false
}) => {
    const { id } = useParams();
    const navigate = useNavigate();

    const providedRecord = suppliedManifest || record || data || null;

    const [fetchedManifest, setFetchedManifest] = useState(null);
    const [fetchLoading, setFetchLoading] = useState(false);
    const [fetchError, setFetchError] = useState("");

    /*
      Full-page mode fetches the record from the URL.
      Dialog mode continues to use the manifest passed by its parent.
    */
    const loadManifest = useCallback(async () => {
        if (!embedded || providedRecord) return;

        setFetchedManifest(null);
        setFetchError("");

        if (!isValidId(id)) {
            setFetchLoading(false);
            setFetchError(
                `Invalid shipping manifest ID "${id ?? ""}". Please open a manifest using its actual database ID.`
            );
            return;
        }

        setFetchLoading(true);

        try {
            const response = await axios.get(
                `${API_URL}/${encodeURIComponent(id)}`
            );

            const result = unwrapManifest(response.data);

            if (!result || Object.keys(result).length === 0) {
                throw new Error("The API returned no shipping manifest record.");
            }

            setFetchedManifest(result);
        } catch (error) {
            console.error("Shipping manifest fetch failed:", error);

            setFetchError(
                error.response?.data?.message ||
                error.response?.data?.title ||
                (error.response?.status === 404
                    ? "Shipping manifest not found. Check the ID and API endpoint."
                    : error.message || "Failed to load shipping manifest.")
            );
        } finally {
            setFetchLoading(false);
        }
    }, [embedded, id, providedRecord]);

    useEffect(() => {
        if (embedded && !providedRecord) {
            loadManifest();
        }
    }, [embedded, providedRecord, loadManifest]);

    const item = providedRecord || fetchedManifest;
    const loading = suppliedLoading || (embedded && !providedRecord && fetchLoading);
    const error = embedded && !providedRecord ? fetchError : "";

    if (!embedded && !open) return null;

    const handleClose = () => {
        if (onClose) {
            onClose();
        } else {
            navigate(-1);
        }
    };

    const handleEdit = () => {
        const recordId = getManifestId(item) || id;

        if (!isValidId(recordId)) {
            console.error("Invalid shipping manifest ID:", item);
            return;
        }

        if (onEdit) {
            onEdit(item);
        } else {
            navigate(`/shipping-manifests/${recordId}/edit`);
        }
    };

    /* =====================================================
       LOADING STATE
    ===================================================== */

    const loader = (
        <Box sx={{ py: 7, textAlign: "center" }}>
            <CircularProgress />

            <Typography color="text.secondary" sx={{ mt: 2 }}>
                Loading shipping manifest details...
            </Typography>
        </Box>
    );

    if (loading) {
        return embedded ? (
            <Box sx={{ p: 3 }}>{loader}</Box>
        ) : (
            <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
                <DialogContent>{loader}</DialogContent>
            </Dialog>
        );
    }

    /* =====================================================
       ERROR / EMPTY STATE
    ===================================================== */

    if (error || !item) {
        const emptyContent = (
            <Box sx={{ py: 5, textAlign: "center" }}>
                {error ? (
                    <Alert severity="error" sx={{ textAlign: "left", mb: 2 }}>
                        {error}
                    </Alert>
                ) : (
                    <>
                        <LocalShipping
                            sx={{ fontSize: 48, color: "text.disabled", mb: 1 }}
                        />

                        <Typography variant="h6" fontWeight={600}>
                            No Manifest Selected
                        </Typography>

                        <Typography variant="body2" color="text.secondary">
                            No shipping manifest record was provided.
                        </Typography>
                    </>
                )}

                {embedded && (
                    <Stack
                        direction="row"
                        spacing={1}
                        justifyContent="center"
                        sx={{ mt: 2 }}
                    >
                        <Button
                            variant="outlined"
                            startIcon={<ArrowBack />}
                            onClick={() => navigate(-1)}
                        >
                            Back
                        </Button>

                        <Button
                            variant="contained"
                            startIcon={<Refresh />}
                            onClick={loadManifest}
                            disabled={!isValidId(id)}
                        >
                            Retry
                        </Button>
                    </Stack>
                )}
            </Box>
        );

        return embedded ? (
            <Box sx={{ p: 3 }}>{emptyContent}</Box>
        ) : (
            <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
                <DialogContent>{emptyContent}</DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Close</Button>
                </DialogActions>
            </Dialog>
        );
    }

    /* =====================================================
       MANIFEST VALUES
    ===================================================== */

    const manifestId = getManifestId(item);

    const manifestNumber = getField(
        item, "manifestNumber", "ManifestNumber", "manifestNo", "ManifestNo"
    );

    const orderNumber = getField(
        item, "orderNumber", "OrderNumber", "orderNo", "OrderNo"
    );

    const status = getField(item, "status", "Status") || "Pending";
    const statusConfig = getStatusConfig(status);

    const customerName = getField(
        item, "customerName", "CustomerName", "consigneeName", "ConsigneeName"
    );

    const carrierName = getField(
        item, "carrierName", "CarrierName", "shippingProvider", "ShippingProvider"
    );

    const trackingNumber = getField(item, "trackingNumber", "TrackingNumber");
    const vehicleNumber = getField(item, "vehicleNumber", "VehicleNumber");
    const driverName = getField(item, "driverName", "DriverName");
    const driverContact = getField(item, "driverContact", "DriverContact");

    const shipmentDate = getField(
        item, "shipmentDate", "ShipmentDate", "shippingDate", "ShippingDate"
    );

    const expectedDeliveryDate = getField(
        item, "expectedDeliveryDate", "ExpectedDeliveryDate"
    );

    const actualDeliveryDate = getField(
        item, "actualDeliveryDate", "ActualDeliveryDate"
    );

    const origin = getField(
        item, "origin", "Origin", "sourceAddress", "SourceAddress"
    );

    const destination = getField(
        item, "destination", "Destination", "destinationAddress", "DestinationAddress"
    );

    const totalItems = getField(item, "totalItems", "TotalItems");
    const totalQuantity = getField(item, "totalQuantity", "TotalQuantity");
    const totalPackages = getField(item, "totalPackages", "TotalPackages");
    const totalWeight = getField(item, "totalWeight", "TotalWeight");

    const weightUnit =
        getField(item, "weightUnit", "WeightUnit") || "kg";

    const shippingCost = getField(item, "shippingCost", "ShippingCost");

    const notes = getField(
        item, "notes", "Notes", "remarks", "Remarks"
    );

    const createdAt = getField(
        item, "createdAt", "CreatedAt", "createdDate", "CreatedDate"
    );

    const updatedAt = getField(
        item, "updatedAt", "UpdatedAt", "modifiedAt", "ModifiedAt"
    );

    /* =====================================================
       DETAILS CONTENT
    ===================================================== */

    const content = (
        <Box>
            <Paper
                variant="outlined"
                sx={{ p: 2.5, mb: 3, borderRadius: 2 }}
            >
                <Stack
                    direction={{ xs: "column", sm: "row" }}
                    alignItems={{ xs: "flex-start", sm: "center" }}
                    justifyContent="space-between"
                    spacing={2}
                >
                    <Stack direction="row" spacing={1.5} alignItems="center">
                        <Box
                            sx={{
                                width: 48,
                                height: 48,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                bgcolor: "primary.main",
                                color: "primary.contrastText",
                                borderRadius: 2
                            }}
                        >
                            <LocalShipping />
                        </Box>

                        <Box sx={{ minWidth: 0 }}>
                            <Typography
                                variant="h6"
                                fontWeight={700}
                                sx={{ overflowWrap: "anywhere" }}
                            >
                                {manifestNumber ||
                                    `Manifest #${manifestId || id}`}
                            </Typography>

                            <Typography variant="body2" color="text.secondary">
                                Order Number: {orderNumber || "—"}
                            </Typography>

                            <Typography variant="caption" color="text.secondary">
                                Record ID: {manifestId || id || "—"}
                            </Typography>
                        </Box>
                    </Stack>

                    <Chip
                        icon={statusConfig.icon}
                        label={statusConfig.label}
                        color={statusConfig.color}
                        variant="outlined"
                    />
                </Stack>
            </Paper>

            <Box sx={{ mb: 3 }}>
                <SectionHeader
                    icon={<Person />}
                    title="Customer and Carrier"
                />

                <Grid container spacing={1}>
                    <DetailField
                        label="Customer / Consignee"
                        value={customerName}
                        icon={<Person fontSize="small" />}
                    />

                    <DetailField
                        label="Carrier"
                        value={carrierName}
                        icon={<LocalShipping fontSize="small" />}
                    />

                    <DetailField label="Tracking Number" value={trackingNumber} />
                    <DetailField label="Vehicle Number" value={vehicleNumber} />
                    <DetailField label="Driver Name" value={driverName} />
                    <DetailField label="Driver Contact" value={driverContact} />
                </Grid>
            </Box>

            <Divider sx={{ mb: 3 }} />

            <Box sx={{ mb: 3 }}>
                <SectionHeader
                    icon={<CalendarMonth />}
                    title="Shipment and Delivery Dates"
                />

                <Grid container spacing={1}>
                    <DetailField
                        label="Shipment Date"
                        value={formatDate(shipmentDate)}
                    />

                    <DetailField
                        label="Expected Delivery"
                        value={formatDate(expectedDeliveryDate)}
                    />

                    <DetailField
                        label="Actual Delivery"
                        value={formatDate(actualDeliveryDate)}
                    />
                </Grid>
            </Box>

            <Divider sx={{ mb: 3 }} />

            <Box sx={{ mb: 3 }}>
                <SectionHeader
                    icon={<LocationOn />}
                    title="Shipment Locations"
                />

                <Grid container spacing={1}>
                    <DetailField
                        label="Origin"
                        value={origin}
                        icon={<LocationOn fontSize="small" />}
                    />

                    <DetailField
                        label="Destination"
                        value={destination}
                        icon={<LocationOn fontSize="small" />}
                    />
                </Grid>
            </Box>

            <Divider sx={{ mb: 3 }} />

            <Box sx={{ mb: 3 }}>
                <SectionHeader
                    icon={<Inventory2 />}
                    title="Package and Weight Details"
                />

                <Grid container spacing={1}>
                    <DetailField
                        label="Total Items"
                        value={formatNumber(totalItems, 0)}
                        icon={<Numbers fontSize="small" />}
                    />

                    <DetailField
                        label="Total Quantity"
                        value={formatNumber(totalQuantity, 0)}
                    />

                    <DetailField
                        label="Total Packages"
                        value={formatNumber(totalPackages, 0)}
                    />

                    <DetailField
                        label="Total Weight"
                        value={
                            hasValue(totalWeight)
                                ? `${formatNumber(totalWeight)} ${weightUnit}`
                                : "—"
                        }
                        icon={<Scale fontSize="small" />}
                    />

                    <DetailField
                        label="Shipping Cost"
                        value={formatCurrency(shippingCost)}
                        icon={<Payments fontSize="small" />}
                    />
                </Grid>
            </Box>

            <Divider sx={{ mb: 3 }} />

            <Box sx={{ mb: 3 }}>
                <SectionHeader
                    icon={<Description />}
                    title="Notes and Remarks"
                />

                <Paper
                    variant="outlined"
                    sx={{ p: 2, borderRadius: 2 }}
                >
                    <Typography
                        variant="body2"
                        sx={{ whiteSpace: "pre-wrap", overflowWrap: "anywhere" }}
                    >
                        {hasValue(notes) ? notes : "No additional notes available."}
                    </Typography>
                </Paper>
            </Box>

            {(hasValue(createdAt) || hasValue(updatedAt)) && (
                <>
                    <Divider sx={{ mb: 2 }} />

                    <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 1 }}>
                        Record Information
                    </Typography>

                    <Grid container spacing={1}>
                        {hasValue(createdAt) && (
                            <DetailField
                                label="Created At"
                                value={formatDate(createdAt)}
                            />
                        )}

                        {hasValue(updatedAt) && (
                            <DetailField
                                label="Last Updated"
                                value={formatDate(updatedAt)}
                            />
                        )}
                    </Grid>
                </>
            )}
        </Box>
    );

    /* =====================================================
       FULL PAGE MODE
    ===================================================== */

    if (embedded) {
        return (
            <Box sx={{ width: "100%", maxWidth: 1400, mx: "auto", p: { xs: 2, md: 3 } }}>
                <Stack
                    direction={{ xs: "column", sm: "row" }}
                    justifyContent="space-between"
                    alignItems={{ xs: "stretch", sm: "center" }}
                    spacing={2}
                    sx={{ mb: 3 }}
                >
                    <Box>
                        <Typography variant="h5" fontWeight={700}>
                            Shipping Manifest Details
                        </Typography>

                        <Typography variant="body2" color="text.secondary">
                            View shipment, carrier, package, and delivery information.
                        </Typography>
                    </Box>

                    <Stack direction="row" spacing={1} flexWrap="wrap">
                        <Button
                            variant="outlined"
                            startIcon={<ArrowBack />}
                            onClick={() => navigate(-1)}
                        >
                            Back
                        </Button>

                        <Button
                            variant="outlined"
                            startIcon={<Refresh />}
                            onClick={loadManifest}
                            disabled={fetchLoading || !isValidId(id)}
                        >
                            Refresh
                        </Button>

                        <Button
                            variant="contained"
                            startIcon={<Edit />}
                            onClick={handleEdit}
                        >
                            Edit Manifest
                        </Button>
                    </Stack>
                </Stack>

                {content}
            </Box>
        );
    }

    /* =====================================================
       DIALOG MODE
    ===================================================== */

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            fullWidth
            maxWidth="md"
            scroll="paper"
        >
            <DialogTitle
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 2
                }}
            >
                <Stack direction="row" spacing={1} alignItems="center">
                    <LocalShipping color="primary" />
                    <Typography variant="h6" fontWeight={700}>
                        Shipping Manifest Details
                    </Typography>
                </Stack>

                <IconButton onClick={handleClose} aria-label="Close">
                    <Close />
                </IconButton>
            </DialogTitle>

            <Divider />

            <DialogContent sx={{ p: { xs: 2, sm: 3 } }}>
                {content}
            </DialogContent>

            <Divider />

            <DialogActions sx={{ p: 2 }}>
                <Button
                    variant="contained"
                    startIcon={<Edit />}
                    onClick={handleEdit}
                >
                    Edit Manifest
                </Button>

                <Button variant="outlined" onClick={handleClose}>
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ShippingManifestDetails;
