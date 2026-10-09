import React from "react";

import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Box,
    Grid,
    Typography,
    Paper,
    Divider,
    Chip,
    Stack,
    IconButton,
    CircularProgress
} from "@mui/material";

import {
    Close,
    LocalShipping,
    Inventory2,
    Person,
    LocationOn,
    CalendarMonth,
    ReceiptLong,
    Payments,
    Scale,
    Numbers,
    CheckCircle,
    PendingActions,
    Cancel,
    Edit,
    Description
} from "@mui/icons-material";

/* =========================================================
   FIELD HELPER
========================================================= */

const getField = (record, ...keys) => {
    if (!record) return "";

    for (const key of keys) {
        const value = record[key];

        if (value !== undefined && value !== null) {
            return value;
        }
    }

    return "";
};

/* =========================================================
   DATE FORMATTER
========================================================= */

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

/* =========================================================
   NUMBER FORMATTER
========================================================= */

const formatNumber = (value, decimals = 2) => {
    if (
        value === null ||
        value === undefined ||
        value === ""
    ) {
        return "—";
    }

    const number = Number(value);

    if (!Number.isFinite(number)) {
        return String(value);
    }

    return number.toLocaleString("en-IN", {
        maximumFractionDigits: decimals
    });
};

/* =========================================================
   CURRENCY FORMATTER
========================================================= */

const formatCurrency = (value) => {
    if (
        value === null ||
        value === undefined ||
        value === ""
    ) {
        return "—";
    }

    const amount = Number(value);

    if (!Number.isFinite(amount)) {
        return String(value);
    }

    return `₹ ${amount.toLocaleString("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    })}`;
};

/* =========================================================
   STATUS CONFIGURATION
========================================================= */

const getStatusConfig = (status) => {
    const normalized = String(status || "Pending")
        .trim()
        .toLowerCase();

    if (normalized === "delivered") {
        return {
            label: "Delivered",
            color: "success",
            icon: <CheckCircle fontSize="small" />
        };
    }

    if (
        normalized === "shipped" ||
        normalized === "in transit"
    ) {
        return {
            label: normalized === "shipped"
                ? "Shipped"
                : "In Transit",
            color: "info",
            icon: <LocalShipping fontSize="small" />
        };
    }

    if (normalized === "cancelled") {
        return {
            label: "Cancelled",
            color: "error",
            icon: <Cancel fontSize="small" />
        };
    }

    if (normalized === "ready" || normalized === "packed") {
        return {
            label: normalized === "ready" ? "Ready" : "Packed",
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
   DETAIL FIELD
========================================================= */

const DetailField = ({
    label,
    value,
    icon,
    fullWidth = false
}) => (
    <Grid
        item
        xs={12}
        sm={fullWidth ? 12 : 6}
        md={fullWidth ? 12 : 4}
    >
        <Box
            sx={{
                display: "flex",
                alignItems: "flex-start",
                gap: 1.25,
                minWidth: 0,
                py: 0.75
            }}
        >
            {icon && (
                <Box
                    sx={{
                        color: "text.secondary",
                        display: "flex",
                        mt: 0.25
                    }}
                >
                    {icon}
                </Box>
            )}

            <Box sx={{ minWidth: 0, flex: 1 }}>
                <Typography
                    variant="caption"
                    color="text.secondary"
                    display="block"
                >
                    {label}
                </Typography>

                <Typography
                    variant="body2"
                    fontWeight={500}
                    sx={{
                        overflowWrap: "anywhere",
                        whiteSpace: "pre-wrap"
                    }}
                >
                    {value === "" ||
                    value === null ||
                    value === undefined
                        ? "—"
                        : String(value)}
                </Typography>
            </Box>
        </Box>
    </Grid>
);

/* =========================================================
   SECTION HEADER
========================================================= */

const SectionHeader = ({ icon, title }) => (
    <Stack
        direction="row"
        spacing={1}
        alignItems="center"
        sx={{ mb: 2 }}
    >
        <Box
            sx={{
                display: "flex",
                color: "primary.main"
            }}
        >
            {icon}
        </Box>

        <Typography
            variant="subtitle1"
            fontWeight={700}
        >
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
    manifest = null,
    record = null,
    data = null,
    loading = false,
    onEdit,
    embedded = false
}) => {
    const item = manifest || record || data;

    if (!embedded && !open) {
        return null;
    }

    if (loading) {
        const loader = (
            <Box
                sx={{
                    minHeight: 260,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexDirection: "column",
                    gap: 2
                }}
            >
                <CircularProgress />

                <Typography color="text.secondary">
                    Loading shipping manifest details...
                </Typography>
            </Box>
        );

        return embedded ? loader : (
            <Dialog
                open={open}
                onClose={onClose}
                fullWidth
                maxWidth="md"
            >
                <DialogContent>{loader}</DialogContent>
            </Dialog>
        );
    }

    if (!item) {
        const emptyContent = (
            <AlertFallback />
        );

        return embedded ? emptyContent : (
            <Dialog
                open={open}
                onClose={onClose}
                fullWidth
                maxWidth="sm"
            >
                <DialogContent>
                    {emptyContent}
                </DialogContent>

                <DialogActions>
                    <Button onClick={onClose}>
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        );
    }

    /* =====================================================
       MANIFEST VALUES
    ===================================================== */

    const manifestNumber = getField(
        item,
        "manifestNumber",
        "ManifestNumber",
        "manifestNo",
        "ManifestNo"
    );

    const orderNumber = getField(
        item,
        "orderNumber",
        "OrderNumber",
        "orderNo",
        "OrderNo"
    );

    const status = getField(item, "status", "Status") || "Pending";

    const statusConfig = getStatusConfig(status);

    const customerName = getField(
        item,
        "customerName",
        "CustomerName",
        "consigneeName",
        "ConsigneeName"
    );

    const carrierName = getField(
        item,
        "carrierName",
        "CarrierName"
    );

    const trackingNumber = getField(
        item,
        "trackingNumber",
        "TrackingNumber"
    );

    const vehicleNumber = getField(
        item,
        "vehicleNumber",
        "VehicleNumber"
    );

    const driverName = getField(
        item,
        "driverName",
        "DriverName"
    );

    const driverContact = getField(
        item,
        "driverContact",
        "DriverContact"
    );

    const shipmentDate = getField(
        item,
        "shipmentDate",
        "ShipmentDate"
    );

    const expectedDeliveryDate = getField(
        item,
        "expectedDeliveryDate",
        "ExpectedDeliveryDate"
    );

    const actualDeliveryDate = getField(
        item,
        "actualDeliveryDate",
        "ActualDeliveryDate"
    );

    const origin = getField(item, "origin", "Origin");

    const destination = getField(
        item,
        "destination",
        "Destination"
    );

    const totalItems = getField(
        item,
        "totalItems",
        "TotalItems"
    );

    const totalQuantity = getField(
        item,
        "totalQuantity",
        "TotalQuantity"
    );

    const totalPackages = getField(
        item,
        "totalPackages",
        "TotalPackages"
    );

    const totalWeight = getField(
        item,
        "totalWeight",
        "TotalWeight"
    );

    const weightUnit = getField(
        item,
        "weightUnit",
        "WeightUnit"
    ) || "kg";

    const shippingCost = getField(
        item,
        "shippingCost",
        "ShippingCost"
    );

    const notes = getField(
        item,
        "notes",
        "Notes",
        "remarks",
        "Remarks"
    );

    const createdAt = getField(
        item,
        "createdAt",
        "CreatedAt",
        "createdDate",
        "CreatedDate"
    );

    const updatedAt = getField(
        item,
        "updatedAt",
        "UpdatedAt",
        "modifiedAt",
        "ModifiedAt"
    );

    /* =====================================================
       DETAILS CONTENT
    ===================================================== */

    const content = (
        <Box>
            {/* SUMMARY */}

            <Paper
                elevation={0}
                sx={{
                    p: 2.5,
                    mb: 3,
                    borderRadius: 2,
                    border: "1px solid",
                    borderColor: "divider",
                    bgcolor: "background.default"
                }}
            >
                <Stack
                    direction={{ xs: "column", sm: "row" }}
                    alignItems={{ xs: "flex-start", sm: "center" }}
                    justifyContent="space-between"
                    spacing={2}
                >
                    <Stack
                        direction="row"
                        spacing={1.5}
                        alignItems="center"
                    >
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

                        <Box>
                            <Typography
                                variant="h6"
                                fontWeight={700}
                            >
                                {manifestNumber || "Shipping Manifest"}
                            </Typography>

                            <Typography
                                variant="body2"
                                color="text.secondary"
                            >
                                Order: {orderNumber || "—"}
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

            {/* CUSTOMER AND CARRIER */}

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

                    <DetailField
                        label="Tracking Number"
                        value={trackingNumber}
                    />

                    <DetailField
                        label="Vehicle Number"
                        value={vehicleNumber}
                    />

                    <DetailField
                        label="Driver Name"
                        value={driverName}
                    />

                    <DetailField
                        label="Driver Contact"
                        value={driverContact}
                    />
                </Grid>
            </Box>

            <Divider sx={{ mb: 3 }} />

            {/* DATES */}

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

            {/* LOCATIONS */}

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

            {/* PACKAGE INFORMATION */}

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
                            totalWeight === ""
                                ? "—"
                                : `${formatNumber(totalWeight)} ${weightUnit}`
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

            {/* NOTES */}

            <Box sx={{ mb: 3 }}>
                <SectionHeader
                    icon={<Description />}
                    title="Notes and Remarks"
                />

                <Paper
                    elevation={0}
                    sx={{
                        p: 2,
                        bgcolor: "background.default",
                        border: "1px solid",
                        borderColor: "divider",
                        borderRadius: 2
                    }}
                >
                    <Typography
                        variant="body2"
                        sx={{ whiteSpace: "pre-wrap", overflowWrap: "anywhere" }}
                    >
                        {notes || "No additional notes available."}
                    </Typography>
                </Paper>
            </Box>

            {/* AUDIT INFORMATION */}

            {(createdAt || updatedAt) && (
                <>
                    <Divider sx={{ mb: 2 }} />

                    <Box>
                        <Typography
                            variant="subtitle2"
                            fontWeight={700}
                            sx={{ mb: 1 }}
                        >
                            Record Information
                        </Typography>

                        <Grid container spacing={1}>
                            {createdAt && (
                                <DetailField
                                    label="Created At"
                                    value={formatDate(createdAt)}
                                />
                            )}

                            {updatedAt && (
                                <DetailField
                                    label="Last Updated"
                                    value={formatDate(updatedAt)}
                                />
                            )}
                        </Grid>
                    </Box>
                </>
            )}
        </Box>
    );

    /* =====================================================
       EMBEDDED MODE
    ===================================================== */

    if (embedded) {
        return (
            <Box sx={{ width: "100%" }}>
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
            onClose={onClose}
            fullWidth
            maxWidth="md"
            scroll="paper"
            aria-labelledby="shipping-manifest-details-title"
        >
            <DialogTitle
                id="shipping-manifest-details-title"
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 2
                }}
            >
                <Stack
                    direction="row"
                    spacing={1}
                    alignItems="center"
                >
                    <LocalShipping color="primary" />

                    <Typography
                        variant="h6"
                        fontWeight={700}
                    >
                        Shipping Manifest Details
                    </Typography>
                </Stack>

                <IconButton
                    onClick={onClose}
                    aria-label="Close details"
                >
                    <Close />
                </IconButton>
            </DialogTitle>

            <Divider />

            <DialogContent sx={{ p: { xs: 2, sm: 3 } }}>
                {content}
            </DialogContent>

            <Divider />

            <DialogActions sx={{ px: 3, py: 2 }}>
                {typeof onEdit === "function" && (
                    <Button
                        variant="contained"
                        startIcon={<Edit />}
                        onClick={() => onEdit(item)}
                    >
                        Edit Manifest
                    </Button>
                )}

                <Button
                    variant="outlined"
                    color="inherit"
                    onClick={onClose}
                >
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    );
};

/* =========================================================
   EMPTY STATE
========================================================= */

const AlertFallback = () => (
    <Box sx={{ py: 4, textAlign: "center" }}>
        <LocalShipping
            sx={{
                fontSize: 48,
                color: "text.disabled",
                mb: 1
            }}
        />

        <Typography variant="h6" fontWeight={600}>
            No Manifest Selected
        </Typography>

        <Typography
            variant="body2"
            color="text.secondary"
        >
            Select a shipping manifest to view its details.
        </Typography>
    </Box>
);

export default ShippingManifestDetails;

