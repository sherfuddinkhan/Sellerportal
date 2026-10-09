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
    LocalShipping,
    Inventory2
} from "@mui/icons-material";

/* =========================================================
   SAFE FIELD ACCESS
========================================================= */

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

/* =========================================================
   FORMAT DATE
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
   FORMAT NUMBER
========================================================= */

const formatNumber = (value) => {
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

    return number.toLocaleString("en-IN");
};

/* =========================================================
   STATUS COLOR
========================================================= */

const getStatusColor = (status) => {
    const normalizedStatus = String(status || "")
        .trim()
        .toLowerCase()
        .replace(/[_-]+/g, " ");

    switch (normalizedStatus) {
        case "delivered":
        case "completed":
        case "approved":
            return "success";

        case "shipped":
        case "in transit":
            return "info";

        case "pending":
        case "processing":
        case "ready":
        case "packed":
            return "warning";

        case "cancelled":
        case "canceled":
        case "failed":
        case "rejected":
            return "error";

        default:
            return "default";
    }
};

/* =========================================================
   SHIPPING MANIFEST TABLE
========================================================= */

const ShippingManifestTable = ({
    manifests,
    data,
    loading = false,
    onView,
    onEdit,
    onDelete
}) => {
    const manifestList = Array.isArray(manifests)
        ? manifests
        : Array.isArray(data)
            ? data
            : [];

    /* =====================================================
       LOADING STATE
    ===================================================== */

    if (loading) {
        return (
            <Paper
                elevation={0}
                sx={{
                    p: 5,
                    border: "1px solid",
                    borderColor: "divider",
                    borderRadius: 2
                }}
            >
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: 2
                    }}
                >
                    <CircularProgress />

                    <Typography
                        variant="body2"
                        color="text.secondary"
                    >
                        Loading shipping manifests...
                    </Typography>
                </Box>
            </Paper>
        );
    }

    /* =====================================================
       EMPTY STATE
    ===================================================== */

    if (manifestList.length === 0) {
        return (
            <Paper
                elevation={0}
                sx={{
                    p: 5,
                    textAlign: "center",
                    border: "1px solid",
                    borderColor: "divider",
                    borderRadius: 2
                }}
            >
                <Inventory2
                    sx={{
                        fontSize: 48,
                        color: "text.disabled",
                        mb: 1
                    }}
                />

                <Typography
                    variant="h6"
                    fontWeight={600}
                    gutterBottom
                >
                    No Shipping Manifests Found
                </Typography>

                <Typography
                    variant="body2"
                    color="text.secondary"
                >
                    No shipping manifest records are available.
                </Typography>
            </Paper>
        );
    }

    /* =====================================================
       TABLE
    ===================================================== */

    return (
        <TableContainer
            component={Paper}
            elevation={0}
            sx={{
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 2,
                overflowX: "auto"
            }}
        >
            <Table
                sx={{ minWidth: 1050 }}
                aria-label="Shipping manifests table"
            >
                {/* TABLE HEADER */}

                <TableHead>
                    <TableRow
                        sx={{
                            bgcolor: "action.hover",
                            "& th": {
                                fontWeight: 700,
                                whiteSpace: "nowrap",
                                py: 2
                            }
                        }}
                    >
                        <TableCell>Manifest</TableCell>
                        <TableCell>Order Number</TableCell>
                        <TableCell>Customer / Consignee</TableCell>
                        <TableCell>Carrier</TableCell>
                        <TableCell>Tracking Number</TableCell>
                        <TableCell>Shipment Date</TableCell>
                        <TableCell>Delivery Date</TableCell>
                        <TableCell align="right">Quantity</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell align="center">Actions</TableCell>
                    </TableRow>
                </TableHead>

                {/* TABLE BODY */}

                <TableBody>
                    {manifestList.map((manifest, index) => {
                        const id = getField(
                            manifest,
                            "shippingManifestId",
                            "ShippingManifestId",
                            "manifestId",
                            "ManifestId",
                            "id",
                            "Id"
                        );

                        const manifestNumber = getField(
                            manifest,
                            "manifestNumber",
                            "ManifestNumber",
                            "shippingManifestNumber",
                            "ShippingManifestNumber"
                        );

                        const orderNumber = getField(
                            manifest,
                            "orderNumber",
                            "OrderNumber",
                            "salesOrderNumber",
                            "SalesOrderNumber"
                        );

                        const customerName = getField(
                            manifest,
                            "customerName",
                            "CustomerName",
                            "consigneeName",
                            "ConsigneeName",
                            "recipientName",
                            "RecipientName"
                        );

                        const carrierName = getField(
                            manifest,
                            "carrierName",
                            "CarrierName",
                            "shippingCarrier",
                            "ShippingCarrier",
                            "transportName",
                            "TransportName"
                        );

                        const trackingNumber = getField(
                            manifest,
                            "trackingNumber",
                            "TrackingNumber",
                            "trackingId",
                            "TrackingId"
                        );

                        const shipmentDate = getField(
                            manifest,
                            "shipmentDate",
                            "ShipmentDate",
                            "shippingDate",
                            "ShippingDate"
                        );

                        const deliveryDate = getField(
                            manifest,
                            "expectedDeliveryDate",
                            "ExpectedDeliveryDate",
                            "estimatedDeliveryDate",
                            "EstimatedDeliveryDate",
                            "actualDeliveryDate",
                            "ActualDeliveryDate"
                        );

                        const quantity = getField(
                            manifest,
                            "totalQuantity",
                            "TotalQuantity",
                            "quantity",
                            "Quantity"
                        );

                        const status = getField(
                            manifest,
                            "status",
                            "Status",
                            "manifestStatus",
                            "ManifestStatus"
                        );

                        const rowKey = id ?? manifestNumber ?? index;

                        return (
                            <TableRow
                                key={rowKey}
                                hover
                                sx={{
                                    "&:last-child td": {
                                        borderBottom: 0
                                    }
                                }}
                            >
                                {/* MANIFEST */}

                                <TableCell>
                                    <Stack
                                        direction="row"
                                        spacing={1.25}
                                        alignItems="center"
                                    >
                                        <Box
                                            sx={{
                                                width: 38,
                                                height: 38,
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                bgcolor: "primary.main",
                                                color: "primary.contrastText",
                                                borderRadius: 1.5,
                                                flexShrink: 0
                                            }}
                                        >
                                            <LocalShipping fontSize="small" />
                                        </Box>

                                        <Box sx={{ minWidth: 0 }}>
                                            <Typography
                                                variant="body2"
                                                fontWeight={700}
                                                sx={{
                                                    overflowWrap: "anywhere"
                                                }}
                                            >
                                                {manifestNumber ||
                                                    (id !== null
                                                        ? `Manifest #${id}`
                                                        : "—")}
                                            </Typography>

                                            {id !== null && (
                                                <Typography
                                                    variant="caption"
                                                    color="text.secondary"
                                                >
                                                    ID: {id}
                                                </Typography>
                                            )}
                                        </Box>
                                    </Stack>
                                </TableCell>

                                {/* ORDER NUMBER */}

                                <TableCell>
                                    <Typography
                                        variant="body2"
                                        fontWeight={500}
                                    >
                                        {orderNumber || "—"}
                                    </Typography>
                                </TableCell>

                                {/* CUSTOMER */}

                                <TableCell>
                                    <Typography
                                        variant="body2"
                                        sx={{
                                            maxWidth: 180,
                                            overflowWrap: "anywhere"
                                        }}
                                    >
                                        {customerName || "—"}
                                    </Typography>
                                </TableCell>

                                {/* CARRIER */}

                                <TableCell>
                                    <Typography
                                        variant="body2"
                                        sx={{
                                            maxWidth: 150,
                                            overflowWrap: "anywhere"
                                        }}
                                    >
                                        {carrierName || "—"}
                                    </Typography>
                                </TableCell>

                                {/* TRACKING NUMBER */}

                                <TableCell>
                                    <Typography
                                        variant="body2"
                                        sx={{
                                            maxWidth: 160,
                                            overflowWrap: "anywhere"
                                        }}
                                    >
                                        {trackingNumber || "—"}
                                    </Typography>
                                </TableCell>

                                {/* SHIPMENT DATE */}

                                <TableCell>
                                    <Typography
                                        variant="body2"
                                        sx={{ whiteSpace: "nowrap" }}
                                    >
                                        {formatDate(shipmentDate)}
                                    </Typography>
                                </TableCell>

                                {/* DELIVERY DATE */}

                                <TableCell>
                                    <Typography
                                        variant="body2"
                                        sx={{ whiteSpace: "nowrap" }}
                                    >
                                        {formatDate(deliveryDate)}
                                    </Typography>
                                </TableCell>

                                {/* QUANTITY */}

                                <TableCell align="right">
                                    <Typography
                                        variant="body2"
                                        fontWeight={600}
                                    >
                                        {formatNumber(quantity)}
                                    </Typography>
                                </TableCell>

                                {/* STATUS */}

                                <TableCell>
                                    <Chip
                                        label={status || "Unknown"}
                                        color={getStatusColor(status)}
                                        size="small"
                                        variant="outlined"
                                    />
                                </TableCell>

                                {/* ACTIONS */}

                                <TableCell align="center">
                                    <Stack
                                        direction="row"
                                        spacing={0.5}
                                        justifyContent="center"
                                    >
                                        <Tooltip title="View manifest">
                                            <IconButton
                                                size="small"
                                                color="info"
                                                aria-label="View manifest"
                                                onClick={() =>
                                                    onView?.(manifest)
                                                }
                                            >
                                                <Visibility fontSize="small" />
                                            </IconButton>
                                        </Tooltip>

                                        <Tooltip title="Edit manifest">
                                            <IconButton
                                                size="small"
                                                color="primary"
                                                aria-label="Edit manifest"
                                                onClick={() =>
                                                    onEdit?.(manifest)
                                                }
                                            >
                                                <Edit fontSize="small" />
                                            </IconButton>
                                        </Tooltip>

                                        <Tooltip title="Delete manifest">
                                            <IconButton
                                                size="small"
                                                color="error"
                                                aria-label="Delete manifest"
                                                onClick={() =>
                                                    onDelete?.(manifest)
                                                }
                                            >
                                                <Delete fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                    </Stack>
                                </TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default ShippingManifestTable;

