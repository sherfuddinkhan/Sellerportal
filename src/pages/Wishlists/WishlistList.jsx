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

import WishlistTable from "./WishlistTable";


// ============================================================
// NODE SERVER
// ============================================================

const SERVER_URL =
    import.meta.env.VITE_SERVER_URL ||
    "http://localhost:5000";

const API_URL =
    `${SERVER_URL}/api`;

const WISHLIST_API =
    `${API_URL}/Wishlist`;


// ============================================================
// COMPONENT
// ============================================================

const WishlistList = () => {

    const navigate =
        useNavigate();


    // ========================================================
    // STATE
    // ========================================================

    const [
        wishlists,
        setWishlists
    ] = useState([]);

    const [
        loading,
        setLoading
    ] = useState(true);

    const [
        error,
        setError
    ] = useState("");


    // ========================================================
    // ERROR MESSAGE
    // ========================================================

    const getErrorMessage = (err) => {

        const data =
            err?.response?.data;

        if (
            typeof data === "string" &&
            data.trim()
        ) {
            return data;
        }

        if (data?.message) {
            return data.message;
        }

        if (data?.title) {
            return data.title;
        }

        if (data?.errors) {

            const messages =
                Object.values(data.errors)
                    .flat()
                    .filter(Boolean);

            if (messages.length > 0) {
                return messages.join(" ");
            }
        }

        return (
            err?.message ||
            "Failed to load wishlists."
        );
    };


    // ========================================================
    // LOAD WISHLISTS
    // ========================================================

    const loadWishlists =
        useCallback(async () => {

            try {

                setLoading(true);
                setError("");


                console.log(
                    "================================================"
                );

                console.log(
                    "GET ALL WISHLISTS"
                );

                console.log(
                    "URL:",
                    WISHLIST_API
                );

                console.log(
                    "================================================"
                );


                const response =
                    await axios.get(
                        WISHLIST_API,
                        {
                            timeout: 30000
                        }
                    );


                console.log(
                    "WISHLIST RESPONSE:",
                    response.data
                );


                // =================================================
                // ASP.NET CURRENT RESPONSE
                //
                // [
                //   {
                //     wishlistId: 1,
                //     customerId: 3,
                //     sellerId: 6,
                //     status: "Active"
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
                        response.data?.wishlists
                    )
                ) {

                    data =
                        response.data.wishlists;

                }


                console.log(
                    "NORMALIZED WISHLISTS:",
                    data
                );

                console.log(
                    "WISHLIST COUNT:",
                    data.length
                );


                setWishlists(data);

            }

            catch (err) {

                console.error(
                    "================================================"
                );

                console.error(
                    "LOAD WISHLISTS ERROR"
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


                setWishlists([]);

                setError(
                    getErrorMessage(err)
                );

            }

            finally {

                setLoading(false);
            }

        }, []);


    // ========================================================
    // INITIAL LOAD
    // ========================================================

    useEffect(() => {

        loadWishlists();

    }, [
        loadWishlists
    ]);


    // ========================================================
    // VIEW
    // ========================================================

    const handleView =
        useCallback(
            (wishlist) => {

                const wishlistId =
                    wishlist?.wishlistId ??
                    wishlist?.WishlistId ??
                    wishlist?.id ??
                    wishlist?.Id;


                const id =
                    Number(wishlistId);


                if (
                    !Number.isInteger(id) ||
                    id <= 0
                ) {

                    console.error(
                        "Invalid Wishlist ID:",
                        wishlistId
                    );

                    setError(
                        "Invalid Wishlist ID."
                    );

                    return;
                }


                console.log(
                    "VIEW WISHLIST:",
                    id
                );


                navigate(
                    `/wishlists/details/${id}`
                );

            },
            [
                navigate
            ]
        );


    // ========================================================
    // EDIT
    // ========================================================

    const handleEdit =
        useCallback(
            (wishlist) => {

                const wishlistId =
                    wishlist?.wishlistId ??
                    wishlist?.WishlistId ??
                    wishlist?.id ??
                    wishlist?.Id;


                const id =
                    Number(wishlistId);


                if (
                    !Number.isInteger(id) ||
                    id <= 0
                ) {

                    console.error(
                        "Invalid Wishlist ID:",
                        wishlistId
                    );

                    setError(
                        "Invalid Wishlist ID."
                    );

                    return;
                }


                console.log(
                    "EDIT WISHLIST:",
                    id
                );


                navigate(
                    `/wishlists/edit/${id}`
                );

            },
            [
                navigate
            ]
        );


    // ========================================================
    // DELETE
    // ========================================================

    const handleDelete =
        useCallback(
            async (wishlist) => {

                const wishlistId =
                    wishlist?.wishlistId ??
                    wishlist?.WishlistId ??
                    wishlist?.id ??
                    wishlist?.Id;


                const id =
                    Number(wishlistId);


                if (
                    !Number.isInteger(id) ||
                    id <= 0
                ) {

                    setError(
                        "Invalid Wishlist ID."
                    );

                    return;
                }


                const confirmed =
                    window.confirm(
                        `Are you sure you want to delete Wishlist #${id}?`
                    );


                if (!confirmed) {
                    return;
                }


                try {

                    setError("");


                    console.log(
                        "DELETE WISHLIST:",
                        id
                    );


                    const response =
                        await axios.delete(
                            `${WISHLIST_API}/${id}`,
                            {
                                timeout: 30000
                            }
                        );


                    console.log(
                        "DELETE WISHLIST SUCCESS:",
                        response.status,
                        response.data
                    );


                    // =============================================
                    // Remove from UI
                    // =============================================

                    setWishlists(
                        previousWishlists =>
                            previousWishlists.filter(
                                item => {

                                    const itemId =
                                        Number(
                                            item?.wishlistId ??
                                            item?.WishlistId ??
                                            item?.id ??
                                            item?.Id
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
                        "DELETE WISHLIST ERROR:",
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
                        getErrorMessage(err)
                    );
                }

            },
            []
        );


    // ========================================================
    // LOADING
    // ========================================================

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
                    Loading wishlists...
                </Typography>

            </Box>
        );
    }


    // ========================================================
    // PAGE
    // ========================================================

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
                    flexWrap: "wrap",
                    gap: 2,
                    mb: 3
                }}
            >

                <Box>

                    <Typography
                        variant="h5"
                        fontWeight={700}
                    >
                        Wishlists
                    </Typography>

                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                            mt: 0.5
                        }}
                    >
                        Manage customer wishlists
                    </Typography>

                </Box>


                <Button
                    variant="outlined"
                    startIcon={<Refresh />}
                    onClick={loadWishlists}
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

            <WishlistTable

                wishlists={
                    wishlists
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

                loading={
                    loading
                }

            />

        </Box>
    );
};


export default WishlistList;
