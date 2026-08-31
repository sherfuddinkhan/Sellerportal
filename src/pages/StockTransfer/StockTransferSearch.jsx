// =========================================================
// StockTransferSearch.jsx
//
// React Frontend
// React → Node server.js → .NET API
// =========================================================

import React, {
    useState,
} from "react";

import axios from "axios";

import {
    Alert,
    Box,
    Button,
    CircularProgress,
    Paper,
    TextField,
    Typography,
} from "@mui/material";

import {
    Search,
} from "@mui/icons-material";

// =========================================================
// NODE SERVER URL
// =========================================================

const SERVER_URL =
    "http://localhost:5000";

// =========================================================
// COMPONENT
// =========================================================

const StockTransferSearch = ({
    onResults,
}) => {

    // =====================================================
    // STATE
    // =====================================================

    const [
        search,
        setSearch,
    ] = useState("");

    const [
        loading,
        setLoading,
    ] = useState(false);

    const [
        error,
        setError,
    ] = useState("");

    // =====================================================
    // SEARCH STOCK TRANSFERS
    // =====================================================

    const handleSearch = async () => {

        // =================================================
        // VALIDATION
        // =================================================

        const searchValue =
            search.trim();

        if (!searchValue) {

            setError(
                "Please enter a search value."
            );

            return;
        }

        try {

            setLoading(true);
            setError("");

            console.log(
                "===================================="
            );

            console.log(
                "STOCK TRANSFER SEARCH"
            );

            console.log(
                "Search:",
                searchValue
            );

            console.log(
                "URL:",
                `${SERVER_URL}/api/stock-transfers/search`
            );

            console.log(
                "===================================="
            );

            // =================================================
            // REACT → NODE SERVER.JS
            // =================================================

            const response =
                await axios.get(
                    `${SERVER_URL}/api/stock-transfers/search`,
                    {
                        params: {
                            search:
                                searchValue,
                        },
                    }
                );

            console.log(
                "Search Response:",
                response.data
            );

            // =================================================
            // SEND RESULTS TO PARENT
            // =================================================

            if (onResults) {

                onResults(
                    response.data
                );
            }

        } catch (err) {

            console.error(
                "Stock Transfer Search Error:",
                err
            );

            console.error(
                "Server Response:",
                err?.response?.data
            );

            setError(
                err?.response?.data?.message ||
                err?.response?.data?.title ||
                "Search failed."
            );

        } finally {

            setLoading(false);

        }
    };

    // =====================================================
    // CLEAR SEARCH
    // =====================================================

    const handleClear = () => {

        setSearch("");
        setError("");

        if (onResults) {

            onResults(null);

        }
    };

    // =====================================================
    // RENDER
    // =====================================================

    return (
        <Paper
            sx={{
                p: 2,
                mb: 3,
            }}
        >

            {/* =================================================
                TITLE
            ================================================= */}

            <Typography
                variant="h6"
                sx={{
                    mb: 2,
                    fontWeight: "bold",
                }}
            >
                Search Stock Transfers
            </Typography>

            {/* =================================================
                ERROR
            ================================================= */}

            {error && (

                <Alert
                    severity="error"
                    sx={{
                        mb: 2,
                    }}
                    onClose={() =>
                        setError("")
                    }
                >
                    {error}
                </Alert>

            )}

            {/* =================================================
                SEARCH AREA
            ================================================= */}

            <Box
                sx={{
                    display: "flex",
                    gap: 2,
                    alignItems: "center",

                    flexDirection: {
                        xs: "column",
                        sm: "row",
                    },
                }}
            >

                {/* =================================================
                    SEARCH INPUT
                ================================================= */}

                <TextField
                    fullWidth
                    size="small"
                    label="Search"
                    placeholder={
                        "Transfer number, product..."
                    }
                    value={search}
                    onChange={(e) => {

                        setSearch(
                            e.target.value
                        );

                        if (error) {
                            setError("");
                        }

                    }}
                    onKeyDown={(e) => {

                        if (
                            e.key === "Enter"
                        ) {

                            handleSearch();

                        }

                    }}
                    disabled={loading}
                />

                {/* =================================================
                    SEARCH BUTTON
                ================================================= */}

                <Button
                    variant="contained"
                    startIcon={
                        loading
                            ? null
                            : <Search />
                    }
                    onClick={
                        handleSearch
                    }
                    disabled={
                        loading ||
                        !search.trim()
                    }
                    sx={{
                        minWidth: 120,
                        height: 40,
                    }}
                >

                    {loading ? (

                        <CircularProgress
                            size={20}
                            color="inherit"
                        />

                    ) : (

                        "Search"

                    )}

                </Button>

                {/* =================================================
                    CLEAR BUTTON
                ================================================= */}

                <Button
                    variant="outlined"
                    onClick={
                        handleClear
                    }
                    disabled={
                        loading ||
                        !search
                    }
                    sx={{
                        minWidth: 90,
                        height: 40,
                    }}
                >
                    Clear
                </Button>

            </Box>

        </Paper>
    );
};

// =========================================================
// EXPORT
// =========================================================

export default StockTransferSearch;
