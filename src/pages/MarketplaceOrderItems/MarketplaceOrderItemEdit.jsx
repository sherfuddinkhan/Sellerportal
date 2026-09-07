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

import {
    useNavigate,
    useParams
} from "react-router-dom";

import MarketplaceOrderItemModal from "./MarketplaceOrderItemModal";


/* =========================================================
   SERVER URL
========================================================= */

const SERVER_URL = "http://localhost:5000";

const API_URL =
    `${SERVER_URL}/api/marketplace-order-items`;


/* =========================================================
   MARKETPLACE ORDER ITEM EDIT
========================================================= */

const MarketplaceOrderItemEdit = () => {

    const navigate = useNavigate();

    const { id } = useParams();

    const [marketplaceOrderItem, setMarketplaceOrderItem] =
        useState(null);

    const [loading, setLoading] = useState(true);

    const [saving, setSaving] = useState(false);

    const [error, setError] = useState("");

    const [success, setSuccess] = useState("");

    const [modalOpen, setModalOpen] = useState(false);


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
                "LOAD MARKETPLACE ORDER ITEM RESPONSE:",
                response.data
            );

            const data =
                response.data?.data ??
                response.data;

            setMarketplaceOrderItem(data);

            setModalOpen(true);

        } catch (error) {

            console.error(
                "LOAD MARKETPLACE ORDER ITEM EDIT ERROR:",
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
       UPDATE ITEM
    ===================================================== */

    const handleUpdate = async (data) => {

        try {

            setSaving(true);
            setError("");
            setSuccess("");

            const response = await axios.put(
                `${API_URL}/${id}`,
                data
            );

            console.log(
                "UPDATE MARKETPLACE ORDER ITEM RESPONSE:",
                response.data
            );

            setSuccess(
                "Marketplace Order Item updated successfully."
            );

            setModalOpen(false);

            setTimeout(() => {

                navigate(
                    "/marketplace-order-items"
                );

            }, 800);

        } catch (error) {

            console.error(
                "UPDATE MARKETPLACE ORDER ITEM ERROR:",
                error
            );

            setError(
                error.response?.data?.message ||
                error.response?.data?.title ||
                "Failed to update Marketplace Order Item."
            );

        } finally {

            setSaving(false);

        }

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
                        Edit Marketplace Order Item
                    </Typography>

                    <Typography
                        variant="body2"
                        color="text.secondary"
                    >
                        Update Marketplace Order Item details
                    </Typography>

                </Box>

            </Box>


            {/* =================================================
                ERROR
            ================================================= */}

            {error && (

                <Alert
                    severity="error"
                    sx={{ mb: 3 }}
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
                    sx={{ mb: 3 }}
                >
                    {success}
                </Alert>

            )}


            {/* =================================================
                SAVING
            ================================================= */}

            {saving && (

                <Box
                    display="flex"
                    alignItems="center"
                    gap={2}
                    mb={2}
                >

                    <CircularProgress size={24} />

                    <Typography>
                        Updating Marketplace Order Item...
                    </Typography>

                </Box>

            )}


            {/* =================================================
                ITEM NOT FOUND
            ================================================= */}

            {!marketplaceOrderItem && !error && (

                <Alert severity="warning">
                    Marketplace Order Item not found.
                </Alert>

            )}


            {/* =================================================
                EDIT MODAL
            ================================================= */}

            {marketplaceOrderItem && (

                <MarketplaceOrderItemModal
                    open={modalOpen}
                    onClose={handleBack}
                    marketplaceOrderItem={
                        marketplaceOrderItem
                    }
                    onSave={handleUpdate}
                />

            )}

        </Box>

    );

};


export default MarketplaceOrderItemEdit;

