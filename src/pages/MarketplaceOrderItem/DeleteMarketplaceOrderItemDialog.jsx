import React from "react";

import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Button,
    Typography,
    Box
} from "@mui/material";

import {
    WarningAmber
} from "@mui/icons-material";

const DeleteMarketplaceOrderItemDialog = ({
    open,
    onClose,
    marketplaceOrderItem,
    onDeleted
}) => {

    const handleDelete = () => {

        if (marketplaceOrderItem?.MarketplaceOrderItemId) {

            onDeleted(
                marketplaceOrderItem.MarketplaceOrderItemId
            );

        }

    };

    return (

        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="sm"
            fullWidth
        >

            <DialogTitle
                sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1
                }}
            >

                <WarningAmber color="error" />

                Delete Marketplace Order Item

            </DialogTitle>

            <DialogContent>

                <DialogContentText>

                    Are you sure you want to delete this
                    Marketplace Order Item?
                    This action cannot be undone.

                </DialogContentText>

                {

                    marketplaceOrderItem && (

                        <Box
                            sx={{
                                mt: 3,
                                p: 2,
                                border: "1px solid #e0e0e0",
                                borderRadius: 2,
                                backgroundColor: "#fafafa"
                            }}
                        >

                            <Typography>

                                <strong>Marketplace Order Item ID :</strong>{" "}

                                {marketplaceOrderItem.MarketplaceOrderItemId}

                            </Typography>

                            <Typography>

                                <strong>Marketplace Order ID :</strong>{" "}

                                {marketplaceOrderItem.MarketplaceOrderId}

                            </Typography>

                            <Typography>

                                <strong>Order Item Number :</strong>{" "}

                                {marketplaceOrderItem.MarketplaceOrderItemNumber || "-"}

                            </Typography>

                            <Typography>

                                <strong>External Item ID :</strong>{" "}

                                {marketplaceOrderItem.ExternalOrderItemId || "-"}

                            </Typography>

                            <Typography>

                                <strong>Product :</strong>{" "}

                                {marketplaceOrderItem.ProductTitle || "-"}

                            </Typography>

                            <Typography>

                                <strong>SKU :</strong>{" "}

                                {marketplaceOrderItem.SKU || "-"}

                            </Typography>

                            <Typography>

                                <strong>Quantity :</strong>{" "}

                                {marketplaceOrderItem.Quantity ?? 0}

                            </Typography>

                            <Typography>

                                <strong>Total Amount :</strong>{" "}

                                ₹
                                {Number(
                                    marketplaceOrderItem.TotalAmount || 0
                                ).toLocaleString()}

                            </Typography>

                        </Box>

                    )

                }

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
                >

                    Delete

                </Button>

            </DialogActions>

        </Dialog>

    );

};

export default DeleteMarketplaceOrderItemDialog;