
import React, { useEffect, useState } from "react";

import {
    Box,
    Typography,
    Alert,
    Button,
    CircularProgress
} from "@mui/material";

import {
    Refresh
} from "@mui/icons-material";

import axios from "axios";

import WishlistItemTable from "./WishlistTable";


/* =========================================================
   SERVER URL
========================================================= */

const SERVER_URL = "http://localhost:5000";


/* =========================================================
   WISHLIST ITEM LIST
========================================================= */

const WishlistList = () => {

    /* =====================================================
       STATE
    ===================================================== */

    const [wishlistItems, setWishlistItems] = useState([]);

    const [loading, setLoading] = useState(false);

    const [error, setError] = useState("");


    /* =====================================================
       LOAD ALL WISHLIST ITEMS
    ===================================================== */

    const loadWishlistItems = async () => {

        try {

            setLoading(true);
            setError("");

            console.log(
                "================================================"
            );

            console.log(
                "GET ALL WISHLIST ITEMS"
            );

            console.log(
                "================================================"
            );


            const response = await axios.get(
                `${SERVER_URL}/api/WishlistItem`
            );


            console.log(
                "WISHLIST ITEMS RESPONSE:",
                response.data
            );


            /* =============================================
               NORMALIZE API RESPONSE
            ============================================= */

            let data = [];


            if (Array.isArray(response.data)) {

                data = response.data;

            } else if (
                Array.isArray(response.data?.data)
            ) {

                data = response.data.data;

            } else if (
                Array.isArray(response.data?.items)
            ) {

                data = response.data.items;

            } else if (
                Array.isArray(response.data?.wishlistItems)
            ) {

                data = response.data.wishlistItems;

            }


            console.log(
                "NORMALIZED WISHLIST ITEMS:",
                data
            );


            setWishlistItems(data);

        } catch (error) {

            console.error(
                "LOAD WISHLIST ITEMS ERROR:",
                error.response?.data || error.message
            );


            setError(
                error.response?.data?.message ||
                error.response?.data ||
                "Failed to load wishlist items."
            );


            setWishlistItems([]);

        } finally {

            setLoading(false);

        }
    };


    /* =====================================================
       LOAD ON COMPONENT MOUNT
    ===================================================== */

    useEffect(() => {

        loadWishlistItems();

    }, []);


    /* =====================================================
       VIEW
    ===================================================== */

    const handleView = (wishlistItemId) => {

        console.log(
            "VIEW WISHLIST ITEM:",
            wishlistItemId
        );

        // Navigation can be added here if required.
        // Example:
        //
        // navigate(
        //     `/wishlist-items/details/${wishlistItemId}`
        // );
    };


    /* =====================================================
       EDIT
    ===================================================== */

    const handleEdit = (wishlistItemId) => {

        console.log(
            "EDIT WISHLIST ITEM:",
            wishlistItemId
        );

        // Example:
        //
        // navigate(
        //     `/wishlist-items/edit/${wishlistItemId}`
        // );
    };


    /* =====================================================
       DELETE
    ===================================================== */

    const handleDelete = async (wishlistItemId) => {

        if (!wishlistItemId) {

            console.error(
                "Wishlist Item ID not found."
            );

            return;
        }


        const confirmed = window.confirm(
            "Are you sure you want to remove this wishlist item?"
        );


        if (!confirmed) {
            return;
        }


        try {

            console.log(
                `DELETE WISHLIST ITEM: ${wishlistItemId}`
            );


            await axios.delete(
                `${SERVER_URL}/api/WishlistItem/${wishlistItemId}`
            );


            /* =============================================
               REMOVE FROM UI
            ============================================= */

            setWishlistItems((previous) =>
                previous.filter((item) => {

                    const id =
                        item?.wishlistItemId ??
                        item?.WishlistItemId ??
                        item?.id ??
                        item?.Id;

                    return id !== wishlistItemId;

                })
            );


            console.log(
                "WISHLIST ITEM DELETED SUCCESSFULLY"
            );

        } catch (error) {

            console.error(
                "DELETE WISHLIST ITEM ERROR:",
                error.response?.data || error.message
            );


            setError(
                error.response?.data?.message ||
                error.response?.data ||
                "Failed to delete wishlist item."
            );
        }
    };


    /* =====================================================
       RETRY / REFRESH
    ===================================================== */

    const handleRetry = () => {

        loadWishlistItems();

    };


    /* =====================================================
       RENDER
    ===================================================== */

    return (

        <Box
            sx={{
                width: "100%",
                p: 3
            }}
        >

            {/* =================================================
                PAGE HEADER
            ================================================= */}

            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    mb: 3
                }}
            >

                <Box>

                    <Typography
                        variant="h5"
                        fontWeight={700}
                    >
                        Wishlist Items
                    </Typography>


                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mt: 0.5 }}
                    >
                        Manage wishlist items
                    </Typography>

                </Box>


                <Button
                    variant="outlined"
                    startIcon={<Refresh />}
                    onClick={handleRetry}
                    disabled={loading}
                >
                    Refresh
                </Button>

            </Box>


            {/* =================================================
                ERROR
            ================================================= */}

            {error && (

                <Alert
                    severity="error"
                    sx={{ mb: 3 }}
                    action={
                        <Button
                            color="inherit"
                            size="small"
                            onClick={handleRetry}
                        >
                            Retry
                        </Button>
                    }
                >
                    {error}
                </Alert>

            )}


            {/* =================================================
                LOADING
            ================================================= */}

            {loading && wishlistItems.length === 0 ? (

                <Box
                    sx={{
                        minHeight: 300,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 2
                    }}
                >

                    <CircularProgress />


                    <Typography
                        color="text.secondary"
                    >
                        Loading wishlist items...
                    </Typography>

                </Box>

            ) : (

                /* =============================================
                   WISHLIST ITEM TABLE
                ============================================= */

                <WishlistItemTable
                    items={wishlistItems}
                    wishlistItems={wishlistItems}
                    loading={loading}
                    onView={handleView}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                />

            )}

        </Box>
    );
};


export default WishlistList;
