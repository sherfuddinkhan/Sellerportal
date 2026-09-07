import React, { useEffect, useState } from "react";

import {
    Box,
    Typography,
    Alert,
    Button
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

const WishlistItemsCreate = ({
    onBack,
    onCreated
}) => {

    const [open, setOpen] = useState(true);

    const [loading, setLoading] = useState(false);

    const [loadingOptions, setLoadingOptions] =
        useState(false);

    const [error, setError] = useState("");

    const [wishlists, setWishlists] = useState([]);

    const [products, setProducts] = useState([]);


    /* =====================================================
       LOAD DROPDOWNS
    ===================================================== */

    const loadOptions = async () => {

        try {

            setLoadingOptions(true);
            setError("");

            const [
                wishlistResponse,
                productResponse
            ] = await Promise.all([

                axios.get(WISHLIST_API),

                axios.get(PRODUCT_API)

            ]);


            const wishlistData =
                wishlistResponse.data?.data ??
                wishlistResponse.data;

            const productData =
                productResponse.data?.data ??
                productResponse.data;


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

        } catch (err) {

            console.error(
                "LOAD WISHLIST ITEM OPTIONS ERROR:",
                err
            );

            setError(
                err.response?.data?.message ||
                "Unable to load wishlist and product options."
            );

        } finally {

            setLoadingOptions(false);

        }
    };


    useEffect(() => {
        loadOptions();
    }, []);


    /* =====================================================
       CREATE
    ===================================================== */

    const handleCreate = async (payload) => {

        try {

            setLoading(true);
            setError("");

            const response = await axios.post(
                WISHLIST_ITEM_API,
                payload
            );


            const createdItem =
                response.data?.data ??
                response.data;


            setOpen(false);

            if (typeof onCreated === "function") {
                onCreated(createdItem);
            }

            if (typeof onBack === "function") {
                onBack();
            }

        } catch (err) {

            console.error(
                "CREATE WISHLIST ITEM ERROR:",
                err
            );

            setError(
                err.response?.data?.message ||
                err.response?.data?.title ||
                "Unable to create wishlist item."
            );

        } finally {

            setLoading(false);

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
                    Create Wishlist Item
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
                onSave={handleCreate}
                loading={loading || loadingOptions}
                wishlistOptions={wishlists}
                productOptions={products}
            />

        </Box>
    );
};


export default WishlistItemsCreate;

