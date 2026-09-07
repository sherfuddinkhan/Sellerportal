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
    Favorite,
    Person
} from "@mui/icons-material";

import axios from "axios";


/* =========================================================
   CONFIGURATION
========================================================= */

const SERVER_URL =
    import.meta.env.VITE_SERVER_URL || "http://localhost:5000";

const WISHLIST_API =
    `${SERVER_URL}/api/Wishlist`;


/* =========================================================
   COMPONENT
========================================================= */

const WishlistDetails = ({
    wishlistId,
    id,
    onBack,
    onEdit,
    onDelete
}) => {

    const itemId =
        wishlistId ??
        id;


    /* =====================================================
       STATE
    ===================================================== */

    const [wishlist, setWishlist] = useState(null);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");


    /* =====================================================
       LOAD WISHLIST
    ===================================================== */

    const loadWishlist = async () => {

        if (!itemId) {

            setError("Wishlist ID is required.");

            setLoading(false);

            return;
        }


        try {

            setLoading(true);

            setError("");


            const response = await axios.get(
                `${WISHLIST_API}/${itemId}`
            );


            const data =
                response.data?.data ??
                response.data;


            setWishlist(data);

        } catch (err) {

            console.error(
                "LOAD WISHLIST ERROR:",
                err
            );


            setError(
                err.response?.data?.message ||
                err.response?.data?.title ||
                (
                    typeof err.response?.data === "string"
                        ? err.response.data
                        : null
                ) ||
                "Unable to load wishlist."
            );

        } finally {

            setLoading(false);

        }
    };


    /* =====================================================
       LOAD WHEN ID CHANGES
    ===================================================== */

    useEffect(() => {

        loadWishlist();

    }, [itemId]);


    /* =====================================================
       LOADING
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
                    Loading Wishlist...
                </Typography>

            </Box>
        );
    }


    /* =====================================================
       ERROR
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

    if (!wishlist) {

        return (
            <Box sx={{ p: 3 }}>

                <Alert severity="warning">
                    Wishlist not found.
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

    const wishlistIdValue =
        wishlist.wishlistId ??
        wishlist.WishlistId ??
        wishlist.id ??
        wishlist.Id ??
        itemId;


    const customerId =
        wishlist.customerId ??
        wishlist.CustomerId ??
        "-";


    const customerName =
        wishlist.customerName ??
        wishlist.CustomerName ??
        wishlist.customer?.customerName ??
        wishlist.Customer?.CustomerName ??
        `Customer #${customerId}`;


    const sellerId =
        wishlist.sellerId ??
        wishlist.SellerId ??
        "-";


    const status =
        wishlist.status ??
        wishlist.Status ??
        "Active";


    const createdDate =
        wishlist.createdDate ??
        wishlist.CreatedDate ??
        wishlist.createdAt ??
        wishlist.CreatedAt;


    const updatedDate =
        wishlist.updatedDate ??
        wishlist.UpdatedDate ??
        wishlist.updatedAt ??
        wishlist.UpdatedAt;


    /* =====================================================
       WISHLIST ITEMS
    ===================================================== */

    const items =
        wishlist.items ??
        wishlist.Items ??
        wishlist.wishlistItems ??
        wishlist.WishlistItems ??
        [];


    /* =====================================================
       STATUS COLOR
    ===================================================== */

    const getStatusColor = (value) => {

        switch (
            String(value)
                .toLowerCase()
                .trim()
        ) {

            case "active":
                return "success";

            case "inactive":
                return "warning";

            case "removed":
                return "error";

            default:
                return "default";
        }
    };


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
                        Wishlist Details
                    </Typography>

                </Box>


                <Box
                    sx={{
                        display: "flex",
                        gap: 1
                    }}
                >

                    <Button
                        variant="outlined"
                        startIcon={<Edit />}
                        onClick={() =>
                            onEdit?.(wishlist)
                        }
                    >
                        Edit
                    </Button>


                    <Button
                        variant="outlined"
                        color="error"
                        startIcon={<Delete />}
                        onClick={() =>
                            onDelete?.(wishlist)
                        }
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
                       WISHLIST HEADER
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
                                fontSize: 55,
                                color: "error.main"
                            }}
                        />

                        <Box>

                            <Typography
                                variant="h5"
                                fontWeight={700}
                            >
                                Wishlist #{wishlistIdValue}
                            </Typography>

                            <Typography
                                color="text.secondary"
                            >
                                Customer Wishlist
                            </Typography>

                        </Box>

                    </Box>


                    <Divider sx={{ mb: 3 }} />


                    {/* =================================================
                       BASIC DETAILS
                    ================================================= */}

                    <Grid
                        container
                        spacing={3}
                    >

                        {/* WISHLIST ID */}

                        <Grid
                            item
                            xs={12}
                            sm={6}
                            md={3}
                        >

                            <Typography
                                variant="caption"
                                color="text.secondary"
                            >
                                Wishlist ID
                            </Typography>

                            <Typography fontWeight={600}>
                                {wishlistIdValue}
                            </Typography>

                        </Grid>


                        {/* CUSTOMER ID */}

                        <Grid
                            item
                            xs={12}
                            sm={6}
                            md={3}
                        >

                            <Typography
                                variant="caption"
                                color="text.secondary"
                            >
                                Customer ID
                            </Typography>

                            <Typography fontWeight={600}>
                                {customerId}
                            </Typography>

                        </Grid>


                        {/* CUSTOMER */}

                        <Grid
                            item
                            xs={12}
                            sm={6}
                            md={3}
                        >

                            <Typography
                                variant="caption"
                                color="text.secondary"
                            >
                                Customer
                            </Typography>

                            <Box
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 1
                                }}
                            >

                                <Person
                                    fontSize="small"
                                    color="action"
                                />

                                <Typography fontWeight={600}>
                                    {customerName}
                                </Typography>

                            </Box>

                        </Grid>


                        {/* SELLER ID */}

                        <Grid
                            item
                            xs={12}
                            sm={6}
                            md={3}
                        >

                            <Typography
                                variant="caption"
                                color="text.secondary"
                            >
                                Seller ID
                            </Typography>

                            <Typography fontWeight={600}>
                                {sellerId}
                            </Typography>

                        </Grid>


                        {/* STATUS */}

                        <Grid
                            item
                            xs={12}
                            sm={6}
                        >

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
                                    color={getStatusColor(status)}
                                />

                            </Box>

                        </Grid>


                        {/* CREATED DATE */}

                        {createdDate && (

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

                                <Typography>
                                    {new Date(
                                        createdDate
                                    ).toLocaleString("en-IN")}
                                </Typography>

                            </Grid>

                        )}


                        {/* UPDATED DATE */}

                        {updatedDate && (

                            <Grid
                                item
                                xs={12}
                                sm={6}
                            >

                                <Typography
                                    variant="caption"
                                    color="text.secondary"
                                >
                                    Updated Date
                                </Typography>

                                <Typography>
                                    {new Date(
                                        updatedDate
                                    ).toLocaleString("en-IN")}
                                </Typography>

                            </Grid>

                        )}

                    </Grid>


                    {/* =================================================
                       WISHLIST ITEMS
                    ================================================= */}

                    {items.length > 0 && (

                        <>

                            <Divider sx={{ my: 4 }} />

                            <Typography
                                variant="h6"
                                fontWeight={700}
                                sx={{ mb: 2 }}
                            >
                                Wishlist Items
                            </Typography>


                            <Grid
                                container
                                spacing={2}
                            >

                                {items.map(
                                    (wishlistItem, index) => {

                                        const itemIdValue =
                                            wishlistItem.wishlistItemId ??
                                            wishlistItem.WishlistItemId ??
                                            wishlistItem.id ??
                                            wishlistItem.Id ??
                                            index + 1;


                                        const productId =
                                            wishlistItem.productId ??
                                            wishlistItem.ProductId ??
                                            "-";


                                        const productName =
                                            wishlistItem.productName ??
                                            wishlistItem.ProductName ??
                                            wishlistItem.product?.productName ??
                                            wishlistItem.Product?.ProductName ??
                                            `Product #${productId}`;


                                        const quantity =
                                            wishlistItem.quantity ??
                                            wishlistItem.Quantity ??
                                            0;


                                        return (
                                            <Grid
                                                item
                                                xs={12}
                                                sm={6}
                                                md={4}
                                                key={itemIdValue}
                                            >

                                                <Card
                                                    variant="outlined"
                                                >

                                                    <CardContent>

                                                        <Typography
                                                            fontWeight={700}
                                                        >
                                                            {productName}
                                                        </Typography>

                                                        <Typography
                                                            variant="body2"
                                                            color="text.secondary"
                                                        >
                                                            Product ID: {productId}
                                                        </Typography>

                                                        <Typography
                                                            variant="body2"
                                                            sx={{ mt: 1 }}
                                                        >
                                                            Quantity: {quantity}
                                                        </Typography>

                                                    </CardContent>

                                                </Card>

                                            </Grid>
                                        );
                                    }
                                )}

                            </Grid>

                        </>

                    )}

                </CardContent>

            </Card>

        </Box>
    );
};


export default WishlistDetails;