import React, { useEffect, useState } from "react";

import axios from "axios";

import {
    useNavigate,
    useParams
} from "react-router-dom";

import MarketplaceOrderItemView
    from "./MarketplaceOrderItemView";




/* =========================================================
   SERVER URL
========================================================= */

const SERVER_URL = "http://localhost:5000";

const API_URL =
    `${SERVER_URL}/api/marketplace-order-items`;


/* =========================================================
   MARKETPLACE ORDER ITEM DETAILS
========================================================= */

const MarketplaceOrderItemDetails = () => {

    const navigate = useNavigate();

    const { id } = useParams();

    const [marketplaceOrderItem, setMarketplaceOrderItem] =
        useState(null);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

    const [viewOpen, setViewOpen] = useState(true);


    /* =====================================================
       LOAD ITEM
    ===================================================== */

    const loadMarketplaceOrderItem = async () => {

        try {

            setLoading(true);
            setError("");

            const response = await axios.get(
                `${API_URL}/${id}`
            );

            console.log(
                "LOAD MARKETPLACE ORDER ITEM DETAILS RESPONSE:",
                response.data
            );

            const data =
                response.data?.data ??
                response.data;

            setMarketplaceOrderItem(data);

        } catch (error) {

            console.error(
                "LOAD MARKETPLACE ORDER ITEM DETAILS ERROR:",
                error
            );

            setError(
                error.response?.data?.message ||
                error.response?.data?.title ||
                "Failed to load Marketplace Order Item."
            );

        } finally {

            setLoading(false);

        }

    };


    /* =====================================================
       INITIAL LOAD
    ===================================================== */

    useEffect(() => {

        if (id) {
            loadMarketplaceOrderItem();
        }

    }, [id]);


    /* =====================================================
       CLOSE DETAILS
    ===================================================== */

    const handleClose = () => {

        setViewOpen(false);

        navigate(
            "/marketplace-order-items"
        );

    };


    /* =====================================================
       BACK
    ===================================================== */

    const handleBack = () => {

        navigate(
            "/marketplace-order-items"
        );

    };


    /* =====================================================
       LOADING
    ===================================================== */

    if (loading) {

        return (

            <Box
                sx={{
                    p: 3
                }}
            >

                <Box
                    display="flex"
                    alignItems="center"
                    gap={2}
                >

                    <CircularProgress size={28} />

                    <Typography>
                        Loading Marketplace Order Item...
                    </Typography>

                </Box>

            </Box>

        );

    }


    /* =====================================================
       ERROR
    ===================================================== */

    if (error) {

        return (

            <Box
                sx={{
                    p: 3
                }}
            >

                <Button
                    variant="outlined"
                    startIcon={<ArrowBack />}
                    onClick={handleBack}
                    sx={{ mb: 3 }}
                >
                    Back
                </Button>

                <Alert severity="error">
                    {error}
                </Alert>

            </Box>

        );

    }


    /* =====================================================
       NOT FOUND
    ===================================================== */

    if (!marketplaceOrderItem) {

        return (

            <Box
                sx={{
                    p: 3
                }}
            >

                <Button
                    variant="outlined"
                    startIcon={<ArrowBack />}
                    onClick={handleBack}
                    sx={{ mb: 3 }}
                >
                    Back
                </Button>

                <Alert severity="warning">
                    Marketplace Order Item not found.
                </Alert>

            </Box>

        );

    }


    /* =====================================================
       RENDER
    ===================================================== */

    return (

        <Box
            sx={{
                p: 3
            }}
        >

            {/* =================================================
                HEADER
            ================================================= */}

            <Box
                display="flex"
                alignItems="center"
                gap={2}
                mb={3}
            >

                <Button
                    variant="outlined"
                    startIcon={<ArrowBack />}
                    onClick={handleBack}
                >
                    Back
                </Button>

                <Box>

                    <Typography
                        variant="h5"
                        fontWeight="bold"
                    >
                        Marketplace Order Item Details
                    </Typography>

                    <Typography
                        variant="body2"
                        color="text.secondary"
                    >
                        View Marketplace Order Item information
                    </Typography>

                </Box>

            </Box>


            {/* =================================================
                DETAILS DIALOG
            ================================================= */}

            <MarketplaceOrderItemView
                open={viewOpen}
                onClose={handleClose}
                marketplaceOrderItem={
                    marketplaceOrderItem
                }
            />

        </Box>

    );

};


export default MarketplaceOrderItemDetails;

