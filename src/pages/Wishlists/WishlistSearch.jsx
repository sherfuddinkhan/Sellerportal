// =========================================================
// WishlistSearch.jsx
// =========================================================

import React from "react";

import {
    Box,
    TextField,
    InputAdornment,
    IconButton,
    Tooltip,
} from "@mui/material";

import {
    Search,
    Clear,
} from "@mui/icons-material";

// =========================================================
// COMPONENT
// =========================================================

const WishlistSearch = ({
    searchTerm = "",
    onSearch,
    onClear,
    loading = false,
}) => {
    // =========================================================
    // HANDLE SEARCH
    // =========================================================

    const handleChange = (event) => {
        const value = event.target.value;

        if (onSearch) {
            onSearch(value);
        }
    };

    // =========================================================
    // CLEAR SEARCH
    // =========================================================

    const handleClear = () => {
        if (onClear) {
            onClear();
        } else if (onSearch) {
            onSearch("");
        }
    };

    // =========================================================
    // HANDLE ENTER
    // =========================================================

    const handleKeyDown = (event) => {
        if (event.key === "Enter") {
            if (onSearch) {
                onSearch(searchTerm);
            }
        }
    };

    // =========================================================
    // RENDER
    // =========================================================

    return (
        <Box
            sx={{
                width: "100%",
                display: "flex",
                alignItems: "center",
            }}
        >
            <TextField
                fullWidth
                size="small"
                variant="outlined"
                label="Search Wishlist"
                placeholder="Search by product, customer, SKU..."
                value={searchTerm}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                disabled={loading}
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <Search
                                fontSize="small"
                            />
                        </InputAdornment>
                    ),

                    endAdornment:
                        searchTerm ? (
                            <InputAdornment position="end">
                                <Tooltip title="Clear Search">
                                    <IconButton
                                        size="small"
                                        onClick={
                                            handleClear
                                        }
                                        disabled={
                                            loading
                                        }
                                        aria-label="Clear search"
                                    >
                                        <Clear fontSize="small" />
                                    </IconButton>
                                </Tooltip>
                            </InputAdornment>
                        ) : null,
                }}
            />
        </Box>
    );
};

export default WishlistSearch;