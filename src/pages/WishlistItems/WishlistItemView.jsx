import React from "react";

import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    Box,
    Grid,
    IconButton,
    Divider,
    Chip
} from "@mui/material";

import {
    Close,
    Edit,
    Delete,
    Favorite
} from "@mui/icons-material";


// ============================================================
// WISHLIST ITEM VIEW
// ============================================================

const WishlistItemView = ({
    open,
    onClose,

    item = null,
    wishlistItem = null,

    onEdit,
    onDelete
}) => {

    // ========================================================
    // DATA
    // ========================================================

    const data =
        item ||
        wishlistItem ||
        {};


    // ========================================================
    // FIELD HELPERS
    // ========================================================

    const wishlistItemId =
        data.wishlistItemId ??
        data.WishlistItemId ??
        data.id ??
        "-";


    const wishlistId =
        data.wishlistId ??
        data.WishlistId ??
        "-";


    const sellerId =
        data.sellerId ??
        data.SellerId ??
        "-";


    const customerId =
        data.customerId ??
        data.CustomerId ??
        "-";


    const productId =
        data.productId ??
        data.ProductId ??
        "-";


    const createdDate =
        data.createdDate ??
        data.CreatedDate ??
        null;


    // ========================================================
    // DATE FORMAT
    // ========================================================

    const formatDate = (value) => {

        if (!value) {
            return "-";
        }

        const date =
            new Date(value);

        if (
            Number.isNaN(
                date.getTime()
            )
        ) {
            return String(value);
        }

        return date.toLocaleString(
            "en-IN",
            {
                day: "2-digit",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit"
            }
        );
    };


    // ========================================================
    // EDIT
    // ========================================================

    const handleEdit = () => {

        if (
            typeof onEdit ===
            "function"
        ) {
            onEdit(data);
        }
    };


    // ========================================================
    // DELETE
    // ========================================================

    const handleDelete = () => {

        if (
            typeof onDelete ===
            "function"
        ) {
            onDelete(data);
        }
    };


    // ========================================================
    // RENDER
    // ========================================================

    return (
        <Dialog
            open={Boolean(open)}
            onClose={onClose}
            fullWidth
            maxWidth="sm"
        >

            {/* =================================================
                TITLE
            ================================================= */}

            <DialogTitle
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between"
                }}
            >

                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1
                    }}
                >

                    <Favorite color="error" />

                    <Typography
                        variant="h6"
                        fontWeight={600}
                    >
                        Wishlist Item Details
                    </Typography>

                </Box>


                <IconButton
                    onClick={onClose}
                    aria-label="Close"
                >
                    <Close />
                </IconButton>

            </DialogTitle>


            {/* =================================================
                CONTENT
            ================================================= */}

            <DialogContent dividers>

                {/* =================================================
                    SUMMARY
                ================================================= */}

                <Box
                    sx={{
                        textAlign: "center",
                        py: 2
                    }}
                >

                    <Favorite
                        color="error"
                        sx={{
                            fontSize: 42,
                            mb: 1
                        }}
                    />


                    <Typography
                        variant="h5"
                        fontWeight={700}
                    >
                        Wishlist Item
                    </Typography>


                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mt: 0.5 }}
                    >
                        Wishlist Item ID:{" "}
                        {wishlistItemId}
                    </Typography>


                    <Chip
                        label="Wishlist Item"
                        size="small"
                        color="primary"
                        variant="outlined"
                        sx={{ mt: 1 }}
                    />

                </Box>


                <Divider sx={{ my: 2 }} />


                {/* =================================================
                    DETAILS
                ================================================= */}

                <Grid
                    container
                    spacing={2}
                >

                    {/* =============================================
                        WISHLIST ITEM ID
                    ============================================= */}

                    <Grid
                        item
                        xs={12}
                        sm={6}
                    >

                        <Typography
                            variant="caption"
                            color="text.secondary"
                        >
                            Wishlist Item ID
                        </Typography>

                        <Typography
                            fontWeight={600}
                        >
                            {wishlistItemId}
                        </Typography>

                    </Grid>


                    {/* =============================================
                        WISHLIST ID
                    ============================================= */}

                    <Grid
                        item
                        xs={12}
                        sm={6}
                    >

                        <Typography
                            variant="caption"
                            color="text.secondary"
                        >
                            Wishlist ID
                        </Typography>

                        <Typography
                            fontWeight={600}
                        >
                            {wishlistId}
                        </Typography>

                    </Grid>


                    {/* =============================================
                        SELLER ID
                    ============================================= */}

                    <Grid
                        item
                        xs={12}
                        sm={6}
                    >

                        <Typography
                            variant="caption"
                            color="text.secondary"
                        >
                            Seller ID
                        </Typography>

                        <Typography
                            fontWeight={600}
                        >
                            {sellerId}
                        </Typography>

                    </Grid>


                    {/* =============================================
                        CUSTOMER ID
                    ============================================= */}

                    <Grid
                        item
                        xs={12}
                        sm={6}
                    >

                        <Typography
                            variant="caption"
                            color="text.secondary"
                        >
                            Customer ID
                        </Typography>

                        <Typography
                            fontWeight={600}
                        >
                            {customerId}
                        </Typography>

                    </Grid>


                    {/* =============================================
                        PRODUCT ID
                    ============================================= */}

                    <Grid
                        item
                        xs={12}
                        sm={6}
                    >

                        <Typography
                            variant="caption"
                            color="text.secondary"
                        >
                            Product ID
                        </Typography>

                        <Typography
                            fontWeight={600}
                        >
                            {productId}
                        </Typography>

                    </Grid>


                    {/* =============================================
                        CREATED DATE
                    ============================================= */}

                    <Grid
                        item
                        xs={12}
                        sm={6}
                    >

                        <Typography
                            variant="caption"
                            color="text.secondary"
                        >
                            Created Date
                        </Typography>

                        <Typography
                            fontWeight={600}
                        >
                            {formatDate(
                                createdDate
                            )}
                        </Typography>

                    </Grid>

                </Grid>

            </DialogContent>


            {/* =================================================
                ACTIONS
            ================================================= */}

            <DialogActions
                sx={{
                    px: 3,
                    py: 2,
                    justifyContent:
                        "space-between"
                }}
            >

                <Button
                    variant="outlined"
                    color="error"
                    startIcon={
                        <Delete />
                    }
                    onClick={
                        handleDelete
                    }
                >
                    Delete
                </Button>


                <Box
                    sx={{
                        display: "flex",
                        gap: 1
                    }}
                >

                    <Button
                        variant="outlined"
                        onClick={onClose}
                    >
                        Close
                    </Button>


                    <Button
                        variant="contained"
                        startIcon={
                            <Edit />
                        }
                        onClick={
                            handleEdit
                        }
                    >
                        Edit
                    </Button>

                </Box>

            </DialogActions>

        </Dialog>
    );
};


export default WishlistItemView;
