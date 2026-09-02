// =========================================================
// DeleteProductPriceDialog.jsx
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
    Box,
    CircularProgress,
} from "@mui/material";

// =========================================================
// COMPONENT
// =========================================================

const DeleteProductPriceDialog = ({
    open,
    productPrice,
    onClose,
    onDeleted,
    loading = false,
}) => {

    // =====================================================
    // SAFETY
    // =====================================================

    if (!productPrice) {
        return null;
    }

    // =====================================================
    // HELPERS
    // =====================================================

    const getValue = (pascalCase, camelCase) => {

        return (
            productPrice?.[pascalCase] ??
            productPrice?.[camelCase]
        );
    };

    // =====================================================
    // VALUES
    // =====================================================

    const productPriceId = getValue(
        "ProductPriceId",
        "productPriceId"
    );

    const productId = getValue(
        "ProductId",
        "productId"
    );

    const priceType = getValue(
        "PriceType",
        "priceType"
    );

    const price = getValue(
        "Price",
        "price"
    );

    const currency = getValue(
        "Currency",
        "currency"
    );

    // =====================================================
    // DELETE
    // =====================================================

    const handleDelete = () => {

        if (
            productPriceId === null ||
            productPriceId === undefined
        ) {
            return;
        }

        onDeleted?.(productPriceId);
    };

    // =====================================================
    // RENDER
    // =====================================================

    return (

        <Dialog
            open={open}
            onClose={loading ? undefined : onClose}
            fullWidth
            maxWidth="sm"
        >

            {/* =================================================
                TITLE
            ================================================= */}

            <DialogTitle>
                Delete Product Price
            </DialogTitle>

            <Divider />

            {/* =================================================
                CONTENT
            ================================================= */}

            <DialogContent sx={{ mt: 2 }}>

                <Typography>
                    Are you sure you want to delete this product
                    price?
                </Typography>

                <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mt: 1 }}
                >
                    This action cannot be undone.
                </Typography>

                <Box sx={{ mt: 3 }}>

                    {/* PRICE TYPE */}

                    <Typography
                        sx={{ mb: 1 }}
                        fontWeight="bold"
                    >
                        Price Type:{" "}
                        <Typography
                            component="span"
                            fontWeight="normal"
                        >
                            {priceType || "-"}
                        </Typography>
                    </Typography>

                    {/* PRICE */}

                    <Typography sx={{ mb: 1 }}>

                        <strong>Price:</strong>{" "}

                        {price !== null &&
                        price !== undefined &&
                        price !== ""
                            ? Number(price).toFixed(2)
                            : "0.00"
                        }

                        {" "}

                        {currency || ""}

                    </Typography>

                    {/* PRODUCT ID */}

                    <Typography sx={{ mb: 1 }}>

                        <strong>Product ID:</strong>{" "}

                        {productId ?? "-"}

                    </Typography>

                    {/* PRODUCT PRICE ID */}

                    <Typography>

                        <strong>Product Price ID:</strong>{" "}

                        {productPriceId ?? "-"}

                    </Typography>

                </Box>

            </DialogContent>

            {/* =================================================
                ACTIONS
            ================================================= */}

            <DialogActions sx={{ px: 3, pb: 2 }}>

                <Button
                    variant="outlined"
                    onClick={onClose}
                    disabled={loading}
                >
                    Cancel
                </Button>

                <Button
                    variant="contained"
                    color="error"
                    onClick={handleDelete}
                    disabled={
                        loading ||
                        productPriceId === null ||
                        productPriceId === undefined
                    }
                    startIcon={
                        loading
                            ? <CircularProgress
                                size={18}
                                color="inherit"
                              />
                            : null
                    }
                >
                    {loading ? "Deleting..." : "Delete"}
                </Button>

            </DialogActions>

        </Dialog>
    );
};

export default DeleteProductPriceDialog;
