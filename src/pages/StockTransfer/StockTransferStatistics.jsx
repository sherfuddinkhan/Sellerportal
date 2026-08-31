// =========================================================
// StockTransferStatistics.jsx
// Stock Transfer Statistics
//
// React → Node server.js → .NET API
// =========================================================

import React, {
    useEffect,
    useState,
} from "react";

import axios from "axios";

import {
    Alert,
    Box,
    Card,
    CardContent,
    CircularProgress,
    Grid,
    Typography,
} from "@mui/material";

// =========================================================
// NODE SERVER URL
// =========================================================

const SERVER_URL = "http://localhost:5000";

// =========================================================
// COMPONENT
// =========================================================

const StockTransferStatistics = () => {

    // =====================================================
    // STATE
    // =====================================================

    const [
        statistics,
        setStatistics,
    ] = useState(null);

    const [
        loading,
        setLoading,
    ] = useState(true);

    const [
        error,
        setError,
    ] = useState("");

    // =====================================================
    // LOAD STATISTICS
    // =====================================================

    const loadStatistics = async () => {

        try {

            setLoading(true);
            setError("");

            console.log(
                "Loading stock transfer statistics..."
            );

            console.log(
                "Request URL:",
                `${SERVER_URL}/api/stock-transfers/statistics`
            );

            // =================================================
            // REACT → NODE SERVER.JS
            // =================================================

            const response =
                await axios.get(
                    `${SERVER_URL}/api/stock-transfers/statistics`
                );

            console.log(
                "Stock Transfer Statistics Response:",
                response.data
            );

            // =================================================
            // STORE RESPONSE
            // =================================================

            setStatistics(
                response.data
            );

        } catch (err) {

            console.error(
                "Stock transfer statistics error:",
                err
            );

            console.error(
                "Server response:",
                err?.response?.data
            );

            setError(
                err?.response?.data?.message ||
                err?.response?.data?.title ||
                "Failed to load stock transfer statistics."
            );

        } finally {

            setLoading(false);

        }
    };

    // =====================================================
    // LOAD WHEN COMPONENT MOUNTS
    // =====================================================

    useEffect(() => {

        loadStatistics();

    }, []);

    // =====================================================
    // LOADING
    // =====================================================

    if (loading) {

        return (
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    minHeight: 150,
                    p: 4,
                }}
            >

                <CircularProgress />

            </Box>
        );
    }

    // =====================================================
    // ERROR
    // =====================================================

    if (error) {

        return (
            <Alert
                severity="error"
                sx={{
                    mb: 3,
                }}
            >
                {error}
            </Alert>
        );
    }

    // =====================================================
    // NO DATA
    // =====================================================

    if (!statistics) {

        return (
            <Alert
                severity="info"
                sx={{
                    mb: 3,
                }}
            >
                No stock transfer statistics available.
            </Alert>
        );
    }

    // =====================================================
    // CONVERT OBJECT TO ARRAY
    // =====================================================

    const items =
        Object.entries(
            statistics
        );

    // =====================================================
    // RENDER
    // =====================================================

    return (
        <Box
            sx={{
                width: "100%",
                mb: 3,
            }}
        >

            {/* =================================================
                TITLE
            ================================================= */}

            <Typography
                variant="h5"
                fontWeight="bold"
                sx={{
                    mb: 2,
                }}
            >
                Stock Transfer Statistics
            </Typography>

            {/* =================================================
                STATISTICS CARDS
            ================================================= */}

            <Grid
                container
                spacing={2}
            >

                {items.map(
                    ([key, value]) => (

                        <Grid
                            item
                            xs={12}
                            sm={6}
                            md={3}
                            key={key}
                        >

                            <Card
                                elevation={2}
                                sx={{
                                    height: "100%",
                                }}
                            >

                                <CardContent>

                                    <Typography
                                        variant="body2"
                                        color="text.secondary"
                                        sx={{
                                            mb: 1,
                                        }}
                                    >
                                        {formatLabel(
                                            key
                                        )}
                                    </Typography>

                                    <Typography
                                        variant="h5"
                                        fontWeight="bold"
                                    >
                                        {
                                            value ??
                                            0
                                        }
                                    </Typography>

                                </CardContent>

                            </Card>

                        </Grid>

                    )
                )}

            </Grid>

        </Box>
    );
};

// =========================================================
// FORMAT LABEL
// =========================================================

const formatLabel = (
    value
) => {

    if (!value) {
        return "";
    }

    return String(value)
        .replace(
            /([A-Z])/g,
            " $1"
        )
        .replace(
            /^./,
            (str) =>
                str.toUpperCase()
        );
};

// =========================================================
// EXPORT
// =========================================================

export default StockTransferStatistics;
