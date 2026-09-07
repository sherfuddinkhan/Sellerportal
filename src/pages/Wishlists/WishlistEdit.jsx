import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
    Box,
    Card,
    CardContent,
    Typography,
    TextField,
    Button,
    Alert,
    CircularProgress,
    Divider,
    MenuItem
} from "@mui/material";

import {
    ArrowBack,
    Save,
    Favorite
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

const WishlistEdit = ({
    wishlistId,
    id,
    wishlist,
    onBack,
    onUpdated
}) => {
  
    const editId =
        wishlistId ??
        id ??
        wishlist?.wishlistId ??
        wishlist?.WishlistId ??
        wishlist?.id ??
        wishlist?.Id;


    /* =====================================================
       FORM STATE
    ===================================================== */

    const [customerId, setCustomerId] = useState("");
    const [sellerId, setSellerId] = useState("");
    const [status, setStatus] = useState("Active");


    /* =====================================================
       STATE
    ===================================================== */

    const [loading, setLoading] = useState(false);
    const [loadingData, setLoadingData] = useState(true);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");


    /* =====================================================
       LOAD WISHLIST
    ===================================================== */

    const loadWishlist = async () => {

        if (!editId) {

            setError("Wishlist ID is required.");
            setLoadingData(false);

            return;
        }


        /* -------------------------------------------------
           USE PASSED WISHLIST WHEN AVAILABLE
        ------------------------------------------------- */

        if (wishlist) {

            setCustomerId(
                wishlist.customerId ??
                wishlist.CustomerId ??
                ""
            );

            setSellerId(
                wishlist.sellerId ??
                wishlist.SellerId ??
                ""
            );

            setStatus(
                wishlist.status ??
                wishlist.Status ??
                "Active"
            );

            setLoadingData(false);

            return;
        }


        /* -------------------------------------------------
           LOAD FROM API
        ------------------------------------------------- */

        try {

            setLoadingData(true);
            setError("");

            const response = await axios.get(
                `${WISHLIST_API}/${editId}`
            );


            const data =
                response.data?.data ??
                response.data;


            if (!data) {

                setError("Wishlist not found.");
                return;
            }


            setCustomerId(
                data.customerId ??
                data.CustomerId ??
                ""
            );


            setSellerId(
                data.sellerId ??
                data.SellerId ??
                ""
            );


            setStatus(
                data.status ??
                data.Status ??
                "Active"
            );

        } catch (err) {

            console.error(
                "LOAD WISHLIST FOR EDIT ERROR:",
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

            setLoadingData(false);

        }
    };


    /* =====================================================
       LOAD ON ID CHANGE
    ===================================================== */

    useEffect(() => {

        loadWishlist();

    }, [editId, wishlist]);


    /* =====================================================
       UPDATE WISHLIST
    ===================================================== */

    const handleSubmit = async (event) => {

        event.preventDefault();

        setError("");
        setSuccess("");


        /* -------------------------------------------------
           VALIDATION
        ------------------------------------------------- */

        if (!editId) {

            setError("Wishlist ID is required.");

            return;
        }


        if (!customerId) {

            setError("Customer ID is required.");

            return;
        }


        try {

            setLoading(true);


            /* -------------------------------------------------
               PAYLOAD
            ------------------------------------------------- */

            const payload = {
                customerId: Number(customerId),
                status: status
            };


            if (sellerId) {

                payload.sellerId =
                    Number(sellerId);
            }


            console.log(
                "UPDATE WISHLIST PAYLOAD:",
                payload
            );


            /* -------------------------------------------------
               API REQUEST
            ------------------------------------------------- */

            const response = await axios.put(
                `${WISHLIST_API}/${editId}`,
                payload
            );


            console.log(
                "UPDATE WISHLIST RESPONSE:",
                response.data
            );


            /* -------------------------------------------------
               SUCCESS
            ------------------------------------------------- */

            setSuccess(
                "Wishlist updated successfully."
            );


            /* -------------------------------------------------
               CALLBACK
            ------------------------------------------------- */

            if (onUpdated) {

                onUpdated(
                    response.data?.data ??
                    response.data
                );
            }

        } catch (err) {

            console.error(
                "UPDATE WISHLIST ERROR:",
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
                "Unable to update wishlist."
            );

        } finally {

            setLoading(false);

        }
    };


    /* =====================================================
       LOADING DATA
    ===================================================== */

    if (loadingData) {

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
       RENDER
    ===================================================== */

    return (
        <Box
            sx={{
                p: 3,
                maxWidth: 700,
                mx: "auto"
            }}
        >

            {/* =================================================
               HEADER
            ================================================= */}

            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    mb: 3
                }}
            >

                <Button
                    startIcon={<ArrowBack />}
                    onClick={onBack}
                    disabled={loading}
                >
                    Back
                </Button>

                <Typography
                    variant="h4"
                    fontWeight={700}
                >
                    Edit Wishlist
                </Typography>

            </Box>


            {/* =================================================
               CARD
            ================================================= */}

            <Card elevation={3}>

                <CardContent sx={{ p: 4 }}>

                    {/* =================================================
                       TITLE
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
                            color="error"
                            sx={{
                                fontSize: 40
                            }}
                        />

                        <Box>

                            <Typography
                                variant="h5"
                                fontWeight={700}
                            >
                                Edit Wishlist
                            </Typography>

                            <Typography
                                color="text.secondary"
                            >
                                Wishlist ID: {editId}
                            </Typography>

                        </Box>

                    </Box>


                    <Divider sx={{ mb: 3 }} />


                    {/* =================================================
                       ALERTS
                    ================================================= */}

                    {error && (

                        <Alert
                            severity="error"
                            sx={{ mb: 2 }}
                        >
                            {error}
                        </Alert>

                    )}


                    {success && (

                        <Alert
                            severity="success"
                            sx={{ mb: 2 }}
                        >
                            {success}
                        </Alert>

                    )}


                    {/* =================================================
                       FORM
                    ================================================= */}

                    <Box
                        component="form"
                        onSubmit={handleSubmit}
                    >

                        {/* =================================================
                           WISHLIST ID
                        ================================================= */}

                        <TextField
                            fullWidth
                            label="Wishlist ID"
                            value={editId ?? ""}
                            disabled
                            margin="normal"
                        />


                        {/* =================================================
                           CUSTOMER ID
                        ================================================= */}

                        <TextField
                            fullWidth
                            required
                            label="Customer ID"
                            type="number"
                            value={customerId}
                            onChange={(event) =>
                                setCustomerId(
                                    event.target.value
                                )
                            }
                            disabled={loading}
                            margin="normal"
                            inputProps={{
                                min: 1
                            }}
                            helperText="Enter the customer ID"
                        />


                        {/* =================================================
                           SELLER ID
                        ================================================= */}

                        <TextField
                            fullWidth
                            label="Seller ID"
                            type="number"
                            value={sellerId}
                            onChange={(event) =>
                                setSellerId(
                                    event.target.value
                                )
                            }
                            disabled={loading}
                            margin="normal"
                            inputProps={{
                                min: 1
                            }}
                            helperText="Optional"
                        />


                        {/* =================================================
                           STATUS
                        ================================================= */}

                        <TextField
                            fullWidth
                            select
                            label="Status"
                            value={status}
                            onChange={(event) =>
                                setStatus(
                                    event.target.value
                                )
                            }
                            disabled={loading}
                            margin="normal"
                        >

                            <MenuItem value="Active">
                                Active
                            </MenuItem>

                            <MenuItem value="Inactive">
                                Inactive
                            </MenuItem>

                            <MenuItem value="Removed">
                                Removed
                            </MenuItem>

                        </TextField>


                        {/* =================================================
                           BUTTONS
                        ================================================= */}

                        <Box
                            sx={{
                                display: "flex",
                                justifyContent: "flex-end",
                                gap: 2,
                                mt: 4
                            }}
                        >

                            <Button
                                variant="outlined"
                                onClick={onBack}
                                disabled={loading}
                            >
                                Cancel
                            </Button>


                            <Button
                                type="submit"
                                variant="contained"
                                startIcon={
                                    loading
                                        ? (
                                            <CircularProgress
                                                size={20}
                                                color="inherit"
                                            />
                                        )
                                        : (
                                            <Save />
                                        )
                                }
                                disabled={loading}
                            >
                                {loading
                                    ? "Updating..."
                                    : "Update Wishlist"
                                }
                            </Button>

                        </Box>

                    </Box>

                </CardContent>

            </Card>

        </Box>
    );
};


export default WishlistEdit;