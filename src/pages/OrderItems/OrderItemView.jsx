import React from "react";

import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Grid,
    Typography,
    Divider
} from "@mui/material";

const OrderItemView = ({
    open,
    item,
    onClose
}) => {

    if (!item) {
        return null;
    }


    // =========================================================
    // Support PascalCase / camelCase
    // =========================================================

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

    const unitPrice =
        item.UnitPrice ??
        item.unitPrice ??
        0;

    const totalAmount =
        item.TotalAmount ??
        item.totalAmount ??
        0;


    // =========================================================
    // Field Component
    // =========================================================

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
            >
                {label}
            </Typography>

            <Typography
                variant="body1"
                fontWeight={500}
            >
                {value ?? "-"}
            </Typography>
        </Grid>
    );


    // =========================================================
    // Render
    // =========================================================

    return (
        <Dialog
            open={open}
            onClose={onClose}
            fullWidth
            maxWidth="md"
        >

            {/* =================================================
                Title
            ================================================= */}

            <DialogTitle>
                Order Item Details
            </DialogTitle>

            <Divider />


            {/* =================================================
                Content
            ================================================= */}

            <DialogContent sx={{ mt: 2 }}>

                <Grid
                    container
                    spacing={3}
                >

                    <Field
                        label="Order Item ID"
                        value={orderItemId}
                    />

                    <Field
                        label="Order ID"
                        value={orderId}
                    />

                    <Field
                        label="Product ID"
                        value={productId}
                    />

                    <Field
                        label="Quantity"
                        value={Number(quantity).toFixed(2)}
                    />

                    <Field
                        label="Unit Price"
                        value={`₹ ${Number(unitPrice).toLocaleString(
                            "en-IN",
                            {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2
                            }
                        )}`}
                    />

                    <Field
                        label="Total Amount"
                        value={`₹ ${Number(totalAmount).toLocaleString(
                            "en-IN",
                            {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2
                            }
                        )}`}
                    />

                </Grid>

            </DialogContent>


            {/* =================================================
                Actions
            ================================================= */}

            <DialogActions>

                <Button
                    variant="contained"
                    onClick={() => onClose?.()}
                >
                    Close
                </Button>

            </DialogActions>

        </Dialog>
    );
};

export default OrderItemView;
