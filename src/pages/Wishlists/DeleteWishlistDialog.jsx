// =========================================================
// DeleteWishlistDialog.jsx
// =========================================================

import React, { useState } from "react";

import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Typography,
    Box,
    Button,
    Alert,
    Divider,
} from "@mui/material";

import {
    DeleteForever,
    WarningAmber,
    Close,
} from "@mui/icons-material";

// =========================================================
// COMPONENT
// =========================================================

const DeleteWishlistDialog = ({
    open = false,
    wishlist = null,
    onClose,
    onConfirm,
}) => {
    // =========================================================
    // STATE
    // =========================================================

    const [deleting, setDeleting] =
        useState(false);

    const [errorMessage, setErrorMessage] =
        useState("");

    // =========================================================
    // SAFE VALUES
    // =========================================================

    const wishlistId =
        wishlist?.wishlistId ??
        wishlist?.id ??
        "";

    const productName =
        wishlist?.productName ||
        wishlist?.product?.productName ||
        wishlist?.product?.name ||
        "this product";

    const productSku =
        wishlist?.productSku ||
        wishlist?.product?.sku ||
        wishlist?.sku ||
        "";

    const customerName =
        wishlist?.customerName ||
        wishlist?.customer?.customerName ||
        wishlist?.customer?.name ||
        "";

    // =========================================================
    // CLOSE
    // =========================================================

    const handleClose = () => {
        if (deleting) {
            return;
        }

        setErrorMessage("");

        if (onClose) {
            onClose();
        }
    };

    // =========================================================
    // CONFIRM DELETE
    // =========================================================

    const handleConfirm = async () => {
        if (!onConfirm) {
            handleClose();
            return;
        }

        try {
            setDeleting(true);
            setErrorMessage("");

            await onConfirm(wishlist);

            setErrorMessage("");

            if (onClose) {
                onClose();
            }
        } catch (error) {
            console.error(
                "Delete wishlist error:",
                error
            );

            setErrorMessage(
                error?.message ||
                    "Failed to delete wishlist."
            );
        } finally {
            setDeleting(false);
        }
    };

    // =========================================================
    // RENDER
    // =========================================================

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            fullWidth
            maxWidth="sm"
            aria-labelledby="delete-wishlist-dialog-title"
            aria-describedby="delete-wishlist-dialog-description"
        >
            {/* =================================================
                TITLE
               ================================================= */}

            <DialogTitle
                id="delete-wishlist-dialog-title"
                sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                    pb: 1.5,
                }}
            >
                <Box
                    sx={{
                        width: 42,
                        height: 42,
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        bgcolor:
                            "error.light",
                        color:
                            "error.main",
                        flexShrink: 0,
                    }}
                >
                    <WarningAmber />
                </Box>

                <Box>
                    <Typography
                        variant="h6"
                        fontWeight="bold"
                    >
                        Delete Wishlist
                    </Typography>

                    <Typography
                        variant="body2"
                        color="text.secondary"
                    >
                        Confirm wishlist removal
                    </Typography>
                </Box>
            </DialogTitle>

            <Divider />

            {/* =================================================
                CONTENT
               ================================================= */}

            <DialogContent sx={{ pt: 3 }}>
                {errorMessage && (
                    <Alert
                        severity="error"
                        sx={{ mb: 2 }}
                    >
                        {errorMessage}
                    </Alert>
                )}

                <Typography
                    id="delete-wishlist-dialog-description"
                    variant="body1"
                    sx={{ mb: 2 }}
                >
                    Are you sure you want to
                    delete this wishlist item?
                </Typography>

                {/* =================================================
                    WISHLIST DETAILS
                   ================================================= */}

                <Box
                    sx={{
                        p: 2,
                        borderRadius: 2,
                        bgcolor:
                            "action.hover",
                        border:
                            "1px solid",
                        borderColor:
                            "divider",
                    }}
                >
                    <Typography
                        variant="subtitle1"
                        fontWeight="bold"
                        sx={{
                            wordBreak:
                                "break-word",
                        }}
                    >
                        {productName}
                    </Typography>

                    {productSku && (
                        <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ mt: 0.5 }}
                        >
                            SKU: {productSku}
                        </Typography>
                    )}

                    {customerName && (
                        <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ mt: 0.5 }}
                        >
                            Customer:{" "}
                            {customerName}
                        </Typography>
                    )}

                    {wishlistId && (
                        <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{
                                display:
                                    "block",
                                mt: 1,
                            }}
                        >
                            Wishlist ID:{" "}
                            {wishlistId}
                        </Typography>
                    )}
                </Box>

                {/* =================================================
                    WARNING
                   ================================================= */}

                <Alert
                    severity="warning"
                    sx={{ mt: 2 }}
                >
                    This action cannot be undone.
                    The wishlist item will be
                    permanently removed.
                </Alert>
            </DialogContent>

            <Divider />

            {/* =================================================
                ACTIONS
               ================================================= */}

            <DialogActions
                sx={{
                    px: 3,
                    py: 2,
                    gap: 1,
                }}
            >
                <Button
                    variant="outlined"
                    startIcon={<Close />}
                    onClick={handleClose}
                    disabled={deleting}
                >
                    Cancel
                </Button>

                <Button
                    variant="contained"
                    color="error"
                    startIcon={
                        <DeleteForever />
                    }
                    onClick={handleConfirm}
                    disabled={deleting}
                >
                    {deleting
                        ? "Deleting..."
                        : "Delete Wishlist"}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default DeleteWishlistDialog;