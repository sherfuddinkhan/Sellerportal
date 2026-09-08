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
    Chip
} from "@mui/material";

const OrderView = ({
    open,
    order,
    onClose
}) => {
    if (!order) {
        return null;
    }

    const Field = ({
        label,
        value
    }) => (
        <Grid item xs={12} md={6}>
            <Typography
                variant="caption"
                color="text.secondary"
            >
                {label}
            </Typography>

            <Typography
                variant="body1"
                fontWeight={500}
            >
                {value || "-"}
            </Typography>
        </Grid>
    );

    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case "pending":
                return "warning";

            case "confirmed":
                return "info";

            case "processing":
                return "primary";

            case "packed":
                return "secondary";

            case "shipped":
                return "success";

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

    const formatDate = (date) => {
        if (!date) {
            return "-";
        }

        return new Date(date).toLocaleDateString();
    };

    const formatDateTime = (date) => {
        if (!date) {
            return "-";
        }

        return new Date(date).toLocaleString();
    };

    const formatAmount = (amount) => {
        return `₹ ${Number(amount || 0).toLocaleString("en-IN")}`;
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            fullWidth
            maxWidth="md"
        >
            <DialogTitle>
                Order Details
            </DialogTitle>

            <Divider />

            <DialogContent sx={{ mt: 2 }}>
                <Grid
                    container
                    spacing={3}
                >
                    <Field
                        label="Order ID"
                        value={order.OrderId ?? order.orderId}
                    />

                    <Field
                        label="Seller ID"
                        value={order.SellerId ?? order.sellerId}
                    />

                    <Field
                        label="Customer ID"
                        value={order.CustomerId ?? order.customerId}
                    />

                    <Field
                        label="Order Number"
                        value={
                            order.OrderNumber ??
                            order.orderNumber
                        }
                    />

                    <Field
                        label="Order Date"
                        value={formatDate(
                            order.OrderDate ??
                            order.orderDate
                        )}
                    />

                    <Grid
                        item
                        xs={12}
                        md={6}
                    >
                        <Typography
                            variant="caption"
                            color="text.secondary"
                        >
                            Order Status
                        </Typography>

                        <br />

                        <Chip
                            label={
                                order.OrderStatus ??
                                order.orderStatus ??
                                "N/A"
                            }
                            color={getStatusColor(
                                order.OrderStatus ??
                                order.orderStatus
                            )}
                        />
                    </Grid>

                    <Field
                        label="Total Amount"
                        value={formatAmount(
                            order.TotalAmount ??
                            order.totalAmount
                        )}
                    />

                    <Field
                        label="Created Date"
                        value={formatDateTime(
                            order.CreatedDate ??
                            order.createdDate
                        )}
                    />
                </Grid>
            </DialogContent>

            <DialogActions>
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

export default OrderView;
