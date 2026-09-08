import React from "react";

import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    Box,
    Alert
} from "@mui/material";

import {
    Delete,
    WarningAmber
} from "@mui/icons-material";

const DeleteMarketplaceOrderDialog = ({
    open = false,
    onClose,
    onConfirm,
    order = null,
    loading = false
}) => {
    const getValue = (camelCase, pascalCase, fallback = "") => {
        if (!order) {
            return fallback;
        }

        return order[camelCase] ??
            order[pascalCase] ??
            fallback;
    };

    const orderNumber = getValue(
        "marketplaceOrderNumber",
        "MarketplaceOrderNumber",
        "this marketplace order"
    );

    const orderId = getValue(
        "marketplaceOrderId",
        "MarketplaceOrderId",
        ""
    );

    const handleConfirm = () => {
        if (onConfirm) {
            onConfirm(order);
        }
    };

    return (
        <Dialog
            open={open}
            onClose={loading ? undefined : onClose}
            maxWidth="xs"
            fullWidth
        >
            <DialogTitle>
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1
                    }}
                >
                    <WarningAmber color="error" />

                    <Typography
                        variant="h6"
                        component="span"
                        fontWeight={600}
                    >
                        Delete Marketplace Order
                    </Typography>
                </Box>
            </DialogTitle>

            <DialogContent>
                <Alert
                    severity="warning"
                    sx={{ mb: 2 }}
                >
                    This action cannot be undone.
                </Alert>

                <Typography
                    variant="body1"
                    sx={{ mb: 1 }}
                >
                    Are you sure you want to delete this marketplace
                    order?
                </Typography>

                <Box
                    sx={{
                        p: 2,
                        mt: 2,
                        borderRadius: 1,
                        backgroundColor: "action.hover"
                    }}
                >
                    <Typography
                        variant="body2"
                        color="text.secondary"
                    >
                        Order Number
                    </Typography>

                    <Typography
                        variant="body1"
                        fontWeight={600}
                        sx={{
                            wordBreak: "break-word"
                        }}
                    >
                        {orderNumber}
                    </Typography>

                    {orderId && (
                        <>
                            <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{ mt: 1 }}
                            >
                                Order ID
                            </Typography>

                            <Typography
                                variant="body2"
                                fontWeight={500}
                            >
                                {orderId}
                            </Typography>
                        </>
                    )}
                </Box>
            </DialogContent>

            <DialogActions sx={{ px: 3, pb: 2 }}>
                <Button
                    onClick={onClose}
                    disabled={loading}
                    variant="outlined"
                >
                    Cancel
                </Button>

                <Button
                    onClick={handleConfirm}
                    disabled={loading}
                    color="error"
                    variant="contained"
                    startIcon={<Delete />}
                >
                    {loading ? "Deleting..." : "Delete Order"}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default DeleteMarketplaceOrderDialog;

