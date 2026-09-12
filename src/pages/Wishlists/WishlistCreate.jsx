import React, { useState } from "react";

import {
    useNavigate
} from "react-router-dom";

import axios from "axios";

import {
    Alert,
    Box,
    Button,
    Card,
    CardContent,
    CircularProgress,
    Divider,
    TextField,
    Typography
} from "@mui/material";

import {
    ArrowBack,
    Favorite,
    Save
} from "@mui/icons-material";


/* ============================================================
   CONFIGURATION
============================================================ */

const SERVER_URL =
    import.meta.env.VITE_SERVER_URL ||
    "http://localhost:5000";

const WISHLIST_API =
    `${SERVER_URL}/api/Wishlist`;


/* ============================================================
   COMPONENT
============================================================ */

const WishlistCreate = ({
    onBack,
    onCreated
}) => {

    const navigate = useNavigate();


    /* ========================================================
       FORM STATE
    ======================================================== */

    const [customerId, setCustomerId] = useState("");
    const [sellerId, setSellerId] = useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");


    /* ========================================================
       BACK
    ======================================================== */

    const handleBack = () => {

        if (onBack) {
            onBack();
            return;
        }

        navigate("/wishlists");
    };


    /* ========================================================
       ERROR MESSAGE
    ======================================================== */

    const getErrorMessage = (err) => {

        const data = err?.response?.data;

        if (typeof data === "string" && data.trim()) {
            return data;
        }

        if (data?.message) {
            return data.message;
        }

        if (data?.title) {
            return data.title;
        }

        if (data?.errors) {

            const validationErrors = Object.values(
                data.errors
            )
                .flat()
                .filter(Boolean);

            if (validationErrors.length > 0) {
                return validationErrors.join(" ");
            }
        }

        return (
            err?.message ||
            "Unable to create wishlist."
        );
    };


    /* ========================================================
       CREATE WISHLIST
    ======================================================== */

    const handleSubmit = async (event) => {

        event.preventDefault();

        setError("");
        setSuccess("");


        /* ----------------------------------------------------
           CUSTOMER VALIDATION
        ---------------------------------------------------- */

        const customerValue =
            Number(customerId);

        if (
            !customerId ||
            !Number.isInteger(customerValue) ||
            customerValue <= 0
        ) {
            setError(
                "Customer ID must be a valid positive number."
            );

            return;
        }


        /* ----------------------------------------------------
           SELLER VALIDATION
        ---------------------------------------------------- */

        let sellerValue = null;

        if (sellerId !== "") {

            sellerValue = Number(sellerId);

            if (
                !Number.isInteger(sellerValue) ||
                sellerValue <= 0
            ) {
                setError(
                    "Seller ID must be a valid positive number."
                );

                return;
            }
        }


        try {

            setLoading(true);


            /* ------------------------------------------------
               REQUEST PAYLOAD
            ------------------------------------------------ */

            const payload = {
                customerId: customerValue
            };

            if (sellerValue !== null) {
                payload.sellerId = sellerValue;
            }


            console.log(
                "CREATE WISHLIST PAYLOAD:",
                payload
            );


            /* ------------------------------------------------
               API REQUEST

               React -> Node
               http://localhost:5000/api/Wishlist
            ------------------------------------------------ */

            const response = await axios.post(
                WISHLIST_API,
                payload,
                {
                    timeout: 30000,
                    headers: {
                        "Content-Type": "application/json"
                    }
                }
            );


            console.log(
                "CREATE WISHLIST RESPONSE:",
                response.data
            );


            /* ------------------------------------------------
               RESPONSE DATA
            ------------------------------------------------ */

            const createdWishlist =
                response.data?.data ??
                response.data;


            /* ------------------------------------------------
               SUCCESS
            ------------------------------------------------ */

            setSuccess(
                "Wishlist created successfully."
            );


            /* ------------------------------------------------
               CALLBACK
            ------------------------------------------------ */

            if (onCreated) {

                onCreated(
                    createdWishlist
                );
            }


            /* ------------------------------------------------
               RETURN TO WISHLIST LIST

               Small delay allows the success message to
               render before navigation.
            ------------------------------------------------ */

            setTimeout(() => {

                navigate("/wishlists");

            }, 800);


        } catch (err) {

            console.error(
                "CREATE WISHLIST ERROR:",
                err
            );

            setError(
                getErrorMessage(err)
            );

        } finally {

            setLoading(false);
        }
    };


    /* ========================================================
       RENDER
    ======================================================== */

    return (
        <Box
            sx={{
                p: {
                    xs: 2,
                    sm: 3
                },
                maxWidth: 700,
                mx: "auto"
            }}
        >

            {/* =================================================
               PAGE HEADER
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
                    onClick={handleBack}
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
               FORM CARD
            ================================================= */}

            <Card elevation={3}>

                <CardContent
                    sx={{
                        p: {
                            xs: 2,
                            sm: 4
                        }
                    }}
                >

                    {/* =================================================
                       CARD HEADER
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
                       ERROR
                    ================================================= */}

                    {error && (

                        <Alert
                            severity="error"
                            sx={{ mb: 2 }}
                        >
                            {error}
                        </Alert>

                    )}


                    {/* =================================================
                       SUCCESS
                    ================================================= */}

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
                        noValidate
                    >

                        {/* =================================================
                           CUSTOMER ID
                        ================================================= */}

                        <TextField
                            fullWidth
                            required
                            label="Customer ID"
                            type="number"
                            value={customerId}
                            onChange={(event) => {
                                setCustomerId(
                                    event.target.value
                                );
                                setError("");
                            }}
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
                            onChange={(event) => {
                                setSellerId(
                                    event.target.value
                                );
                                setError("");
                            }}
                            disabled={loading}
                            margin="normal"
                            inputProps={{
                                min: 1
                            }}
                            helperText="Optional"
                        />


                        {/* =================================================
                           ACTION BUTTONS
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
                                onClick={handleBack}
                                disabled={loading}
                            >
                                Cancel
                            </Button>


                            <Button
                                type="submit"
                                variant="contained"
                                startIcon={
                                    loading ? (
                                        <CircularProgress
                                            size={20}
                                            color="inherit"
                                        />
                                    ) : (
                                        <Save />
                                    )
                                }
                                disabled={loading}
                            >
                                {loading
                                    ? "Creating..."
                                    : "Create Wishlist"}
                            </Button>

                        </Box>

                    </Box>

                </CardContent>

            </Card>

        </Box>
    );
};


export default WishlistCreate;
