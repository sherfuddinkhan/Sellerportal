// =========================================================
// StockAdjustmentSearch.jsx
// Stock Adjustment Search
// =========================================================

import React, { useState } from "react";

import {
    Alert,
    Box,
    Button,
    CircularProgress,
    InputAdornment,
    Paper,
    TextField,
    Typography
} from "@mui/material";

import {
    Search,
    Clear
} from "@mui/icons-material";

import { useNavigate } from "react-router-dom";

// =========================================================
// CONFIGURATION
// =========================================================

const SERVER_URL = "http://localhost:5000";

// =========================================================
// COMPONENT
// =========================================================

const StockAdjustmentSearch = ({
    onResults,
    onSearch,
    onClear,
    loading: externalLoading = false
}) => {

    const navigate = useNavigate();

    const [search, setSearch] = useState("");

    const [results, setResults] = useState([]);

    const [loading, setLoading] = useState(false);

    const [error, setError] = useState("");

    // =========================================================
    // HANDLE SEARCH INPUT
    // =========================================================

    const handleChange = (event) => {

        setSearch(event.target.value);

        if (error) {
            setError("");
        }
    };

    // =========================================================
    // SEARCH
    // =========================================================

    const handleSearch = async () => {

        const value = search.trim();

        if (!value) {
            setError("Please enter a search value.");
            setResults([]);
            return;
        }

        try {

            setLoading(true);
            setError("");

            const response = await fetch(
                `${SERVER_URL}/api/stock-adjustments/search?search=${encodeURIComponent(value)}`
            );

            if (!response.ok) {

                let message = "Failed to search stock adjustments.";

                try {
                    const errorData = await response.json();

                    if (errorData.message) {
                        message = errorData.message;
                    } else if (errorData.title) {
                        message = errorData.title;
                    } else if (errorData.errors) {
                        message = JSON.stringify(errorData.errors);
                    }

                } catch {
                    // Ignore JSON parsing errors
                }

                throw new Error(message);
            }

            const data = await response.json();

            // =================================================
            // NORMALIZE RESPONSE
            // =================================================

            let searchResults = [];

            if (Array.isArray(data)) {

                searchResults = data;

            } else if (Array.isArray(data.items)) {

                searchResults = data.items;

            } else if (Array.isArray(data.data)) {

                searchResults = data.data;

            } else if (data.data && Array.isArray(data.data.items)) {

                searchResults = data.data.items;

            } else if (data.result && Array.isArray(data.result)) {

                searchResults = data.result;

            } else if (data.result && Array.isArray(data.result.items)) {

                searchResults = data.result.items;

            } else if (data) {

                searchResults = [data];

            }

            setResults(searchResults);

            // =================================================
            // SEND RESULTS TO PARENT
            // =================================================

            if (onResults) {
                onResults(searchResults);
            }

            if (onSearch) {
                onSearch(value, searchResults);
            }

        } catch (err) {

            console.error(
                "Stock Adjustment Search Error:",
                err
            );

            setResults([]);

            setError(
                err.message ||
                "Unable to search stock adjustments."
            );

        } finally {

            setLoading(false);
        }
    };

    // =========================================================
    // CLEAR
    // =========================================================

    const handleClear = () => {

        setSearch("");
        setResults([]);
        setError("");

        if (onClear) {
            onClear();
        }

        if (onResults) {
            onResults([]);
        }
    };

    // =========================================================
    // KEYBOARD SEARCH
    // =========================================================

    const handleKeyDown = (event) => {

        if (event.key === "Enter") {
            handleSearch();
        }
    };

    // =========================================================
    // VIEW RESULT
    // =========================================================

    const handleView = (item) => {

        const id =
            item.stockAdjustmentId ??
            item.StockAdjustmentId;

        if (!id) {
            return;
        }

        navigate(
            `/stock-adjustments/view/${id}`
        );
    };

    // =========================================================
    // LOADING STATE
    // =========================================================

    const isLoading =
        loading || externalLoading;

    // =========================================================
    // RENDER
    // =========================================================

    return (
        <Box>

            {/* =================================================
                SEARCH PANEL
            ================================================= */}

            <Paper
                elevation={1}
                sx={{
                    p: 2,
                    mb: 2
                }}
            >

                <Typography
                    variant="h6"
                    sx={{
                        mb: 2,
                        fontWeight: 600
                    }}
                >
                    Search Stock Adjustments
                </Typography>


                {/* =================================================
                    SEARCH INPUT
                ================================================= */}

                <Box
                    sx={{
                        display: "flex",
                        gap: 2,
                        alignItems: "center",
                        flexWrap: "wrap"
                    }}
                >

                    <TextField
                        label="Search"
                        placeholder="Search by adjustment, product, warehouse..."
                        value={search}
                        onChange={handleChange}
                        onKeyDown={handleKeyDown}
                        size="small"
                        fullWidth
                        sx={{
                            flex: 1,
                            minWidth: 250
                        }}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Search />
                                </InputAdornment>
                            )
                        }}
                    />


                    {/* =================================================
                        SEARCH BUTTON
                    ================================================= */}

                    <Button
                        variant="contained"
                        startIcon={
                            isLoading
                                ? <CircularProgress
                                    size={18}
                                    color="inherit"
                                />
                                : <Search />
                        }
                        onClick={handleSearch}
                        disabled={
                            isLoading ||
                            !search.trim()
                        }
                    >
                        {isLoading
                            ? "Searching..."
                            : "Search"
                        }
                    </Button>


                    {/* =================================================
                        CLEAR BUTTON
                    ================================================= */}

                    <Button
                        variant="outlined"
                        startIcon={<Clear />}
                        onClick={handleClear}
                        disabled={
                            isLoading &&
                            !search
                        }
                    >
                        Clear
                    </Button>

                </Box>


                {/* =================================================
                    ERROR
                ================================================= */}

                {error && (
                    <Alert
                        severity="error"
                        sx={{
                            mt: 2
                        }}
                    >
                        {error}
                    </Alert>
                )}

            </Paper>


            {/* =================================================
                SEARCH RESULTS
            ================================================= */}

            {results.length > 0 && (

                <Paper
                    elevation={1}
                    sx={{
                        p: 2
                    }}
                >

                    <Typography
                        variant="subtitle1"
                        sx={{
                            mb: 2,
                            fontWeight: 600
                        }}
                    >
                        Search Results ({results.length})
                    </Typography>


                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 1
                        }}
                    >

                        {results.map((item, index) => {

                            const id =
                                item.stockAdjustmentId ??
                                item.StockAdjustmentId;

                            const sellerId =
                                item.sellerId ??
                                item.SellerId;

                            const customerId =
                                item.customerId ??
                                item.CustomerId;

                            const productId =
                                item.productId ??
                                item.ProductId;

                            const warehouseId =
                                item.warehouseId ??
                                item.WarehouseId;

                            const adjustmentType =
                                item.adjustmentType ??
                                item.AdjustmentType ??
                                "-";

                            const quantity =
                                item.quantity ??
                                item.Quantity ??
                                0;

                            const remarks =
                                item.remarks ??
                                item.Remarks ??
                                "-";

                            const adjustmentDate =
                                item.adjustmentDate ??
                                item.AdjustmentDate ??
                                item.date ??
                                item.Date ??
                                "-";

                            return (
                                <Box
                                    key={
                                        id ??
                                        `result-${index}`
                                    }
                                    sx={{
                                        p: 2,
                                        border: "1px solid",
                                        borderColor: "divider",
                                        borderRadius: 1,
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "space-between",
                                        gap: 2,
                                        flexWrap: "wrap"
                                    }}
                                >

                                    <Box
                                        sx={{
                                            flex: 1,
                                            minWidth: 250
                                        }}
                                    >

                                        <Typography
                                            variant="subtitle2"
                                            fontWeight={600}
                                        >
                                            Adjustment #{id ?? "-"}
                                        </Typography>

                                        <Typography
                                            variant="body2"
                                            color="text.secondary"
                                        >
                                            Seller: {sellerId ?? "-"}
                                            {" | "}
                                            Customer: {customerId ?? "-"}
                                            {" | "}
                                            Product: {productId ?? "-"}
                                            {" | "}
                                            Warehouse: {warehouseId ?? "-"}
                                        </Typography>

                                        <Typography
                                            variant="body2"
                                            sx={{
                                                mt: 0.5
                                            }}
                                        >
                                            Type: {adjustmentType}
                                            {" | "}
                                            Quantity: {quantity}
                                        </Typography>

                                        <Typography
                                            variant="body2"
                                            color="text.secondary"
                                        >
                                            Date: {adjustmentDate}
                                        </Typography>

                                        <Typography
                                            variant="body2"
                                            color="text.secondary"
                                        >
                                            Remarks: {remarks}
                                        </Typography>

                                    </Box>


                                    {/* =================================================
                                        VIEW BUTTON
                                    ================================================= */}

                                    {id && (
                                        <Button
                                            variant="outlined"
                                            size="small"
                                            onClick={() =>
                                                handleView(item)
                                            }
                                        >
                                            View
                                        </Button>
                                    )}

                                </Box>
                            );
                        })}

                    </Box>

                </Paper>
            )}


            {/* =================================================
                NO RESULTS
            ================================================= */}

            {!isLoading &&
                !error &&
                search.trim() &&
                results.length === 0 && (
                    <Alert severity="info">
                        No stock adjustments found for "{search}".
                    </Alert>
                )}

        </Box>
    );
};

export default StockAdjustmentSearch;