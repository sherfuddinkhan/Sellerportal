
// =========================================================
// VendorItemMasterSearch.jsx
// =========================================================

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

// =========================================================
// VENDOR ITEM MASTER SEARCH
// =========================================================

const VendorItemMasterSearch = ({
    value = "",
    onChange,
    onSearch,
    onClear,
    placeholder = "Search by item code, item name, or description...",
    loading = false,
    fullWidth = true,
    size = "small"
}) => {

    // =====================================================
    // HANDLE INPUT CHANGE
    // =====================================================

    const handleChange = (event) => {
        const searchValue = event.target.value;

        if (typeof onChange === "function") {
            onChange(searchValue);
        }
    };

    // =====================================================
    // HANDLE SEARCH
    // =====================================================

    const handleSearch = (event) => {
        if (event) {
            event.preventDefault();
        }

        if (typeof onSearch === "function") {
            onSearch(value.trim());
        }
    };

    // =====================================================
    // HANDLE CLEAR
    // =====================================================

    const handleClear = () => {
        if (typeof onChange === "function") {
            onChange("");
        }

        if (typeof onClear === "function") {
            onClear();
        } else if (typeof onSearch === "function") {
            onSearch("");
        }
    };

    // =====================================================
    // RENDER
    // =====================================================

    return (
        <Box
            component="form"
            onSubmit={handleSearch}
            sx={{
                width: fullWidth ? "100%" : "auto"
            }}
        >
            <TextField
                fullWidth={fullWidth}
                size={size}
                value={value}
                onChange={handleChange}
                placeholder={placeholder}
                disabled={loading}
                variant="outlined"
                inputProps={{
                    "aria-label": "Search vendor items"
                }}
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <Search color="action" />
                        </InputAdornment>
                    ),
                    endAdornment: value ? (
                        <InputAdornment position="end">
                            <Tooltip title="Clear search">
                                <span>
                                    <IconButton
                                        size="small"
                                        aria-label="Clear search"
                                        onClick={handleClear}
                                        disabled={loading}
                                        edge="end"
                                    >
                                        <Clear fontSize="small" />
                                    </IconButton>
                                </span>
                            </Tooltip>
                        </InputAdornment>
                    ) : null
                }}
                sx={{
                    "& .MuiOutlinedInput-root": {
                        borderRadius: 2,
                        backgroundColor: "background.paper"
                    }
                }}
            />
        </Box>
    );
};

export default VendorItemMasterSearch;

