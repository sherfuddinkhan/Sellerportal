import React, { useEffect, useState } from "react";

import {
    Box,
    Typography,
    Button,
    CircularProgress,
    Alert,
    Card,
    CardContent,
    Grid,
    Chip,
    Divider
} from "@mui/material";

import {
    ArrowBack,
    Edit,
    Delete,
    Favorite
} from "@mui/icons-material";

import axios from "axios";


/* =========================================================
   CONFIGURATION
========================================================= */

const SERVER_URL =
    import.meta.env.VITE_SERVER_URL || "http://localhost:5000";

const WISHLIST_ITEM_API =
    `${SERVER_URL}/api/WishlistItem`;


/* =========================================================
   FORMAT CURRENCY
========================================================= */

const formatCurrency = (value) => {

    const amount = Number(value);

    if (!Number.isFinite(amount)) {
        return "₹ 0.00";
    }

    return `₹ ${amount.toLocaleString("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    })}`;
};


/* =========================================================
   COMPONENT
========================================================= */

const WishlistItemsDetails = ({
    wishlistItemId,
    id,
    onBack,
    onEdit,
    onDelete
}) => {

    const itemId =
        wishlistItemId ??
        id;


    const [item, setItem] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");


    /* =====================================================
       LOAD WISHLIST ITEM
    ===================================================== */

    const loadWishlistItem = async () => {

        if (!itemId) {

            setError("Wishlist Item ID is required.");
            setLoading(false);

            return;
        }

        try {

            setLoading(true);
            setError("");

            const response = await axios.get(
                `${WISHLIST_ITEM_API}/${itemId}`
            );

            setItem(
                response.data?.data ??
                response.data
            );

        } catch (err) {

            console.error(
                "LOAD WISHLIST ITEM ERROR:",
                err
            );

            setError(
                err.response?.data?.message ||
                err.response?.data?.title ||
                "Unable to load wishlist item."
            );

        } finally {

            setLoading(false);

        }
    };


    /* =====================================================
       LOAD ON ID CHANGE
    ===================================================== */

    useEffect(() => {

        loadWishlistItem();

    }, [itemId]);


    /* =====================================================
       LOADING STATE
    ===================================================== */

    if (loading) {

        return (
            <Box
                sx={{
                    minHeight: 350,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexDirection: "column",
                    gap: 2
                }}
            >

                <CircularProgress />

                <Typography color="text.secondary">
                    Loading Wishlist Item...
                </Typography>

            </Box>
        );
    }


    /* =====================================================
       ERROR STATE
    ===================================================== */

    if (error) {

        return (
            <Box sx={{ p: 3 }}>

                <Alert
                    severity="error"
                    sx={{ mb: 2 }}
                >
                    {error}
                </Alert>

                <Button
                    variant="outlined"
                    startIcon={<ArrowBack />}
                    onClick={onBack}
                >
                    Back
                </Button>

            </Box>
        );
    }


    /* =====================================================
       NO DATA
    ===================================================== */

    if (!item) {

        return (
            <Box sx={{ p: 3 }}>

                <Alert severity="warning">
                    Wishlist item not found.
                </Alert>

                <Button
                    sx={{ mt: 2 }}
                    startIcon={<ArrowBack />}
                    onClick={onBack}
                >
                    Back
                </Button>

            </Box>
        );
    }


    /* =====================================================
       EXTRACT DATA
    ===================================================== */

    const wishlistItemIdValue =
        item.wishlistItemId ??
        item.WishlistItemId ??
        item.id ??
        item.Id ??
        itemId;


    const wishlistId =
        item.wishlistId ??
        item.WishlistId ??
        "-";


    const productId =
        item.productId ??
        item.ProductId ??
        "-";


    const productName =
        item.productName ??
        item.ProductName ??
        item.name ??
        item.Name ??
        `Product #${productId}`;


    const productCode =
        item.productCode ??
        item.ProductCode ??
        "-";


    const quantity =
        item.quantity ??
        item.Quantity ??
        0;


    const price =
        item.price ??
        item.Price ??
        0;


    const status =
        item.status ??
        item.Status ??
        "Active";


    const createdDate =
        item.createdDate ??
        item.CreatedDate ??
        item.createdAt ??
        item.CreatedAt;


    /* =====================================================
       RENDER
    ===================================================== */

    return (
        <Box sx={{ p: 3 }}>

            {/* =================================================
               HEADER
            ================================================= */}

            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    flexWrap: "wrap",
                    gap: 2,
                    mb: 3
                }}
            >

                <Box>

                    <Button
                        startIcon={<ArrowBack />}
                        onClick={onBack}
                        sx={{ mb: 1 }}
                    >
                        Back
                    </Button>

                    <Typography
                        variant="h4"
                        fontWeight={700}
                    >
                        Wishlist Item Details
                    </Typography>

                </Box>


                <Box
                    sx={{
                        display: "flex",
                        gap: 1
                    }}
                >

                    {/* EDIT */}

                    <Button
                        variant="outlined"
                        startIcon={<Edit />}
                        onClick={() => onEdit?.(item)}
                    >
                        Edit
                    </Button>


                    {/* DELETE */}

                    <Button
                        variant="outlined"
                        color="error"
                        startIcon={<Delete />}
                        onClick={() => onDelete?.(item)}
                    >
                        Delete
                    </Button>

                </Box>

            </Box>


            {/* =================================================
               MAIN CARD
            ================================================= */}

            <Card elevation={2}>

                <CardContent sx={{ p: 3 }}>

                    {/* =================================================
                       PRODUCT HEADER
                    ================================================= */}

                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 2,
                            mb: 3
                        }}
                    >

                        <Favorite
                            sx={{
                                fontSize: 50,
                                color: "error.main"
                            }}
                        />

                        <Box>

                            <Typography
                                variant="h5"
                                fontWeight={700}
                            >
                                {productName}
                            </Typography>

                            <Typography
                                color="text.secondary"
                            >
                                SKU: {productCode}
                            </Typography>

                        </Box>

                    </Box>


                    <Divider sx={{ mb: 3 }} />


                    {/* =================================================
                       DETAILS
                    ================================================= */}

                    <Grid
                        container
                        spacing={3}
                    >

                        {/* WISHLIST ITEM ID */}

                        <Grid item xs={12} sm={6} md={3}>

                            <Typography
                                variant="caption"
                                color="text.secondary"
                            >
                                Wishlist Item ID
                            </Typography>

                            <Typography fontWeight={600}>
                                {wishlistItemIdValue}
                            </Typography>

                        </Grid>


                        {/* WISHLIST ID */}

                        <Grid item xs={12} sm={6} md={3}>

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


                        {/* PRODUCT ID */}

                        <Grid item xs={12} sm={6} md={3}>

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


                        {/* STATUS */}

                        <Grid item xs={12} sm={6} md={3}>

                            <Typography
                                variant="caption"
                                color="text.secondary"
                            >
                                Status
                            </Typography>

                            <Box sx={{ mt: 0.5 }}>

                                <Chip
                                    label={status}
                                    size="small"
                                    color={
                                        String(status).toLowerCase() === "active"
                                            ? "success"
                                            : "default"
                                    }
                                />

                            </Box>

                        </Grid>


                        {/* QUANTITY */}

                        <Grid item xs={12} sm={6}>

                            <Typography
                                variant="caption"
                                color="text.secondary"
                            >
                                Quantity
                            </Typography>

                            <Typography
                                variant="h6"
                                fontWeight={700}
                            >
                                {quantity}
                            </Typography>

                        </Grid>


                        {/* PRICE */}

                        <Grid item xs={12} sm={6}>

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


                        {/* CREATED DATE */}

                        {createdDate && (

                            <Grid item xs={12}>

                                <Typography
                                    variant="caption"
                                    color="text.secondary"
                                >
                                    Created Date
                                </Typography>

                                <Typography>
                                    {new Date(
                                        createdDate
                                    ).toLocaleString("en-IN")}
                                </Typography>

                            </Grid>

                        )}

                    </Grid>

                </CardContent>

            </Card>

        </Box>
    );
};


export default WishlistItemsDetails;