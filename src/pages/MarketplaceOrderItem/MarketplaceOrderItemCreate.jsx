import React, { useState } from "react";

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

import { useNavigate } from "react-router-dom";

import MarketplaceOrderItemModal from "./components/MarketplaceOrderItemModal";


/* =========================================================
   SERVER URL
========================================================= */

const SERVER_URL = "http://localhost:5000";

const API_URL =
    `${SERVER_URL}/api/marketplace-order-items`;


/* =========================================================
   MARKETPLACE ORDER ITEM CREATE
========================================================= */

const MarketplaceOrderItemCreate = () => {

    const navigate = useNavigate();

    const [modalOpen, setModalOpen] = useState(true);

    const [loading, setLoading] = useState(false);

    const [error, setError] = useState("");

    const [success, setSuccess] = useState("");


    /* =====================================================
       CREATE ITEM
    ===================================================== */

    const handleCreate = async (data) => {

        try {

            setLoading(true);
            setError("");
            setSuccess("");

            const response = await axios.post(
                API_URL,
                data
            );

            console.log(
                "CREATE MARKETPLACE ORDER ITEM RESPONSE:",
                response.data
            );

            setSuccess(
                "Marketplace Order Item created successfully."
            );

            setModalOpen(false);

            setTimeout(() => {

                navigate(
                    "/marketplace-order-items"
                );

            }, 800);

        } catch (error) {

            console.error(
                "CREATE MARKETPLACE ORDER ITEM ERROR:",
                error
            );

            setError(
                error.response?.data?.message ||
                error.response?.data?.title ||
                "Failed to create Marketplace Order Item."
            );

        } finally {

            setLoading(false);

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
                        Create Marketplace Order Item
                    </Typography>

                    <Typography
                        variant="body2"
                        color="text.secondary"
                    >
                        Add a new Marketplace Order Item
                    </Typography>

                </Box>

            </Box>


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
                LOADING
            ================================================= */}

            {loading && (

                <Box
                    display="flex"
                    alignItems="center"
                    gap={2}
                    mb={2}
                >

                    <CircularProgress size={24} />

                    <Typography>
                        Creating Marketplace Order Item...
                    </Typography>

                </Box>

            )}


            {/* =================================================
                CREATE MODAL
            ================================================= */}

            <MarketplaceOrderItemModal
                open={modalOpen}
                onClose={handleBack}
                marketplaceOrderItem={null}
                onSave={handleCreate}
            />

        </Box>

    );

};


export default MarketplaceOrderItemCreate;

