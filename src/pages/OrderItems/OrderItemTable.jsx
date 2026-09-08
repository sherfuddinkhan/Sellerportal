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
    Box
} from "@mui/material";

import {
    Visibility,
    Edit,
    Delete
} from "@mui/icons-material";

const OrderItemTable = ({
    items = [],
    loading = false,
    onView,
    onEdit,
    onDelete
}) => {

    // =========================================================
    // Loading State
    // =========================================================

    if (loading) {
        return (
            <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                mt={5}
            >
                <CircularProgress />
            </Box>
        );
    }


    // =========================================================
    // Empty State
    // =========================================================

    if (!items || items.length === 0) {
        return (
            <Paper sx={{ p: 4 }}>
                <Typography
                    align="center"
                    color="text.secondary"
                >
                    No Order Items Found
                </Typography>
            </Paper>
        );
    }


    // =========================================================
    // Table
    // =========================================================

    return (
        <TableContainer component={Paper}>
            <Table size="small">

                {/* =================================================
                    Table Header
                ================================================= */}

                <TableHead>
                    <TableRow>

                        <TableCell>
                            Item ID
                        </TableCell>

                        <TableCell>
                            Order ID
                        </TableCell>

                        <TableCell>
                            Product ID
                        </TableCell>

                        <TableCell>
                            Quantity
                        </TableCell>

                        <TableCell>
                            Unit Price
                        </TableCell>

                        <TableCell>
                            Total Amount
                        </TableCell>

                        <TableCell align="center">
                            Actions
                        </TableCell>

                    </TableRow>
                </TableHead>


                {/* =================================================
                    Table Body
                ================================================= */}

                <TableBody>

                    {items.map((row) => {

                        const orderItemId =
                            row.OrderItemId ??
                            row.orderItemId;

                        const orderId =
                            row.OrderId ??
                            row.orderId;

                        const productId =
                            row.ProductId ??
                            row.productId;

                        const quantity =
                            row.Quantity ??
                            row.quantity ??
                            0;

                        const unitPrice =
                            row.UnitPrice ??
                            row.unitPrice ??
                            0;

                        const totalAmount =
                            row.TotalAmount ??
                            row.totalAmount ??
                            0;

                        return (
                            <TableRow
                                key={orderItemId}
                                hover
                            >

                                {/* Item ID */}
                                <TableCell>
                                    {orderItemId}
                                </TableCell>


                                {/* Order ID */}
                                <TableCell>
                                    {orderId}
                                </TableCell>


                                {/* Product ID */}
                                <TableCell>
                                    {productId}
                                </TableCell>


                                {/* Quantity */}
                                <TableCell>
                                    {Number(quantity).toFixed(2)}
                                </TableCell>


                                {/* Unit Price */}
                                <TableCell>
                                    ₹{" "}
                                    {Number(unitPrice).toLocaleString(
                                        "en-IN",
                                        {
                                            minimumFractionDigits: 2,
                                            maximumFractionDigits: 2
                                        }
                                    )}
                                </TableCell>


                                {/* Total Amount */}
                                <TableCell>
                                    ₹{" "}
                                    {Number(totalAmount).toLocaleString(
                                        "en-IN",
                                        {
                                            minimumFractionDigits: 2,
                                            maximumFractionDigits: 2
                                        }
                                    )}
                                </TableCell>


                                {/* Actions */}
                                <TableCell align="center">

                                    {/* View */}
                                    <Tooltip title="View">
                                        <IconButton
                                            color="primary"
                                            onClick={() =>
                                                onView?.(row)
                                            }
                                        >
                                            <Visibility />
                                        </IconButton>
                                    </Tooltip>


                                    {/* Edit */}
                                    <Tooltip title="Edit">
                                        <IconButton
                                            color="warning"
                                            onClick={() =>
                                                onEdit?.(row)
                                            }
                                        >
                                            <Edit />
                                        </IconButton>
                                    </Tooltip>


                                    {/* Delete */}
                                    <Tooltip title="Delete">
                                        <IconButton
                                            color="error"
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

export default OrderItemTable;
