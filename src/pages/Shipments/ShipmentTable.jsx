// =========================================================
// ShipmentTable.jsx
// Shipment Table
// =========================================================

import React from "react";

import {
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    IconButton,
    Tooltip,
    CircularProgress,
    Typography,
    Box,
    Chip
} from "@mui/material";

import {
    Visibility,
    Edit,
    Delete
} from "@mui/icons-material";


// =========================================================
// COMPONENT
// =========================================================

const ShipmentTable = ({
    items = [],
    loading,
    onView,
    onEdit,
    onDelete
}) => {

    // =====================================================
    // GET VALUE
    // Supports camelCase + PascalCase
    // =====================================================

    const getValue = (row, camelCase, pascalCase) => {

        return (
            row?.[camelCase] ??
            row?.[pascalCase] ??
            null
        );

    };


    // =====================================================
    // STATUS COLOR
    // =====================================================

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


    // =====================================================
    // FORMAT DATE
    // =====================================================

    const formatDate = (date) => {

        if (!date) {
            return "-";
        }

        const parsedDate =
            new Date(date);

        if (
            Number.isNaN(
                parsedDate.getTime()
            )
        ) {
            return "-";
        }

        return parsedDate.toLocaleDateString(
            "en-IN",
            {
                day: "2-digit",
                month: "2-digit",
                year: "numeric"
            }
        );

    };


    // =====================================================
    // LOADING
    // =====================================================

    if (loading) {

        return (

            <Paper
                sx={{
                    p: 5,
                    mt: 2
                }}
            >

                <Box
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                    justifyContent="center"
                    gap={2}
                >

                    <CircularProgress />

                    <Typography
                        color="text.secondary"
                    >
                        Loading Shipments...
                    </Typography>

                </Box>

            </Paper>

        );

    }


    // =====================================================
    // EMPTY
    // =====================================================

    if (!items || items.length === 0) {

        return (

            <Paper
                sx={{
                    p: 4,
                    mt: 2
                }}
            >

                <Typography
                    align="center"
                    color="text.secondary"
                >
                    No Shipments Found
                </Typography>

            </Paper>

        );

    }


    // =====================================================
    // RENDER
    // =====================================================

    return (

        <TableContainer
            component={Paper}
            sx={{
                mt: 2,
                overflowX: "auto"
            }}
        >

            <Table
                size="small"
                sx={{
                    minWidth: 1100
                }}
            >

                {/* =================================================
                    TABLE HEAD
                ================================================= */}

                <TableHead>

                    <TableRow>

                        <TableCell>
                            <strong>
                                Shipment ID
                            </strong>
                        </TableCell>

                        <TableCell>
                            <strong>
                                Seller ID
                            </strong>
                        </TableCell>

                        <TableCell>
                            <strong>
                                Customer ID
                            </strong>
                        </TableCell>

                        <TableCell>
                            <strong>
                                Order ID
                            </strong>
                        </TableCell>

                        <TableCell>
                            <strong>
                                Courier Name
                            </strong>
                        </TableCell>

                        <TableCell>
                            <strong>
                                Tracking Number
                            </strong>
                        </TableCell>

                        <TableCell>
                            <strong>
                                Shipment Date
                            </strong>
                        </TableCell>

                        <TableCell>
                            <strong>
                                Delivery Date
                            </strong>
                        </TableCell>

                        <TableCell>
                            <strong>
                                Status
                            </strong>
                        </TableCell>

                        <TableCell
                            align="center"
                        >
                            <strong>
                                Actions
                            </strong>
                        </TableCell>

                    </TableRow>

                </TableHead>


                {/* =================================================
                    TABLE BODY
                ================================================= */}

                <TableBody>

                    {items.map((row, index) => {

                        // =================================================
                        // VALUES
                        // =================================================

                        const shipmentId =
                            getValue(
                                row,
                                "shipmentId",
                                "ShipmentId"
                            );

                        const sellerId =
                            getValue(
                                row,
                                "sellerId",
                                "SellerId"
                            );

                        const customerId =
                            getValue(
                                row,
                                "customerId",
                                "CustomerId"
                            );

                        const orderId =
                            getValue(
                                row,
                                "orderId",
                                "OrderId"
                            );

                        const courierName =
                            getValue(
                                row,
                                "courierName",
                                "CourierName"
                            );

                        const trackingNumber =
                            getValue(
                                row,
                                "trackingNumber",
                                "TrackingNumber"
                            );

                        const shipmentDate =
                            getValue(
                                row,
                                "shipmentDate",
                                "ShipmentDate"
                            );

                        const deliveryDate =
                            getValue(
                                row,
                                "deliveryDate",
                                "DeliveryDate"
                            );

                        const shipmentStatus =
                            getValue(
                                row,
                                "shipmentStatus",
                                "ShipmentStatus"
                            );


                        // =================================================
                        // ROW
                        // =================================================

                        return (

                            <TableRow
                                key={
                                    shipmentId ??
                                    index
                                }
                                hover
                            >

                                {/* Shipment ID */}

                                <TableCell>

                                    {shipmentId ?? "-"}

                                </TableCell>


                                {/* Seller ID */}

                                <TableCell>

                                    {sellerId ?? "-"}

                                </TableCell>


                                {/* Customer ID */}

                                <TableCell>

                                    {customerId ?? "-"}

                                </TableCell>


                                {/* Order ID */}

                                <TableCell>

                                    {orderId ?? "-"}

                                </TableCell>


                                {/* Courier */}

                                <TableCell>

                                    {courierName || "-"}

                                </TableCell>


                                {/* Tracking Number */}

                                <TableCell>

                                    {trackingNumber || "-"}

                                </TableCell>


                                {/* Shipment Date */}

                                <TableCell>

                                    {formatDate(
                                        shipmentDate
                                    )}

                                </TableCell>


                                {/* Delivery Date */}

                                <TableCell>

                                    {formatDate(
                                        deliveryDate
                                    )}

                                </TableCell>


                                {/* Status */}

                                <TableCell>

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

                                </TableCell>


                                {/* Actions */}

                                <TableCell
                                    align="center"
                                >

                                    {/* VIEW */}

                                    <Tooltip
                                        title="View Shipment"
                                    >

                                        <IconButton
                                            color="primary"
                                            size="small"
                                            onClick={() =>
                                                onView?.(row)
                                            }
                                        >

                                            <Visibility />

                                        </IconButton>

                                    </Tooltip>


                                    {/* EDIT */}

                                    <Tooltip
                                        title="Edit Shipment"
                                    >

                                        <IconButton
                                            color="warning"
                                            size="small"
                                            onClick={() =>
                                                onEdit?.(row)
                                            }
                                        >

                                            <Edit />

                                        </IconButton>

                                    </Tooltip>


                                    {/* DELETE */}

                                    <Tooltip
                                        title="Delete Shipment"
                                    >

                                        <IconButton
                                            color="error"
                                            size="small"
                                            onClick={() =>
                                                onDelete?.(row)
                                            }
                                        >

                                            <Delete />

                                        </IconButton>

                                    </Tooltip>

                                </TableCell>

                            </TableRow>

                        );

                    })}

                </TableBody>

            </Table>

        </TableContainer>

    );

};


// =========================================================
// EXPORT
// =========================================================

export default ShipmentTable;
