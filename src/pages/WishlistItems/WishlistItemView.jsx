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
    Chip,
    Divider,
    IconButton
} from "@mui/material";

import {
    Close,
    Edit,
    Delete,
    Favorite
} from "@mui/icons-material";


/* =========================================================
   FORMAT CURRENCY
========================================================= */

const formatCurrency = (value) => {

    const number = Number(value);

    if (!Number.isFinite(number)) {
        return "₹ 0.00";
    }

    return `₹ ${number.toLocaleString("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    })}`;
};


/* =========================================================
   WISHLIST ITEM VIEW
========================================================= */

const WishlistItemView = ({
    open,
    onClose,

    item = null,
    wishlistItem = null,

    onEdit,
    onDelete
}) => {

    const data = item || wishlistItem || {};


    /* =====================================================
       DATA
    ===================================================== */

    const wishlistItemId =
        data.wishlistItemId ??
        data.WishlistItemId ??
        data.id ??
        "-";

    const wishlistId =
        data.wishlistId ??
        data.WishlistId ??
        "-";

    const productId =
        data.productId ??
        data.ProductId ??
        "-";

    const productName =
        data.productName ??
        data.ProductName ??
        data.name ??
        data.Name ??
        `Product #${productId}`;

    const productCode =
        data.productCode ??
        data.ProductCode ??
        "-";

    const quantity =
        data.quantity ??
        data.Quantity ??
        0;

    const price =
        data.price ??
        data.Price ??
        0;

    const status =
        data.status ??
        data.Status ??
        "Active";


    /* =====================================================
       EDIT
    ===================================================== */

    const handleEdit = () => {

        if (typeof onEdit === "function") {
            onEdit(data);
        }

    };


    /* =====================================================
       DELETE
    ===================================================== */

    const handleDelete = () => {

        if (typeof onDelete === "function") {
            onDelete(data);
        }

    };


    /* =====================================================
       RENDER
    ===================================================== */

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


                <IconButton onClick={onClose}>
                    <Close />
                </IconButton>

            </DialogTitle>


            {/* =================================================
               CONTENT
            ================================================= */}

            <DialogContent dividers>

                {/* =================================================
                   PRODUCT
                ================================================= */}

                <Box
                    sx={{
                        textAlign: "center",
                        py: 2
                    }}
                >

                    <Typography
                        variant="h5"
                        fontWeight={700}
                    >
                        {productName}
                    </Typography>

                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mt: 0.5 }}
                    >
                        SKU: {productCode}
                    </Typography>

                    <Chip
                        label={status}
                        color={
                            String(status).toLowerCase() === "active"
                                ? "success"
                                : "default"
                        }
                        size="small"
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

                    <Grid item xs={6}>

                        <Typography
                            variant="caption"
                            color="text.secondary"
                        >
                            Wishlist Item ID
                        </Typography>

                        <Typography fontWeight={600}>
                            {wishlistItemId}
                        </Typography>

                    </Grid>


                    <Grid item xs={6}>

                        <Typography
                            variant="caption"
                            color="text.secondary"
                        >
                            Wishlist ID
                        </Typography>

                        <Typography fontWeight={600}>
                            {wishlistId}
                        </Typography>

                    </Grid>


                    <Grid item xs={6}>

                        <Typography
                            variant="caption"
                            color="text.secondary"
                        >
                            Product ID
                        </Typography>

                        <Typography fontWeight={600}>
                            {productId}
                        </Typography>

                    </Grid>


                    <Grid item xs={6}>

                        <Typography
                            variant="caption"
                            color="text.secondary"
                        >
                            Quantity
                        </Typography>

                        <Typography fontWeight={600}>
                            {quantity}
                        </Typography>

                    </Grid>


                    <Grid item xs={12}>

                        <Typography
                            variant="caption"
                            color="text.secondary"
                        >
                            Price
                        </Typography>

                        <Typography
                            variant="h6"
                            fontWeight={700}
                            color="primary"
                        >
                            {formatCurrency(price)}
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
                    py: 2
                }}
            >

                <Button
                    variant="outlined"
                    color="error"
                    startIcon={<Delete/>}
                    onClick={handleDelete}
                >
                    Delete
                </Button>


                <Button
                    variant="contained"
                    startIcon={<Edit />}
                    onClick={handleEdit}
                >
                    Edit
                </Button>

            </DialogActions>

        </Dialog>
    );
};


export default WishlistItemView;