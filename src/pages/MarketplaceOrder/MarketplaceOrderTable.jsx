import React from "react";

import {
    Box,
    Button,
    Chip,
    IconButton,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Tooltip,
    Typography
} from "@mui/material";

import {
    Visibility,
    Edit,
    Delete,
    ShoppingCart
} from "@mui/icons-material";

import { useNavigate } from "react-router-dom";

const MarketplaceOrderTable = ({
    orders = [],
    onView,
    onEdit,
    onDelete
}) => {
    const navigate = useNavigate();

    const getValue = (
        order,
        camelCase,
        pascalCase,
        fallback = ""
    ) => {
        return order?.[camelCase] ??
            order?.[pascalCase] ??
            fallback;
    };

    const getOrderId = (order) => {
        return getValue(
            order,
            "marketplaceOrderId",
            "MarketplaceOrderId",
            null
        );
    };

    const getStatusColor = (status) => {
        switch (String(status).toLowerCase()) {
            case "delivered":
                return "success";

            case "shipped":
                return "info";

            case "processing":
            case "requested":
                return "warning";

            case "cancelled":
            case "canceled":
                return "error";

            case "pending":
            default:
                return "default";
        }
    };

    const formatDate = (date) => {
        if (!date) {
            return "N/A";
        }

        const parsedDate = new Date(date);

        if (Number.isNaN(parsedDate.getTime())) {
            return "N/A";
        }

        return parsedDate.toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric"
        });
    };

    const formatAmount = (amount) => {
        const numericAmount = Number(amount);

        if (Number.isNaN(numericAmount)) {
            return "0.00";
        }

        return numericAmount.toLocaleString("en-IN", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    };

    const handleView = (order) => {
        if (onView) {
            onView(order);
            return;
        }

        const id = getOrderId(order);

        if (id) {
            navigate(
                `/marketplace-orders/details/${id}`
            );
        }
    };

    const handleEdit = (order) => {
        if (onEdit) {
            onEdit(order);
            return;
        }

        const id = getOrderId(order);

        if (id) {
            navigate(
                `/marketplace-orders/edit/${id}`
            );
        }
    };

    const handleDelete = (order) => {
        if (onDelete) {
            onDelete(order);
        }
    };

    if (!orders || orders.length === 0) {
        return (
            <Paper
                elevation={0}
                sx={{
                    border: "1px solid",
                    borderColor: "divider",
                    borderRadius: 2,
                    p: 5
                }}
            >
                <Box
                    sx={{
                        minHeight: 180,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexDirection: "column",
                        textAlign: "center"
                    }}
                >
                    <ShoppingCart
                        sx={{
                            fontSize: 48,
                            color: "text.disabled",
                            mb: 1
                        }}
                    />

                    <Typography
                        variant="h6"
                        fontWeight={600}
                    >
                        No Marketplace Orders Found
                    </Typography>

                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mt: 0.5 }}
                    >
                        There are no orders to display.
                    </Typography>
                </Box>
            </Paper>
        );
    }

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
                sx={{
                    minWidth: 1100
                }}
            >
                <TableHead>
                    <TableRow>
                        <TableCell
                            sx={{
                                fontWeight: 700,
                                whiteSpace: "nowrap"
                            }}
                        >
                            Order
                        </TableCell>

                        <TableCell
                            sx={{
                                fontWeight: 700,
                                whiteSpace: "nowrap"
                            }}
                        >
                            External Order ID
                        </TableCell>

                        <TableCell
                            sx={{
                                fontWeight: 700,
                                whiteSpace: "nowrap"
                            }}
                        >
                            Seller Order
                        </TableCell>

                        <TableCell
                            sx={{
                                fontWeight: 700,
                                whiteSpace: "nowrap"
                            }}
                        >
                            Buyer
                        </TableCell>

                        <TableCell
                            sx={{
                                fontWeight: 700,
                                whiteSpace: "nowrap"
                            }}
                        >
                            Order Date
                        </TableCell>

                        <TableCell
                            sx={{
                                fontWeight: 700,
                                whiteSpace: "nowrap"
                            }}
                        >
                            Fulfillment
                        </TableCell>

                        <TableCell
                            sx={{
                                fontWeight: 700,
                                whiteSpace: "nowrap"
                            }}
                        >
                            Status
                        </TableCell>

                        <TableCell
                            align="right"
                            sx={{
                                fontWeight: 700,
                                whiteSpace: "nowrap"
                            }}
                        >
                            Total
                        </TableCell>

                        <TableCell
                            align="center"
                            sx={{
                                fontWeight: 700,
                                whiteSpace: "nowrap"
                            }}
                        >
                            Actions
                        </TableCell>
                    </TableRow>
                </TableHead>

                <TableBody>
                    {orders.map((order, index) => {
                        const orderId =
                            getOrderId(order);

                        const orderNumber =
                            getValue(
                                order,
                                "marketplaceOrderNumber",
                                "MarketplaceOrderNumber",
                                "N/A"
                            );

                        const externalOrderId =
                            getValue(
                                order,
                                "externalOrderId",
                                "ExternalOrderId",
                                "N/A"
                            );

                        const sellerOrderNumber =
                            getValue(
                                order,
                                "sellerOrderNumber",
                                "SellerOrderNumber",
                                "N/A"
                            );

                        const buyerName =
                            getValue(
                                order,
                                "buyerName",
                                "BuyerName",
                                "N/A"
                            );

                        const buyerEmail =
                            getValue(
                                order,
                                "buyerEmail",
                                "BuyerEmail",
                                ""
                            );

                        const orderDate =
                            getValue(
                                order,
                                "orderDate",
                                "OrderDate"
                            );

                        const orderStatus =
                            getValue(
                                order,
                                "orderStatus",
                                "OrderStatus",
                                "Pending"
                            );

                        const fulfillmentChannel =
                            getValue(
                                order,
                                "fulfillmentChannel",
                                "FulfillmentChannel",
                                "N/A"
                            );

                        const currency =
                            getValue(
                                order,
                                "currency",
                                "Currency",
                                "INR"
                            );

                        const totalAmount =
                            getValue(
                                order,
                                "totalAmount",
                                "TotalAmount",
                                0
                            );

                        return (
                            <TableRow
                                key={
                                    orderId ??
                                    `order-${index}`
                                }
                                hover
                            >
                                {/* Order */}
                                <TableCell>
                                    <Box
                                        sx={{
                                            display: "flex",
                                            alignItems:
                                                "center",
                                            gap: 1
                                        }}
                                    >
                                        <ShoppingCart
                                            fontSize="small"
                                            color="primary"
                                        />

                                        <Box>
                                            <Typography
                                                variant="body2"
                                                fontWeight={700}
                                                sx={{
                                                    whiteSpace:
                                                        "nowrap"
                                                }}
                                            >
                                                {
                                                    orderNumber
                                                }
                                            </Typography>

                                            <Typography
                                                variant="caption"
                                                color="text.secondary"
                                            >
                                                ID:{" "}
                                                {orderId ??
                                                    "N/A"}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </TableCell>

                                {/* External Order */}
                                <TableCell>
                                    <Typography
                                        variant="body2"
                                        sx={{
                                            maxWidth: 180,
                                            wordBreak:
                                                "break-word"
                                        }}
                                    >
                                        {
                                            externalOrderId
                                        }
                                    </Typography>
                                </TableCell>

                                {/* Seller Order */}
                                <TableCell>
                                    <Typography
                                        variant="body2"
                                        sx={{
                                            maxWidth: 160,
                                            wordBreak:
                                                "break-word"
                                        }}
                                    >
                                        {
                                            sellerOrderNumber
                                        }
                                    </Typography>
                                </TableCell>

                                {/* Buyer */}
                                <TableCell>
                                    <Typography
                                        variant="body2"
                                        fontWeight={600}
                                    >
                                        {buyerName}
                                    </Typography>

                                    {buyerEmail && (
                                        <Typography
                                            variant="caption"
                                            color="text.secondary"
                                            sx={{
                                                display:
                                                    "block",
                                                maxWidth: 200,
                                                overflow:
                                                    "hidden",
                                                textOverflow:
                                                    "ellipsis",
                                                whiteSpace:
                                                    "nowrap"
                                            }}
                                        >
                                            {
                                                buyerEmail
                                            }
                                        </Typography>
                                    )}
                                </TableCell>

                                {/* Date */}
                                <TableCell
                                    sx={{
                                        whiteSpace:
                                            "nowrap"
                                    }}
                                >
                                    {formatDate(
                                        orderDate
                                    )}
                                </TableCell>

                                {/* Fulfillment */}
                                <TableCell>
                                    <Typography
                                        variant="body2"
                                        sx={{
                                            whiteSpace:
                                                "nowrap"
                                        }}
                                    >
                                        {
                                            fulfillmentChannel
                                        }
                                    </Typography>
                                </TableCell>

                                {/* Status */}
                                <TableCell>
                                    <Chip
                                        label={
                                            orderStatus
                                        }
                                        color={getStatusColor(
                                            orderStatus
                                        )}
                                        size="small"
                                    />
                                </TableCell>

                                {/* Total */}
                                <TableCell align="right">
                                    <Typography
                                        variant="body2"
                                        fontWeight={700}
                                        sx={{
                                            whiteSpace:
                                                "nowrap"
                                        }}
                                    >
                                        {currency}{" "}
                                        {formatAmount(
                                            totalAmount
                                        )}
                                    </Typography>
                                </TableCell>

                                {/* Actions */}
                                <TableCell align="center">
                                    <Box
                                        sx={{
                                            display:
                                                "flex",
                                            justifyContent:
                                                "center",
                                            alignItems:
                                                "center",
                                            gap: 0.5
                                        }}
                                    >
                                        <Tooltip title="View">
                                            <IconButton
                                                size="small"
                                                color="primary"
                                                onClick={() =>
                                                    handleView(
                                                        order
                                                    )
                                                }
                                            >
                                                <Visibility fontSize="small" />
                                            </IconButton>
                                        </Tooltip>

                                        <Tooltip title="Edit">
                                            <IconButton
                                                size="small"
                                                color="primary"
                                                onClick={() =>
                                                    handleEdit(
                                                        order
                                                    )
                                                }
                                            >
                                                <Edit fontSize="small" />
                                            </IconButton>
                                        </Tooltip>

                                        <Tooltip title="Delete">
                                            <IconButton
                                                size="small"
                                                color="error"
                                                onClick={() =>
                                                    handleDelete(
                                                        order
                                                    )
                                                }
                                            >
                                                <Delete fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                    </Box>
                                </TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default MarketplaceOrderTable;

