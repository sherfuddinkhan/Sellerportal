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

const DeleteOrderItemDialog = ({
    open,
    item,
    onClose,
    onDeleted
}) => {

    if (!item) {
        return null;
    }

    const orderItemId =
        item.OrderItemId ??
        item.orderItemId;

    const orderId =
        item.OrderId ??
        item.orderId;

    const productId =
        item.ProductId ??
        item.productId;

    const quantity =
        item.Quantity ??
        item.quantity ??
        0;

    const totalAmount =
        item.TotalAmount ??
        item.totalAmount ??
        0;


    const handleDelete = () => {
        if (onDeleted) {
            onDeleted(orderItemId);
        }
    };


    return (
        <Dialog
            open={open}
            onClose={onClose}
            fullWidth
            maxWidth="sm"
        >

            {/* =================================================
                Title
            ================================================= */}

            <DialogTitle>
                Delete Order Item
            </DialogTitle>

            <Divider />


            {/* =================================================
                Content
            ================================================= */}

            <DialogContent sx={{ mt: 2 }}>

                <Typography>
                    Are you sure you want to delete this order item?
                </Typography>


                <Typography
                    sx={{ mt: 2 }}
                    fontWeight="bold"
                >
                    Item ID: {orderItemId}
                </Typography>


                <Typography>
                    Order ID: {orderId}
                </Typography>


                <Typography>
                    Product ID: {productId}
                </Typography>


                <Typography>
                    Quantity:{" "}
                    {Number(quantity).toFixed(2)}
                </Typography>


                <Typography>
                    Total Amount: ₹{" "}
                    {Number(totalAmount).toLocaleString(
                        "en-IN",
                        {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2
                        }
                    )}
                </Typography>

            </DialogContent>


            {/* =================================================
                Actions
            ================================================= */}

            <DialogActions>

                <Button
                    variant="outlined"
                    onClick={() => onClose?.()}
                >
                    Cancel
                </Button>


                <Button
                    variant="contained"
                    color="error"
                    onClick={handleDelete}
                >
                    Delete
                </Button>

            </DialogActions>

        </Dialog>
    );
};

export default DeleteOrderItemDialog;
