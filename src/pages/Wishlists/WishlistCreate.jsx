import React, { useState } from "react";

import {
    Box,
    Card,
    CardContent,
    Typography,
    TextField,
    Button,
    Alert,
    CircularProgress,
    Divider
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

const WishlistCreate = ({
    onBack,
    onCreated
}) => {

    /* =====================================================
       FORM STATE
    ===================================================== */

    const [customerId, setCustomerId] = useState("");
    const [sellerId, setSellerId] = useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");


    /* =====================================================
       CREATE WISHLIST
    ===================================================== */

    const handleSubmit = async (event) => {

        event.preventDefault();

        setError("");
        setSuccess("");


        /* -------------------------------------------------
           VALIDATION
        ------------------------------------------------- */

        if (!customerId) {

            setError("Customer ID is required.");

            return;
        }


        try {

            setLoading(true);


            /* -------------------------------------------------
               REQUEST PAYLOAD
            ------------------------------------------------- */

            const payload = {
                customerId: Number(customerId)
            };


            /*
             * SellerId is included only when entered.
             *
             * If your Wishlist entity contains SellerId,
             * this will be sent to the API.
             */

            if (sellerId) {
                payload.sellerId = Number(sellerId);
            }


            console.log(
                "CREATE WISHLIST PAYLOAD:",
                payload
            );


            /* -------------------------------------------------
               API REQUEST
            ------------------------------------------------- */

            const response = await axios.post(
                WISHLIST_API,
                payload
            );


            console.log(
                "CREATE WISHLIST RESPONSE:",
                response.data
            );


            /* -------------------------------------------------
               SUCCESS
            ------------------------------------------------- */

            setSuccess(
                "Wishlist created successfully."
            );


            /* -------------------------------------------------
               CALLBACK
            ------------------------------------------------- */

            if (onCreated) {

                onCreated(
                    response.data?.data ??
                    response.data
                );
            }


            /* -------------------------------------------------
               CLEAR FORM
            ------------------------------------------------- */

            setCustomerId("");
            setSellerId("");


        } catch (err) {

            console.error(
                "CREATE WISHLIST ERROR:",
                err
            );


            const message =
                err.response?.data?.message ||
                err.response?.data?.title ||
                (
                    typeof err.response?.data === "string"
                        ? err.response.data
                        : null
                ) ||
                "Unable to create wishlist.";


            setError(message);

        } finally {

            setLoading(false);

        }
    };


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
                    Create Wishlist
                </Typography>

            </Box>


            {/* =================================================
               CARD
            ================================================= */}

            <Card elevation={3}>

                <CardContent sx={{ p: 4 }}>

                    {/* TITLE */}

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
                            sx={{ fontSize: 40 }}
                        />

                        <Box>

                            <Typography
                                variant="h5"
                                fontWeight={700}
                            >
                                New Wishlist
                            </Typography>

                            <Typography
                                color="text.secondary"
                            >
                                Create a wishlist for a customer
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

                        {/* CUSTOMER ID */}

                        <TextField
                            fullWidth
                            required
                            label="Customer ID"
                            type="number"
                            value={customerId}
                            onChange={(event) =>
                                setCustomerId(event.target.value)
                            }
                            disabled={loading}
                            margin="normal"
                            inputProps={{
                                min: 1
                            }}
                            helperText="Enter the customer ID"
                        />


                        {/* SELLER ID */}

                        <TextField
                            fullWidth
                            label="Seller ID"
                            type="number"
                            value={sellerId}
                            onChange={(event) =>
                                setSellerId(event.target.value)
                            }
                            disabled={loading}
                            margin="normal"
                            inputProps={{
                                min: 1
                            }}
                            helperText="Optional"
                        />


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
                                        ? <CircularProgress
                                            size={20}
                                            color="inherit"
                                          />
                                        : <Save />
                                }
                                disabled={loading}
                            >
                                {loading
                                    ? "Creating..."
                                    : "Create Wishlist"
                                }
                            </Button>

                        </Box>

                    </Box>

                </CardContent>

            </Card>

        </Box>
    );
};


export default WishlistCreate;