// =========================================================
// ShippingManifestView.jsx
// =========================================================

import React from "react";

import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Grid,
    Typography,
    Box,
    Divider,
    Chip,
    IconButton,
    CircularProgress
} from "@mui/material";

import {
    Close,
    LocalShipping,
    Inventory2
} from "@mui/icons-material";

// =========================================================
// SAFE FIELD ACCESS
// =========================================================

const getField = (record, ...keys) => {
    if (!record) return null;

    for (const key of keys) {
        const value = record[key];

        if (
            value !== undefined &&
            value !== null &&
            value !== ""
        ) {
            return value;
        }
    }

    return null;
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
// FORMAT NUMBER
// =========================================================

const formatNumber = (value) => {
    if (value === null || value === undefined || value === "") {
        return "—";
    }

    const number = Number(value);

    return Number.isFinite(number)
        ? number.toLocaleString("en-IN")
        : String(value);
};

// =========================================================
// FORMAT CURRENCY
// =========================================================

const formatCurrency = (value) => {
    if (value === null || value === undefined || value === "") {
        return "—";
    }

    const amount = Number(value);

    if (!Number.isFinite(amount)) {
        return String(value);
    }

    return amount.toLocaleString("en-IN", {
        style: "currency",
        currency: "INR",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
};

// =========================================================
// STATUS COLOR
// =========================================================

const getStatusColor = (status) => {
    const normalized = String(status || "")
        .trim()
        .toLowerCase();

    if (["delivered", "completed"].includes(normalized)) {
        return "success";
    }

    if (["shipped", "in transit"].includes(normalized)) {
        return "info";
    }

    if (["cancelled", "canceled", "failed", "rejected"].includes(normalized)) {
        return "error";
    }

    if (["processing", "ready", "packed"].includes(normalized)) {
        return "warning";
    }

    return "default";
};

// =========================================================
// INFORMATION FIELD
// =========================================================

const InfoField = ({ label, value }) => (
    <Grid item xs={12} sm={6}>
        <Box
            sx={{
                p: 1.5,
                height: "100%",
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 1.5
            }}
        >
            <Typography
                variant="caption"
                color="text.secondary"
                display="block"
                sx={{ mb: 0.5 }}
            >
                {label}
            </Typography>

            <Typography
                variant="body2"
                fontWeight={600}
                sx={{
                    overflowWrap: "anywhere",
                    whiteSpace: "pre-wrap"
                }}
            >
                {value === null ||
                value === undefined ||
                value === ""
                    ? "—"
                    : String(value)}
            </Typography>
        </Box>
    </Grid>
);

// =========================================================
// SHIPPING MANIFEST VIEW
// =========================================================

const ShippingManifestView = ({
    open = false,
    onClose,
    manifest = null
}) => {
    if (!manifest && !open) {
        return null;
    }

    const manifestNumber = getField(
        manifest,
        "manifestNumber",
        "ManifestNumber",
        "shippingManifestNumber",
        "ShippingManifestNumber"
    );

    const manifestId = getField(
        manifest,
        "shippingManifestId",
        "ShippingManifestId",
        "manifestId",
        "ManifestId",
        "id",
        "Id"
    );

    const status = getField(
        manifest,
        "status",
        "Status",
        "manifestStatus",
        "ManifestStatus"
    );

    const quantity = getField(
        manifest,
        "totalQuantity",
        "TotalQuantity",
        "quantity",
        "Quantity"
    );

    const weight = getField(
        manifest,
        "totalWeight",
        "TotalWeight"
    );

    const weightUnit = getField(
        manifest,
        "weightUnit",
        "WeightUnit"
    );

    const notes = getField(
        manifest,
        "notes",
        "Notes",
        "remarks",
        "Remarks"
    );

    return (
        <Dialog
            open={open}
            onClose={onClose}
            fullWidth
            maxWidth="md"
            scroll="paper"
        >
            {/* HEADER */}

            <DialogTitle
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 2
                }}
            >
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1.5,
                        minWidth: 0
                    }}
                >
                    <Inventory2
                        color="primary"
                        sx={{ fontSize: 30 }}
                    />

                    <Box sx={{ minWidth: 0 }}>
                        <Typography variant="h6" fontWeight={700}>
                            Shipping Manifest Details
                        </Typography>

                        <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ overflowWrap: "anywhere" }}
                        >
                            {manifestNumber ||
                                (manifestId !== null
                                    ? `Manifest #${manifestId}`
                                    : "Manifest information")}
                        </Typography>
                    </Box>
                </Box>

                <IconButton
                    onClick={onClose}
                    aria-label="Close manifest details"
                >
                    <Close />
                </IconButton>
            </DialogTitle>

            <Divider />

            {/* CONTENT */}

            <DialogContent sx={{ pt: 3 }}>
                {!manifest ? (
                    <Box
                        sx={{
                            py: 5,
                            display: "flex",
                            justifyContent: "center"
                        }}
                    >
                        <CircularProgress />
                    </Box>
                ) : (
                    <>
                        {/* STATUS */}

                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                flexWrap: "wrap",
                                gap: 1,
                                mb: 3
                            }}
                        >
                            <Chip
                                label={status || "Unknown"}
                                color={getStatusColor(status)}
                                size="medium"
                            />

                            {manifestId !== null && (
                                <Chip
                                    label={`ID: ${manifestId}`}
                                    variant="outlined"
                                    size="medium"
                                />
                            )}
                        </Box>

                        {/* MANIFEST INFORMATION */}

                        <Typography
                            variant="subtitle1"
                            fontWeight={700}
                            sx={{ mb: 1.5 }}
                        >
                            Manifest Information
                        </Typography>

                        <Grid container spacing={1.5}>
                            <InfoField
                                label="Manifest Number"
                                value={manifestNumber}
                            />

                            <InfoField
                                label="Order Number"
                                value={getField(
                                    manifest,
                                    "orderNumber",
                                    "OrderNumber",
                                    "salesOrderNumber",
                                    "SalesOrderNumber"
                                )}
                            />

                            <InfoField
                                label="Customer / Consignee"
                                value={getField(
                                    manifest,
                                    "customerName",
                                    "CustomerName",
                                    "consigneeName",
                                    "ConsigneeName"
                                )}
                            />

                            <InfoField
                                label="Carrier / Transporter"
                                value={getField(
                                    manifest,
                                    "carrierName",
                                    "CarrierName",
                                    "shippingCarrier",
                                    "ShippingCarrier",
                                    "transportName",
                                    "TransportName"
                                )}
                            />

                            <InfoField
                                label="Tracking Number"
                                value={getField(
                                    manifest,
                                    "trackingNumber",
                                    "TrackingNumber",
                                    "trackingId",
                                    "TrackingId"
                                )}
                            />

                            <InfoField
                                label="Vehicle Number"
                                value={getField(
                                    manifest,
                                    "vehicleNumber",
                                    "VehicleNumber"
                                )}
                            />

                            <InfoField
                                label="Driver Name"
                                value={getField(
                                    manifest,
                                    "driverName",
                                    "DriverName"
                                )}
                            />

                            <InfoField
                                label="Driver Contact"
                                value={getField(
                                    manifest,
                                    "driverContact",
                                    "DriverContact"
                                )}
                            />
                        </Grid>

                        <Divider sx={{ my: 3 }} />

                        {/* DELIVERY INFORMATION */}

                        <Typography
                            variant="subtitle1"
                            fontWeight={700}
                            sx={{ mb: 1.5 }}
                        >
                            Shipment and Delivery
                        </Typography>

                        <Grid container spacing={1.5}>
                            <InfoField
                                label="Shipment Date"
                                value={formatDate(
                                    getField(
                                        manifest,
                                        "shipmentDate",
                                        "ShipmentDate"
                                    )
                                )}
                            />

                            <InfoField
                                label="Expected Delivery Date"
                                value={formatDate(
                                    getField(
                                        manifest,
                                        "expectedDeliveryDate",
                                        "ExpectedDeliveryDate"
                                    )
                                )}
                            />

                            <InfoField
                                label="Actual Delivery Date"
                                value={formatDate(
                                    getField(
                                        manifest,
                                        "actualDeliveryDate",
                                        "ActualDeliveryDate"
                                    )
                                )}
                            />

                            <InfoField
                                label="Origin / Dispatch Location"
                                value={getField(
                                    manifest,
                                    "origin",
                                    "Origin"
                                )}
                            />

                            <InfoField
                                label="Destination / Delivery Location"
                                value={getField(
                                    manifest,
                                    "destination",
                                    "Destination"
                                )}
                            />
                        </Grid>

                        <Divider sx={{ my: 3 }} />

                        {/* QUANTITY AND COST */}

                        <Typography
                            variant="subtitle1"
                            fontWeight={700}
                            sx={{ mb: 1.5 }}
                        >
                            Quantity, Weight and Cost
                        </Typography>

                        <Grid container spacing={1.5}>
                            <InfoField
                                label="Total Items"
                                value={formatNumber(
                                    getField(
                                        manifest,
                                        "totalItems",
                                        "TotalItems"
                                    )
                                )}
                            />

                            <InfoField
                                label="Total Quantity"
                                value={formatNumber(quantity)}
                            />

                            <InfoField
                                label="Total Packages"
                                value={formatNumber(
                                    getField(
                                        manifest,
                                        "totalPackages",
                                        "TotalPackages"
                                    )
                                )}
                            />

                            <InfoField
                                label="Total Weight"
                                value={
                                    weight === null
                                        ? "—"
                                        : `${formatNumber(weight)}${
                                              weightUnit
                                                  ? ` ${weightUnit}`
                                                  : ""
                                          }`
                                }
                            />

                            <InfoField
                                label="Shipping Cost"
                                value={formatCurrency(
                                    getField(
                                        manifest,
                                        "shippingCost",
                                        "ShippingCost"
                                    )
                                )}
                            />
                        </Grid>

                        {/* NOTES */}

                        <Divider sx={{ my: 3 }} />

                        <Typography
                            variant="subtitle1"
                            fontWeight={700}
                            sx={{ mb: 1.5 }}
                        >
                            Notes / Remarks
                        </Typography>

                        <Box
                            sx={{
                                p: 2,
                                border: "1px solid",
                                borderColor: "divider",
                                borderRadius: 1.5,
                                minHeight: 65
                            }}
                        >
                            <Typography
                                variant="body2"
                                sx={{ whiteSpace: "pre-wrap" }}
                            >
                                {notes || "No notes available."}
                            </Typography>
                        </Box>
                    </>
                )}
            </DialogContent>

            <Divider />

            {/* ACTIONS */}

            <DialogActions sx={{ p: 2 }}>
                <Button
                    variant="contained"
                    startIcon={<Close />}
                    onClick={onClose}
                >
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    );
};

// =========================================================
// DEFAULT EXPORT
// =========================================================

export default ShippingManifestView;

