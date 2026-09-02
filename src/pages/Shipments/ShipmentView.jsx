// =========================================================
// ShipmentView.jsx
// Shipment Details View
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
    Divider,
    Chip,
    Box
} from "@mui/material";

// =========================================================
// COMPONENT
// =========================================================

const ShipmentView = ({
    open,
    item,
    onClose
}) => {

    // ---------------------------------------------------------
    // No item selected
    // ---------------------------------------------------------

    if (!item) {
        return null;
    }

    // ---------------------------------------------------------
    // Get value - supports camelCase + PascalCase
    // ---------------------------------------------------------

    const getValue = (
        camelCase,
        pascalCase
    ) => {

        return (
            item?.[camelCase] ??
            item?.[pascalCase] ??
            null
        );
    };

    // ---------------------------------------------------------
    // Status Color
    // ---------------------------------------------------------

    const getStatusColor = (status) => {

        switch (
            String(status || "")
                .toLowerCase()
                .trim()
        ) {

            case "pending":
                return "warning";

            case "processing":
                return "info";

            case "packed":
                return "secondary";

            case "shipped":
                return "primary";

            case "in transit":
                return "info";

            case "out for delivery":
                return "warning";

            case "delivered":
                return "success";

            case "cancelled":
                return "error";

            case "returned":
                return "error";

            default:
                return "default";
        }
    };

    // ---------------------------------------------------------
    // Format Date
    // ---------------------------------------------------------

    const formatDate = (date) => {

        if (!date) {
            return "-";
        }

        const parsedDate = new Date(date);

        if (Number.isNaN(parsedDate.getTime())) {
            return "-";
        }

        return parsedDate.toLocaleString(
            "en-IN",
            {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit"
            }
        );
    };

    // ---------------------------------------------------------
    // Shipment Values
    // ---------------------------------------------------------

    const shipmentId = getValue(
        "shipmentId",
        "ShipmentId"
    );

    const sellerId = getValue(
        "sellerId",
        "SellerId"
    );

    const customerId = getValue(
        "customerId",
        "CustomerId"
    );

    const orderId = getValue(
        "orderId",
        "OrderId"
    );

    const courierName = getValue(
        "courierName",
        "CourierName"
    );

    const trackingNumber = getValue(
        "trackingNumber",
        "TrackingNumber"
    );

    const shipmentDate = getValue(
        "shipmentDate",
        "ShipmentDate"
    );

    const deliveryDate = getValue(
        "deliveryDate",
        "DeliveryDate"
    );

    const shipmentStatus = getValue(
        "shipmentStatus",
        "ShipmentStatus"
    );

    // ---------------------------------------------------------
    // Field Component
    // ---------------------------------------------------------

    const Field = ({
        label,
        value
    }) => (

        <Grid
            item
            xs={12}
            md={6}
        >

            <Typography
                variant="caption"
                color="text.secondary"
                display="block"
                sx={{
                    mb: 0.5
                }}
            >
                {label}
            </Typography>

            <Typography
                variant="body1"
                fontWeight={500}
            >
                {
                    value !== null &&
                    value !== undefined &&
                    value !== ""
                        ? value
                        : "-"
                }
            </Typography>

        </Grid>
    );

    // ---------------------------------------------------------
    // RETURN
    // ---------------------------------------------------------

    return (

        <Dialog
            open={open}
            onClose={onClose}
            fullWidth
            maxWidth="md"
        >

            {/* =================================================
                TITLE
            ================================================= */}

            <DialogTitle>
                Shipment Details
            </DialogTitle>

            <Divider />

            {/* =================================================
                CONTENT
            ================================================= */}

            <DialogContent
                sx={{
                    mt: 2
                }}
            >

                <Grid
                    container
                    spacing={3}
                >

                    {/* Shipment ID */}

                    <Field
                        label="Shipment ID"
                        value={shipmentId}
                    />

                    {/* Seller ID */}

                    <Field
                        label="Seller ID"
                        value={sellerId}
                    />

                    {/* Customer ID */}

                    <Field
                        label="Customer ID"
                        value={customerId}
                    />

                    {/* Order ID */}

                    <Field
                        label="Order ID"
                        value={orderId}
                    />

                    {/* Courier */}

                    <Field
                        label="Courier Name"
                        value={courierName}
                    />

                    {/* Tracking */}

                    <Field
                        label="Tracking Number"
                        value={trackingNumber}
                    />

                    {/* Shipment Date */}

                    <Field
                        label="Shipment Date"
                        value={formatDate(shipmentDate)}
                    />

                    {/* Delivery Date */}

                    <Field
                        label="Delivery Date"
                        value={formatDate(deliveryDate)}
                    />

                    {/* Shipment Status */}

                    <Grid
                        item
                        xs={12}
                        md={6}
                    >

                        <Typography
                            variant="caption"
                            color="text.secondary"
                            display="block"
                            sx={{
                                mb: 0.8
                            }}
                        >
                            Shipment Status
                        </Typography>

                        <Chip
                            label={
                                shipmentStatus ||
                                "N/A"
                            }
                            color={
                                getStatusColor(
                                    shipmentStatus
                                )
                            }
                            size="small"
                        />

                    </Grid>

                </Grid>

                {/* =================================================
                    RAW INFORMATION
                ================================================= */}

                <Box
                    sx={{
                        mt: 4
                    }}
                >

                    <Divider sx={{ mb: 2 }} />

                    <Typography
                        variant="caption"
                        color="text.secondary"
                    >
                        Shipment information retrieved from the
                        server.
                    </Typography>

                </Box>

            </DialogContent>

            {/* =================================================
                ACTIONS
            ================================================= */}

            <DialogActions
                sx={{
                    px: 3,
                    pb: 2
                }}
            >

                <Button
                    variant="contained"
                    onClick={onClose}
                >
                    Close
                </Button>

            </DialogActions>

        </Dialog>
    );
};

// =========================================================
// EXPORT
// =========================================================

export default ShipmentView;
