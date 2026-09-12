import React, {
    useCallback,
    useEffect,
    useState
} from "react";

import {
    Alert,
    Box,
    Button,
    CircularProgress,
    Typography
} from "@mui/material";

import {
    Refresh
} from "@mui/icons-material";

import {
    useNavigate
} from "react-router-dom";

import axios from "axios";

import WishlistItemTable from "./WishlistTable";


// =========================================================
// NODE SERVER
// React -> Node -> ASP.NET Core
// =========================================================

const SERVER_URL =
    "http://localhost:5000";

const API_URL =
    `${SERVER_URL}/api`;


// =========================================================
// WISHLIST ITEM LIST
// =========================================================

const WishlistList = () => {

    const navigate =
        useNavigate();


    // =====================================================
    // STATE
    // =====================================================

    const [
        wishlistItems,
        setWishlistItems
    ] = useState([]);

    const [
        loading,
        setLoading
    ] = useState(true);

    const [
        error,
        setError
    ] = useState("");


    // =====================================================
    // LOAD WISHLIST ITEMS
    // =====================================================

    const loadWishlistItems =
        useCallback(async () => {

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
                    "URL:",
                    `${API_URL}/WishlistItem`
                );

                console.log(
                    "================================================"
                );


                const response =
                    await axios.get(
                        `${API_URL}/WishlistItem`,
                        {
                            timeout: 30000
                        }
                    );


                console.log(
                    "WISHLIST ITEMS RESPONSE:",
                    response.data
                );


                // =================================================
                // ASP.NET CURRENT RESPONSE IS A DIRECT ARRAY
                //
                // [
                //   {
                //     wishlistItemId: 2,
                //     wishlistId: 2,
                //     sellerId: 6,
                //     customerId: 3,
                //     productId: 6,
                //     createdDate: "..."
                //   }
                // ]
                // =================================================

                let data = [];


                if (
                    Array.isArray(
                        response.data
                    )
                ) {

                    data =
                        response.data;

                }

                else if (
                    Array.isArray(
                        response.data?.data
                    )
                ) {

                    data =
                        response.data.data;

                }

                else if (
                    Array.isArray(
                        response.data?.items
                    )
                ) {

                    data =
                        response.data.items;

                }

                else if (
                    Array.isArray(
                        response.data?.wishlistItems
                    )
                ) {

                    data =
                        response.data.wishlistItems;

                }


                console.log(
                    "NORMALIZED WISHLIST ITEMS:",
                    data
                );

                console.log(
                    "WISHLIST ITEM COUNT:",
                    data.length
                );


                setWishlistItems(
                    data
                );

            }

            catch (err) {

                console.error(
                    "================================================"
                );

                console.error(
                    "LOAD WISHLIST ITEMS ERROR"
                );

                console.error(
                    "MESSAGE:",
                    err.message
                );

                console.error(
                    "STATUS:",
                    err.response?.status
                );

                console.error(
                    "DATA:",
                    err.response?.data
                );

                console.error(
                    "================================================"
                );


                setWishlistItems([]);


                setError(
                    err.response?.data?.message ||
                    err.response?.data ||
                    err.message ||
                    "Failed to load wishlist items."
                );

            }

            finally {

                setLoading(false);

            }

        }, []);


    // =====================================================
    // INITIAL LOAD
    // =====================================================

    useEffect(() => {

        loadWishlistItems();

    }, [
        loadWishlistItems
    ]);


    // =====================================================
    // VIEW
    // =====================================================

    const handleView =
        useCallback(
            (wishlistItemId) => {

                const id =
                    Number(
                        wishlistItemId
                    );


                if (
                    !Number.isInteger(id) ||
                    id <= 0
                ) {

                    console.error(
                        "Invalid Wishlist Item ID:",
                        wishlistItemId
                    );

                    return;

                }


                console.log(
                    "VIEW WISHLIST ITEM:",
                    id
                );


                navigate(
                    `/wishlist-items/details/${id}`
                );

            },
            [
                navigate
            ]
        );


    // =====================================================
    // EDIT
    // =====================================================

    const handleEdit =
        useCallback(
            (wishlistItemId) => {

                const id =
                    Number(
                        wishlistItemId
                    );


                if (
                    !Number.isInteger(id) ||
                    id <= 0
                ) {

                    console.error(
                        "Invalid Wishlist Item ID:",
                        wishlistItemId
                    );

                    return;

                }


                console.log(
                    "EDIT WISHLIST ITEM:",
                    id
                );


                navigate(
                    `/wishlist-items/edit/${id}`
                );

            },
            [
                navigate
            ]
        );


    // =====================================================
    // DELETE
    // =====================================================

    const handleDelete =
        useCallback(
            async (wishlistItemId) => {

                const id =
                    Number(
                        wishlistItemId
                    );


                if (
                    !Number.isInteger(id) ||
                    id <= 0
                ) {

                    setError(
                        "Invalid Wishlist Item ID."
                    );

                    return;

                }


                const confirmed =
                    window.confirm(
                        "Are you sure you want to remove this wishlist item?"
                    );


                if (!confirmed) {

                    return;

                }


                try {

                    setError("");


                    console.log(
                        "DELETE WISHLIST ITEM:",
                        id
                    );


                    const response =
                        await axios.delete(
                            `${API_URL}/WishlistItem/${id}`,
                            {
                                timeout: 30000
                            }
                        );


                    console.log(
                        "DELETE WISHLIST ITEM SUCCESS:",
                        response.status,
                        response.data
                    );


                    // =============================================
                    // Remove immediately from UI
                    // =============================================

                    setWishlistItems(
                        previousItems =>
                            previousItems.filter(
                                item => {

                                    const itemId =
                                        Number(
                                            item?.wishlistItemId ??
                                            item?.WishlistItemId
                                        );

                                    return (
                                        itemId !== id
                                    );

                                }
                            )
                    );

                }

                catch (err) {

                    console.error(
                        "DELETE WISHLIST ITEM ERROR:",
                        err
                    );


                    console.error(
                        "STATUS:",
                        err.response?.status
                    );


                    console.error(
                        "DATA:",
                        err.response?.data
                    );


                    setError(
                        err.response?.data?.message ||
                        err.response?.data ||
                        err.message ||
                        "Failed to delete wishlist item."
                    );

                }

            },
            []
        );


    // =====================================================
    // LOADING
    // =====================================================

    if (loading) {

        return (

            <Box
                sx={{
                    width: "100%",
                    minHeight: 300,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
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

        );

    }


    // =====================================================
    // PAGE
    // =====================================================

    return (

        <Box
            sx={{
                width: "100%",
                p: 3
            }}
        >

            {/* =================================================
                HEADER
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
                        sx={{
                            mt: 0.5
                        }}
                    >
                        Manage wishlist items
                    </Typography>

                </Box>


                <Button
                    variant="outlined"
                    startIcon={
                        <Refresh />
                    }
                    onClick={
                        loadWishlistItems
                    }
                    disabled={
                        loading
                    }
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
                    sx={{
                        mb: 3
                    }}
                    onClose={() =>
                        setError("")
                    }
                >

                    {String(error)}

                </Alert>

            )}


            {/* =================================================
                TABLE
            ================================================= */}

            <WishlistItemTable

                items={
                    wishlistItems
                }

                onView={
                    handleView
                }

                onEdit={
                    handleEdit
                }

                onDelete={
                    handleDelete
                }

            />

        </Box>

    );

};


export default WishlistList;
