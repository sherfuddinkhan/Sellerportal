import React from "react";

import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    Divider
} from "@mui/material";

const DeleteOrderDialog = ({
    open,
    order,
    onClose,
    onDeleted
}) => {
    if (!order) {
        return null;
    }

    const orderId =
        order.OrderId ??
        order.orderId;

    const customerId =
        order.CustomerId ??
        order.customerId;

    const orderNumber =
        order.OrderNumber ??
        order.orderNumber;

    const orderStatus =
        order.OrderStatus ??
        order.orderStatus;

    const totalAmount =
        order.TotalAmount ??
        order.totalAmount;

    const handleDelete = () => {
        if (!orderId) {
            return;
        }

        onDeleted(orderId);
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            fullWidth
            maxWidth="sm"
        >
            <DialogTitle>
                Delete Order
            </DialogTitle>

            <Divider />

            <DialogContent sx={{ mt: 2 }}>
                <Typography>
                    Are you sure you want to delete this order?
                </Typography>

                <Typography
                    sx={{ mt: 2 }}
                    fontWeight="bold"
                >
                    Order ID:{" "}
                    {orderId ?? "-"}
                </Typography>

                <Typography>
                    Order Number:{" "}
                    {orderNumber ?? "-"}
                </Typography>

                <Typography>
                    Customer ID:{" "}
                    {customerId ?? "-"}
                </Typography>

                <Typography>
                    Order Status:{" "}
                    {orderStatus || "-"}
                </Typography>

                <Typography>
                    Total Amount: ₹{" "}
                    {Number(
                        totalAmount || 0
                    ).toLocaleString("en-IN")}
                </Typography>
            </DialogContent>

            <DialogActions>
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
                    disabled={!orderId}
                >
                    Delete
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default DeleteOrderDialog;
