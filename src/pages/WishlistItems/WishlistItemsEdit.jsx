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
   RESPONSE HELPER
========================================================= */

const getResponseData = (response) => {

    if (!response) {
        return null;
    }

    return (
        response.data?.data ??
        response.data
    );
};


/* =========================================================
   ID HELPER
========================================================= */

const getItemId = ({
    wishlistItemId,
    id,
    item,
    wishlistItem
}) => {

    const value =
        wishlistItemId ??
        id ??
        item?.wishlistItemId ??
        item?.WishlistItemId ??
        wishlistItem?.wishlistItemId ??
        wishlistItem?.WishlistItemId;

    if (
        value === null ||
        value === undefined ||
        value === ""
    ) {
        return null;
    }

    const numericId = Number(value);

    return Number.isFinite(numericId)
        ? numericId
        : null;
};


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

    /* =====================================================
       ITEM ID
    ===================================================== */

    const itemId = getItemId({
        wishlistItemId,
        id,
        item,
        wishlistItem
    });


    /* =====================================================
       INITIAL ITEM
    ===================================================== */

    const initialItem =
        item ||
        wishlistItem ||
        null;


    /* =====================================================
       STATE
    ===================================================== */

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
       LOAD WISHLIST ITEM
    ===================================================== */

    const loadWishlistItem = async () => {

        /*
         * If the parent already supplied the item,
         * don't unnecessarily call GET /{id}.
         */

        if (currentItem) {

            console.log(
                "WISHLIST ITEM PROVIDED BY PARENT:",
                currentItem
            );

            return currentItem;
        }


        if (!itemId) {

            throw new Error(
                "Wishlist Item ID is missing."
            );
        }


        const url =
            `${WISHLIST_ITEM_API}/${itemId}`;


        console.log(
            "LOADING WISHLIST ITEM:",
            url
        );


        try {

            const response =
                await axios.get(url);


            const data =
                getResponseData(response);


            console.log(
                "WISHLIST ITEM RESPONSE:",
                data
            );


            if (!data) {

                throw new Error(
                    "Wishlist item was not returned by the API."
                );
            }


            setCurrentItem(data);

            return data;

        } catch (err) {

            console.error(
                "WISHLIST ITEM GET ERROR:",
                {
                    url,
                    status: err.response?.status,
                    response: err.response?.data,
                    error: err
                }
            );

            throw err;
        }
    };


    /* =====================================================
       LOAD WISHLISTS
    ===================================================== */

    const loadWishlists = async () => {

        const url =
            WISHLIST_API;


        console.log(
            "LOADING WISHLISTS:",
            url
        );


        try {

            const response =
                await axios.get(url);


            const data =
                getResponseData(response);


            console.log(
                "WISHLISTS RESPONSE:",
                data
            );


            setWishlists(
                Array.isArray(data)
                    ? data
                    : []
            );

        } catch (err) {

            console.error(
                "WISHLIST LIST ERROR:",
                {
                    url,
                    status: err.response?.status,
                    response: err.response?.data,
                    error: err
                }
            );

            /*
             * Don't prevent the edit form from opening
             * just because the dropdown API failed.
             */

            setWishlists([]);
        }
    };


    /* =====================================================
       LOAD PRODUCTS
    ===================================================== */

    const loadProducts = async () => {

        const url =
            PRODUCT_API;


        console.log(
            "LOADING PRODUCTS:",
            url
        );


        try {

            const response =
                await axios.get(url);


            const data =
                getResponseData(response);


            console.log(
                "PRODUCTS RESPONSE:",
                data
            );


            setProducts(
                Array.isArray(data)
                    ? data
                    : []
            );

        } catch (err) {

            console.error(
                "PRODUCT LIST ERROR:",
                {
                    url,
                    status: err.response?.status,
                    response: err.response?.data,
                    error: err
                }
            );

            /*
             * Don't prevent the edit form from opening.
             */

            setProducts([]);
        }
    };


    /* =====================================================
       LOAD ALL DATA
    ===================================================== */

    const loadData = async () => {

        try {

            setLoading(true);
            setError("");


            /*
             * First load the actual item.
             *
             * This is the important request for Edit.
             */

            await loadWishlistItem();


            /*
             * Load dropdown data independently.
             */

            await Promise.all([
                loadWishlists(),
                loadProducts()
            ]);

        } catch (err) {

            console.error(
                "LOAD WISHLIST ITEM EDIT ERROR:",
                err
            );


            const status =
                err.response?.status;


            if (status === 404) {

                setError(
                    `Wishlist item ${itemId} was not found. ` +
                    `Please verify that this WishlistItemId exists in the database.`
                );

            } else {

                setError(
                    err.response?.data?.message ||
                    err.response?.data?.title ||
                    err.message ||
                    "Unable to load wishlist item."
                );
            }

        } finally {

            setLoading(false);
        }
    };


    /* =====================================================
       EFFECT
    ===================================================== */

    useEffect(() => {

        /*
         * Reset state when editing another item.
         */

        setCurrentItem(
            item ||
            wishlistItem ||
            null
        );

        setOpen(true);

        loadData();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        itemId
    ]);


    /* =====================================================
       UPDATE
    ===================================================== */

    const handleUpdate = async (payload) => {

        try {

            setSaving(true);
            setError("");


            const updateId =
                payload?.wishlistItemId ??
                payload?.WishlistItemId ??
                currentItem?.wishlistItemId ??
                currentItem?.WishlistItemId ??
                itemId;


            const numericUpdateId =
                Number(updateId);


            if (
                !Number.isFinite(numericUpdateId) ||
                numericUpdateId <= 0
            ) {

                setError(
                    "Invalid Wishlist Item ID."
                );

                return;
            }


            const url =
                `${WISHLIST_ITEM_API}/${numericUpdateId}`;


            console.log(
                "UPDATING WISHLIST ITEM:",
                url
            );

            console.log(
                "UPDATE PAYLOAD:",
                payload
            );


            const response =
                await axios.put(
                    url,
                    payload
                );


            const updatedItem =
                getResponseData(response);


            console.log(
                "WISHLIST ITEM UPDATED:",
                updatedItem
            );


            setCurrentItem(
                updatedItem
            );

            setOpen(false);


            if (
                typeof onUpdated === "function"
            ) {

                onUpdated(
                    updatedItem
                );
            }


            if (
                typeof onBack === "function"
            ) {

                onBack();
            }

        } catch (err) {

            console.error(
                "UPDATE WISHLIST ITEM ERROR:",
                {
                    url:
                        `${WISHLIST_ITEM_API}/${payload?.wishlistItemId ?? payload?.WishlistItemId ?? itemId}`,

                    status:
                        err.response?.status,

                    response:
                        err.response?.data,

                    error:
                        err
                }
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

        if (
            typeof onBack === "function"
        ) {

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

                {itemId && (
                    <Typography
                        variant="caption"
                        color="text.secondary"
                    >
                        Wishlist Item ID: {itemId}
                    </Typography>
                )}

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


                <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mt: 2 }}
                >
                    API Endpoint:
                </Typography>


                <Typography
                    variant="body2"
                    sx={{
                        fontFamily: "monospace",
                        wordBreak: "break-all"
                    }}
                >
                    {itemId
                        ? `${WISHLIST_ITEM_API}/${itemId}`
                        : WISHLIST_ITEM_API
                    }
                </Typography>


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

            {/* =========================================
               HEADER
            ========================================= */}

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


                <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mt: 0.5 }}
                >
                    Wishlist Item ID:{" "}
                    {currentItem?.wishlistItemId ??
                        currentItem?.WishlistItemId ??
                        itemId}
                </Typography>

            </Box>


            {/* =========================================
               ERROR
            ========================================= */}

            {error && (

                <Alert
                    severity="error"
                    sx={{ mb: 2 }}
                >
                    {error}
                </Alert>
            )}


            {/* =========================================
               MODAL
            ========================================= */}

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
