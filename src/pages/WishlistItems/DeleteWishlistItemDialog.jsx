import React from "react";

import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    Box,
    CircularProgress
} from "@mui/material";

import {
    DeleteOutline,
    WarningAmber
} from "@mui/icons-material";


/* =========================================================
   DELETE WISHLIST ITEM DIALOG
========================================================= */

const DeleteWishlistItemDialog = ({
    open,
    onClose,
    onConfirm,
    wishlistItem = null,
    loading = false
}) => {

    /* =====================================================
       ITEM INFORMATION
    ===================================================== */

    const itemId =
        wishlistItem?.wishlistItemId ??
        wishlistItem?.WishlistItemId ??
        wishlistItem?.id ??
        null;

    const productName =
        wishlistItem?.productName ??
        wishlistItem?.ProductName ??
        wishlistItem?.name ??
        "this wishlist item";


    /* =====================================================
       CONFIRM DELETE
    ===================================================== */

    const handleConfirm = () => {

        if (loading) {
            return;
        }

        if (typeof onConfirm === "function") {
            onConfirm(wishlistItem);
        }
    };


    /* =====================================================
       CLOSE DIALOG
    ===================================================== */

    const handleClose = () => {

        if (loading) {
            return;
        }

        if (typeof onClose === "function") {
            onClose();
        }
    };


    /* =====================================================
       RENDER
    ===================================================== */

    return (
        <Dialog
            open={Boolean(open)}
            onClose={handleClose}
            fullWidth
            maxWidth="xs"
            disableEscapeKeyDown={loading}
        >

            {/* =================================================
               TITLE
            ================================================= */}

            <DialogTitle>
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1
                    }}
                >

                    <WarningAmber
                        color="warning"
                    />

                    <Typography
                        component="span"
                        variant="h6"
                        fontWeight={600}
                    >
                        Delete Wishlist Item
                    </Typography>

                </Box>
            </DialogTitle>


            {/* =================================================
               CONTENT
            ================================================= */}

            <DialogContent>

                <Typography
                    variant="body1"
                    sx={{ mb: 1 }}
                >
                    Are you sure you want to delete this wishlist
                    item?
                </Typography>

                <Typography
                    variant="body2"
                    color="text.secondary"
                >
                    <strong>{productName}</strong>
                </Typography>

                {itemId !== null && (
                    <Typography
                        variant="caption"
                        color="text.secondary"
                        display="block"
                        sx={{ mt: 1 }}
                    >
                        Wishlist Item ID: {itemId}
                    </Typography>
                )}

                <Typography
                    variant="body2"
                    color="error"
                    sx={{ mt: 2 }}
                >
                    This action cannot be undone.
                </Typography>

            </DialogContent>


            {/* =================================================
               ACTIONS
            ================================================= */}

            <DialogActions
                sx={{
                    px: 3,
                    pb: 2,
                    gap: 1
                }}
            >

                <Button
                    variant="outlined"
                    onClick={handleClose}
                    disabled={loading}
                >
                    Cancel
                </Button>


                <Button
                    variant="contained"
                    color="error"
                    startIcon={
                        loading
                            ? <CircularProgress
                                size={18}
                                color="inherit"
                              />
                            : <DeleteOutline />
                    }
                    onClick={handleConfirm}
                    disabled={loading}
                >
                    {loading ? "Deleting..." : "Delete"}
                </Button>

            </DialogActions>

        </Dialog>
    );
};


export default DeleteWishlistItemDialog;

