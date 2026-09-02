// =========================================================
// DeleteShipmentDialog.jsx
// Delete Shipment Confirmation Dialog
// =========================================================

import React from "react";

import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    Divider,
    Stack
} from "@mui/material";

// =========================================================
// COMPONENT
// =========================================================

const DeleteShipmentDialog = ({
    open,
    item,
    onClose,
    onDeleted
}) => {

    // =====================================================
    // NO ITEM
    // =====================================================

    if (!item) {
        return null;
    }

    // =====================================================
    // SUPPORT camelCase + PascalCase
    // =====================================================

    const shipmentId =
        item.shipmentId ??
        item.ShipmentId ??
        0;

    const sellerId =
        item.sellerId ??
        item.SellerId ??
        "-";

    const customerId =
        item.customerId ??
        item.CustomerId ??
        "-";

    const orderId =
        item.orderId ??
        item.OrderId ??
        "-";

    const courierName =
        item.courierName ??
        item.CourierName ??
        "-";

    const trackingNumber =
        item.trackingNumber ??
        item.TrackingNumber ??
        "-";

    const shipmentStatus =
        item.shipmentStatus ??
        item.ShipmentStatus ??
        "-";

    const shipmentDate =
        item.shipmentDate ??
        item.ShipmentDate ??
        null;

    // =====================================================
    // FORMAT DATE
    // =====================================================

    const formatDate = (date) => {

        if (!date) {
            return "-";
        }

        const parsedDate = new Date(date);

        if (Number.isNaN(parsedDate.getTime())) {
            return "-";
        }

        return parsedDate.toLocaleString("en-IN");
    };

    // =====================================================
    // DELETE HANDLER
    // =====================================================

    const handleDelete = () => {

        if (!shipmentId) {
            return;
        }

        if (typeof onDeleted === "function") {
            onDeleted(Number(shipmentId));
        }
    };

    // =====================================================
    // RENDER
    // =====================================================

    return (
        <Dialog
            open={Boolean(open)}
            onClose={onClose}
            fullWidth
            maxWidth="sm"
        >

            {/* =================================================
                TITLE
            ================================================= */}

            <DialogTitle>
                Delete Shipment
            </DialogTitle>

            <Divider />

            {/* =================================================
                CONTENT
            ================================================= */}

            <DialogContent sx={{ mt: 2 }}>

                <Stack spacing={1}>

                    <Typography>
                        Are you sure you want to delete this shipment?
                    </Typography>

                    {/* Shipment ID */}

                    <Typography
                        sx={{ mt: 1 }}
                        fontWeight="bold"
                    >
                        Shipment ID:{" "}
                        {shipmentId}
                    </Typography>

                    {/* Seller ID */}

                    <Typography>
                        Seller ID:{" "}
                        {sellerId}
                    </Typography>

                    {/* Customer ID */}

                    <Typography>
                        Customer ID:{" "}
                        {customerId}
                    </Typography>

                    {/* Order ID */}

                    <Typography>
                        Order ID:{" "}
                        {orderId}
                    </Typography>

                    {/* Courier */}

                    <Typography>
                        Courier:{" "}
                        {courierName}
                    </Typography>

                    {/* Tracking */}

                    <Typography>
                        Tracking Number:{" "}
                        {trackingNumber}
                    </Typography>

                    {/* Status */}

                    <Typography>
                        Status:{" "}
                        {shipmentStatus}
                    </Typography>

                    {/* Shipment Date */}

                    <Typography>
                        Shipment Date:{" "}
                        {formatDate(shipmentDate)}
                    </Typography>

                </Stack>

            </DialogContent>

            {/* =================================================
                ACTIONS
            ================================================= */}

            <DialogActions sx={{ px: 3, pb: 2 }}>

                <Button
                    variant="outlined"
                    onClick={onClose}
                >
                    Cancel
                </Button>

                <Button
                    variant="contained"
                    color="error"
                    onClick={handleDelete}
                    disabled={!shipmentId}
                >
                    Delete
                </Button>

            </DialogActions>

        </Dialog>
    );
};

// =========================================================
// EXPORT
// =========================================================

export default DeleteShipmentDialog;
