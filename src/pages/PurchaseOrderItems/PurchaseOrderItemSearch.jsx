// ============================================================
// PurchaseOrderItemSearch.jsx
// ============================================================

import React from "react";

import {
    Box,
    TextField,
    InputAdornment,
    IconButton,
    Tooltip
} from "@mui/material";

import {
    Search,
    Clear
} from "@mui/icons-material";

// ============================================================
// COMPONENT
// ============================================================

const PurchaseOrderItemSearch = ({
    searchText,
    setSearchText
}) => {

    // ========================================================
    // SEARCH CHANGE
    // ========================================================

    const handleSearchChange = (event) => {

        const value = event.target.value;

        setSearchText(value);

    };

    // ========================================================
    // CLEAR SEARCH
    // ========================================================

    const handleClearSearch = () => {

        setSearchText("");

    };

    // ========================================================
    // NORMALIZED VALUE
    // ========================================================

    const value = searchText ?? "";

    const hasSearchText =
        value.trim().length > 0;

    // ========================================================
    // RENDER
    // ========================================================

    return (
        <Box
            className="purchase-order-item-search"
            sx={{
                mb: 3,
                width: "100%"
            }}
        >

            <TextField
                fullWidth
                size="small"
                label="Search Purchase Order Items"
                placeholder={
                    "Search by Item ID, Purchase Order ID, " +
                    "Product ID, Quantity, Unit Price, " +
                    "Discount, Tax Amount, Total Amount..."
                }
                value={value}
                onChange={handleSearchChange}

                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <Search />
                        </InputAdornment>
                    ),

                    endAdornment: hasSearchText ? (
                        <InputAdornment position="end">

                            <Tooltip title="Clear search">

                                <IconButton
                                    size="small"
                                    onClick={handleClearSearch}
                                    edge="end"
                                    aria-label="Clear search"
                                >
                                    <Clear fontSize="small" />
                                </IconButton>

                            </Tooltip>

                        </InputAdornment>
                    ) : null
                }}
            />

        </Box>
    );
};

export default PurchaseOrderItemSearch;
