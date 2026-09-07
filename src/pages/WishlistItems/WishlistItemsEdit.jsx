import React, { useEffect, useState } from "react";

import {
    Box,
    Typography,
    Alert,
    Button,
    CircularProgress
} from "@mui/material";

import {
    ArrowBack
} from "@mui/icons-material";

import axios from "axios";

import WishlistItemModal from "./WishlistItemModal";


/* =========================================================
   CONFIGURATION
========================================================= */

const SERVER_URL =
    import.meta.env.VITE_SERVER_URL || "http://localhost:5000";

const WISHLIST_ITEM_API =
    `${SERVER_URL}/api/WishlistItem`;

const WISHLIST_API =
    `${SERVER_URL}/api/Wishlist`;

const PRODUCT_API =
    `${SERVER_URL}/api/Product`;


/* =========================================================
   COMPONENT
========================================================= */

const WishlistItemsEdit = ({
    wishlistItemId,
    id,

    item,
    wishlistItem,

    onBack,
    onUpdated
}) => {

    const itemId =
        wishlistItemId ??
        id ??
        item?.wishlistItemId ??
        item?.WishlistItemId ??
        wishlistItem?.wishlistItemId ??
        wishlistItem?.WishlistItemId;


    const initialItem =
        item ||
        wishlistItem ||
        null;


    const [currentItem, setCurrentItem] =
        useState(initialItem);


    const [wishlists, setWishlists] =
        useState([]);

    const [products, setProducts] =
        useState([]);


    const [loading, setLoading] =
        useState(true);

    const [saving, setSaving] =
        useState(false);

    const [error, setError] =
        useState("");

    const [open, setOpen] =
        useState(true);


    /* =====================================================
       LOAD DATA
    ===================================================== */

    const loadData = async () => {

        try {

            setLoading(true);
            setError("");


            const requests = [

                axios.get(WISHLIST_API),

                axios.get(PRODUCT_API)

            ];


            if (!currentItem && itemId) {

                requests.push(
                    axios.get(
                        `${WISHLIST_ITEM_API}/${itemId}`
                    )
                );

            }


            const responses =
                await Promise.all(requests);


            const wishlistData =
                responses[0].data?.data ??
                responses[0].data;

            const productData =
                responses[1].data?.data ??
                responses[1].data;


            setWishlists(
                Array.isArray(wishlistData)
                    ? wishlistData
                    : []
            );

            setProducts(
                Array.isArray(productData)
                    ? productData
                    : []
            );


            if (!currentItem && responses[2]) {

                const itemData =
                    responses[2].data?.data ??
                    responses[2].data;

                setCurrentItem(itemData);
            }


        } catch (err) {

            console.error(
                "LOAD WISHLIST ITEM EDIT ERROR:",
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


    useEffect(() => {
        loadData();
    }, [itemId]);


    /* =====================================================
       UPDATE
    ===================================================== */

    const handleUpdate = async (payload) => {

        try {

            setSaving(true);
            setError("");


            const updateId =
                payload.wishlistItemId ??
                payload.WishlistItemId ??
                itemId;


            const response =
                await axios.put(
                    `${WISHLIST_ITEM_API}/${updateId}`,
                    payload
                );


            const updatedItem =
                response.data?.data ??
                response.data;


            setCurrentItem(updatedItem);

            setOpen(false);


            if (typeof onUpdated === "function") {
                onUpdated(updatedItem);
            }


            if (typeof onBack === "function") {
                onBack();
            }

        } catch (err) {

            console.error(
                "UPDATE WISHLIST ITEM ERROR:",
                err
            );

            setError(
                err.response?.data?.message ||
                err.response?.data?.title ||
                "Unable to update wishlist item."
            );

        } finally {

            setSaving(false);

        }
    };


    /* =====================================================
       CLOSE
    ===================================================== */

    const handleClose = () => {

        setOpen(false);

        if (typeof onBack === "function") {
            onBack();
        }
    };


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
                    Loading Wishlist Item...
                </Typography>

            </Box>
        );
    }


    /* =====================================================
       ERROR
    ===================================================== */

    if (error && !currentItem) {

        return (
            <Box sx={{ p: 3 }}>

                <Alert severity="error">
                    {error}
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
       NO ITEM
    ===================================================== */

    if (!currentItem) {

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
       RENDER
    ===================================================== */

    return (
        <Box sx={{ p: 3 }}>

            {/* HEADER */}

            <Box sx={{ mb: 3 }}>

                <Button
                    startIcon={<ArrowBack />}
                    onClick={handleClose}
                >
                    Back
                </Button>

                <Typography
                    variant="h4"
                    fontWeight={700}
                    sx={{ mt: 1 }}
                >
                    Edit Wishlist Item
                </Typography>

            </Box>


            {/* ERROR */}

            {error && (

                <Alert
                    severity="error"
                    sx={{ mb: 2 }}
                >
                    {error}
                </Alert>

            )}


            {/* MODAL */}

            <WishlistItemModal
                open={open}
                onClose={handleClose}
                onSave={handleUpdate}
                item={currentItem}
                loading={saving}
                wishlistOptions={wishlists}
                productOptions={products}
            />

        </Box>
    );
};


export default WishlistItemsEdit;

