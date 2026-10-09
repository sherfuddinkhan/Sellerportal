// ShippingManifestCard.jsx

import React from "react";

import {
    Box,
    Card,
    CardContent,
    CardActions,
    Typography,
    Chip,
    Button,
    Divider,
    Grid,
    Tooltip,
    IconButton,
    Stack
} from "@mui/material";

import {
    LocalShipping,
    Inventory2,
    Person,
    LocationOn,
    CalendarMonth,
    Visibility,
    Edit,
    Delete,
    ReceiptLong,
    Scale
} from "@mui/icons-material";

/* =========================================================
   FIELD HELPER
========================================================= */

const getField = (object, ...keys) => {
    for (const key of keys) {
        const value = object?.[key];

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

/* =========================================================
   FORMAT DATE
========================================================= */

const formatDate = (value) => {
    if (!value) {
        return "Not specified";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return "Not specified";
    }

    return date.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric"
    });
};

/* =========================================================
   FORMAT NUMBER
========================================================= */

const formatNumber = (value) => {
    const number = Number(value);

    if (!Number.isFinite(number)) {
        return "0";
    }

    return number.toLocaleString("en-IN", {
        maximumFractionDigits: 2
    });
};

/* =========================================================
   FORMAT CURRENCY
========================================================= */

const formatCurrency = (value) => {
    const amount = Number(value);

    if (!Number.isFinite(amount)) {
        return "₹ 0.00";
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
    const normalized = String(status ?? "Pending")
        .trim()
        .toLowerCase()
        .replace(/[_-]+/g, " ");

    const statusMap = {
        pending: {
            label: "Pending",
            color: "warning"
        },
        processing: {
            label: "Processing",
            color: "info"
        },
        ready: {
            label: "Ready",
            color: "info"
        },
        packed: {
            label: "Packed",
            color: "info"
        },
        shipped: {
            label: "Shipped",
            color: "primary"
        },
        "in transit": {
            label: "In Transit",
            color: "secondary"
        },
        delivered: {
            label: "Delivered",
            color: "success"
        },
        cancelled: {
            label: "Cancelled",
            color: "error"
        },
        failed: {
            label: "Failed",
            color: "error"
        },
        returned: {
            label: "Returned",
            color: "warning"
        }
    };

    return (
        statusMap[normalized] ?? {
            label: status || "Pending",
            color: "default"
        }
    );
};

/* =========================================================
   INFORMATION ROW
========================================================= */

const InfoRow = ({
    icon,
    label,
    value,
    valueColor = "text.primary"
}) => (
    <Box
        sx={{
            display: "flex",
            alignItems: "flex-start",
            gap: 1.25,
            minWidth: 0
        }}
    >
        <Box
            sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "text.secondary",
                mt: 0.25
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
                variant="body2"
                fontWeight={600}
                color={valueColor}
                sx={{
                    overflowWrap: "anywhere"
                }}
            >
                {value || "—"}
            </Typography>
        </Box>
    </Box>
);

/* =========================================================
   SHIPPING MANIFEST CARD
========================================================= */

const ShippingManifestCard = ({
    manifest,
    record,
    data,

    onView,
    onEdit,
    onDelete,

    loading = false,
    disabled = false,

    showView = true,
    showEdit = true,
    showDelete = true,

    compact = false,
    elevation = 2
}) => {
    const item = manifest ?? record ?? data ?? {};

    /* =====================================================
       MANIFEST DETAILS
    ===================================================== */

    const manifestId = getField(
        item,
        "shippingManifestId",
        "ShippingManifestId",
        "manifestId",
        "ManifestId",
        "id",
        "Id"
    );

    const manifestNumber = getField(
        item,
        "manifestNumber",
        "ManifestNumber",
        "shippingManifestNumber",
        "ShippingManifestNumber"
    ) ?? (manifestId != null
        ? `MAN-${manifestId}`
        : "Unassigned");

    const orderNumber = getField(
        item,
        "orderNumber",
        "OrderNumber",
        "salesOrderNumber",
        "SalesOrderNumber",
        "purchaseOrderNumber",
        "PurchaseOrderNumber"
    );

    const customerName = getField(
        item,
        "customerName",
        "CustomerName",
        "customer",
        "Customer",
        "recipientName",
        "RecipientName"
    );

    const carrierName = getField(
        item,
        "carrierName",
        "CarrierName",
        "shippingCarrier",
        "ShippingCarrier",
        "carrier",
        "Carrier"
    );

    const trackingNumber = getField(
        item,
        "trackingNumber",
        "TrackingNumber",
        "trackingCode",
        "TrackingCode"
    );

    const vehicleNumber = getField(
        item,
        "vehicleNumber",
        "VehicleNumber",
        "vehicleRegistrationNumber",
        "VehicleRegistrationNumber"
    );

    const driverName = getField(
        item,
        "driverName",
        "DriverName"
    );

    const shipmentDate = getField(
        item,
        "shipmentDate",
        "ShipmentDate",
        "shippingDate",
        "ShippingDate"
    );

    const expectedDeliveryDate = getField(
        item,
        "expectedDeliveryDate",
        "ExpectedDeliveryDate",
        "estimatedDeliveryDate",
        "EstimatedDeliveryDate"
    );

    const actualDeliveryDate = getField(
        item,
        "actualDeliveryDate",
        "ActualDeliveryDate",
        "deliveredDate",
        "DeliveredDate"
    );

    const origin = getField(
        item,
        "origin",
        "Origin",
        "sourceLocation",
        "SourceLocation",
        "fromAddress",
        "FromAddress"
    );

    const destination = getField(
        item,
        "destination",
        "Destination",
        "destinationLocation",
        "DestinationLocation",
        "deliveryAddress",
        "DeliveryAddress"
    );

    const totalItems = getField(
        item,
        "totalItems",
        "TotalItems",
        "itemCount",
        "ItemCount"
    );

    const totalQuantity = getField(
        item,
        "totalQuantity",
        "TotalQuantity",
        "quantity",
        "Quantity"
    );

    const totalPackages = getField(
        item,
        "totalPackages",
        "TotalPackages",
        "packageCount",
        "PackageCount"
    );

    const totalWeight = getField(
        item,
        "totalWeight",
        "TotalWeight",
        "weight",
        "Weight"
    );

    const weightUnit = getField(
        item,
        "weightUnit",
        "WeightUnit"
    ) ?? "kg";

    const shippingCost = getField(
        item,
        "shippingCost",
        "ShippingCost",
        "freightCost",
        "FreightCost"
    );

    const status = getField(
        item,
        "status",
        "Status",
        "shipmentStatus",
        "ShipmentStatus"
    ) ?? "Pending";

    const statusConfig = getStatusConfig(status);

    /* =====================================================
       ACTION HANDLERS
    ===================================================== */

    const handleView = () => {
        if (!disabled && !loading && onView) {
            onView(item);
        }
    };

    const handleEdit = () => {
        if (!disabled && !loading && onEdit) {
            onEdit(item);
        }
    };

    const handleDelete = () => {
        if (!disabled && !loading && onDelete) {
            onDelete(item);
        }
    };

    /* =====================================================
       RENDER
    ===================================================== */

    return (
        <Card
            elevation={elevation}
            sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                borderRadius: 3,
                border: "1px solid",
                borderColor: "divider",
                transition: "box-shadow 0.2s ease, transform 0.2s ease",
                "&:hover": {
                    boxShadow: 5,
                    transform: "translateY(-2px)"
                }
            }}
        >
            {/* CARD HEADER */}

            <Box
                sx={{
                    px: 2,
                    py: 2,
                    display: "flex",
                    alignItems: "flex-start",
                    justifyContent: "space-between",
                    gap: 1.5,
                    bgcolor: "action.hover"
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
                    <Box
                        sx={{
                            width: 44,
                            height: 44,
                            flexShrink: 0,
                            borderRadius: 2,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            bgcolor: "primary.main",
                            color: "primary.contrastText"
                        }}
                    >
                        <LocalShipping />
                    </Box>

                    <Box sx={{ minWidth: 0 }}>
                        <Typography
                            variant="subtitle1"
                            fontWeight={700}
                            noWrap
                        >
                            {manifestNumber}
                        </Typography>

                        <Typography
                            variant="caption"
                            color="text.secondary"
                            display="block"
                        >
                            {orderNumber
                                ? `Order: ${orderNumber}`
                                : "No order number"}
                        </Typography>
                    </Box>
                </Box>

                <Chip
                    label={statusConfig.label}
                    color={statusConfig.color}
                    size="small"
                    sx={{
                        fontWeight: 700,
                        flexShrink: 0
                    }}
                />
            </Box>

            <Divider />

            {/* CARD CONTENT */}

            <CardContent
                sx={{
                    p: 2,
                    flexGrow: 1,
                    "&:last-child": {
                        pb: 2
                    }
                }}
            >
                <Stack spacing={2}>
                    {/* CUSTOMER AND CARRIER */}

                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <InfoRow
                                icon={<Person fontSize="small" />}
                                label="Customer / Recipient"
                                value={customerName}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <InfoRow
                                icon={
                                    <LocalShipping fontSize="small" />
                                }
                                label="Carrier"
                                value={carrierName}
                            />
                        </Grid>
                    </Grid>

                    {/* TRACKING */}

                    <Box
                        sx={{
                            p: 1.5,
                            borderRadius: 2,
                            bgcolor: "action.hover"
                        }}
                    >
                        <Typography
                            variant="caption"
                            color="text.secondary"
                        >
                            Tracking Number
                        </Typography>

                        <Typography
                            variant="body2"
                            fontWeight={700}
                            sx={{
                                overflowWrap: "anywhere"
                            }}
                        >
                            {trackingNumber || "Not assigned"}
                        </Typography>
                    </Box>

                    {!compact && (
                        <>
                            {/* DELIVERY ROUTE */}

                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={6}>
                                    <InfoRow
                                        icon={
                                            <LocationOn fontSize="small" />
                                        }
                                        label="Origin"
                                        value={origin}
                                    />
                                </Grid>

                                <Grid item xs={12} sm={6}>
                                    <InfoRow
                                        icon={
                                            <LocationOn fontSize="small" />
                                        }
                                        label="Destination"
                                        value={destination}
                                    />
                                </Grid>
                            </Grid>

                            <Divider />

                            {/* DATES */}

                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={6}>
                                    <InfoRow
                                        icon={
                                            <CalendarMonth fontSize="small" />
                                        }
                                        label="Shipment Date"
                                        value={formatDate(shipmentDate)}
                                    />
                                </Grid>

                                <Grid item xs={12} sm={6}>
                                    <InfoRow
                                        icon={
                                            <CalendarMonth fontSize="small" />
                                        }
                                        label="Expected Delivery"
                                        value={formatDate(
                                            expectedDeliveryDate
                                        )}
                                    />
                                </Grid>
                            </Grid>

                            {actualDeliveryDate && (
                                <InfoRow
                                    icon={
                                        <CalendarMonth fontSize="small" />
                                    }
                                    label="Actual Delivery"
                                    value={formatDate(
                                        actualDeliveryDate
                                    )}
                                />
                            )}

                            <Divider />

                            {/* PACKAGE SUMMARY */}

                            <Grid container spacing={2}>
                                <Grid item xs={4}>
                                    <InfoRow
                                        icon={
                                            <Inventory2 fontSize="small" />
                                        }
                                        label="Items"
                                        value={
                                            totalItems != null
                                                ? formatNumber(totalItems)
                                                : "—"
                                        }
                                    />
                                </Grid>

                                <Grid item xs={4}>
                                    <InfoRow
                                        icon={
                                            <Inventory2 fontSize="small" />
                                        }
                                        label="Quantity"
                                        value={
                                            totalQuantity != null
                                                ? formatNumber(totalQuantity)
                                                : "—"
                                        }
                                    />
                                </Grid>

                                <Grid item xs={4}>
                                    <InfoRow
                                        icon={
                                            <Scale fontSize="small" />
                                        }
                                        label="Weight"
                                        value={
                                            totalWeight != null
                                                ? `${formatNumber(
                                                    totalWeight
                                                )} ${weightUnit}`
                                                : "—"
                                        }
                                    />
                                </Grid>
                            </Grid>

                            {totalPackages != null && (
                                <InfoRow
                                    icon={
                                        <Inventory2 fontSize="small" />
                                    }
                                    label="Total Packages"
                                    value={formatNumber(totalPackages)}
                                />
                            )}

                            {/* VEHICLE AND DRIVER */}

                            {(vehicleNumber || driverName) && (
                                <>
                                    <Divider />

                                    <Grid container spacing={2}>
                                        {vehicleNumber && (
                                            <Grid item xs={12} sm={6}>
                                                <InfoRow
                                                    icon={
                                                        <LocalShipping
                                                            fontSize="small"
                                                        />
                                                    }
                                                    label="Vehicle Number"
                                                    value={vehicleNumber}
                                                />
                                            </Grid>
                                        )}

                                        {driverName && (
                                            <Grid item xs={12} sm={6}>
                                                <InfoRow
                                                    icon={
                                                        <Person
                                                            fontSize="small"
                                                        />
                                                    }
                                                    label="Driver"
                                                    value={driverName}
                                                />
                                            </Grid>
                                        )}
                                    </Grid>
                                </>
                            )}
                        </>
                    )}

                    {/* SHIPPING COST */}

                    {shippingCost != null && (
                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                gap: 1,
                                pt: 1
                            }}
                        >
                            <Typography
                                variant="body2"
                                color="text.secondary"
                            >
                                Shipping Cost
                            </Typography>

                            <Typography
                                variant="subtitle1"
                                fontWeight={800}
                                color="primary.main"
                            >
                                {formatCurrency(shippingCost)}
                            </Typography>
                        </Box>
                    )}
                </Stack>
            </CardContent>

            <Divider />

            {/* CARD ACTIONS */}

            <CardActions
                sx={{
                    px: 2,
                    py: 1.5,
                    display: "flex",
                    justifyContent: "space-between",
                    gap: 1,
                    flexWrap: "wrap"
                }}
            >
                <Box
                    sx={{
                        display: "flex",
                        gap: 0.5
                    }}
                >
                    {showView && (
                        <Tooltip title="View manifest">
                            <span>
                                <IconButton
                                    color="info"
                                    onClick={handleView}
                                    disabled={
                                        disabled ||
                                        loading ||
                                        !onView
                                    }
                                    size="small"
                                    aria-label="View shipping manifest"
                                >
                                    <Visibility />
                                </IconButton>
                            </span>
                        </Tooltip>
                    )}

                    {showEdit && (
                        <Tooltip title="Edit manifest">
                            <span>
                                <IconButton
                                    color="primary"
                                    onClick={handleEdit}
                                    disabled={
                                        disabled ||
                                        loading ||
                                        !onEdit
                                    }
                                    size="small"
                                    aria-label="Edit shipping manifest"
                                >
                                    <Edit />
                                </IconButton>
                            </span>
                        </Tooltip>
                    )}

                    {showDelete && (
                        <Tooltip title="Delete manifest">
                            <span>
                                <IconButton
                                    color="error"
                                    onClick={handleDelete}
                                    disabled={
                                        disabled ||
                                        loading ||
                                        !onDelete
                                    }
                                    size="small"
                                    aria-label="Delete shipping manifest"
                                >
                                    <Delete />
                                </IconButton>
                            </span>
                        </Tooltip>
                    )}
                </Box>

                {showView && (
                    <Button
                        size="small"
                        variant="outlined"
                        startIcon={<ReceiptLong />}
                        onClick={handleView}
                        disabled={
                            disabled ||
                            loading ||
                            !onView
                        }
                    >
                        View Details
                    </Button>
                )}
            </CardActions>
        </Card>
    );
};

export default ShippingManifestCard;

