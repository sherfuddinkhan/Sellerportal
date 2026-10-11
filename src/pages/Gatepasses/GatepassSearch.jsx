// =========================================================
// GatepassSearch.jsx
// =========================================================

import React from "react";

import {
    Box,
    TextField,
    InputAdornment,
    IconButton,
    Button,
    Tooltip
} from "@mui/material";

import {
    Search,
    Clear
} from "@mui/icons-material";

// =========================================================
// GATEPASS SEARCH
// =========================================================

const GatepassSearch = ({
    searchTerm = "",
    onSearchChange,
    onSearch,
    onClear,
    placeholder = "Search by code, vehicle, driver, status..."
}) => {

    // =====================================================
    // HANDLE INPUT CHANGE
    // =====================================================

    const handleChange = (event) => {
        const value = event.target.value;

        if (typeof onSearchChange === "function") {
            onSearchChange(value);
        }
    };

    // =====================================================
    // SUBMIT SEARCH
    // =====================================================

    const handleSubmit = (event) => {
        event.preventDefault();

        if (typeof onSearch === "function") {
            onSearch(searchTerm.trim());
        }
    };

    // =====================================================
    // CLEAR SEARCH
    // =====================================================

    const handleClear = () => {
        if (typeof onClear === "function") {
            onClear();
        } else if (typeof onSearchChange === "function") {
            onSearchChange("");
        }

        if (typeof onSearch === "function") {
            onSearch("");
        }
    };

    // =====================================================
    // RENDER
    // =====================================================

    return (
        <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.5,
                width: "100%",
                flexWrap: "wrap"
            }}
        >
            {/* SEARCH INPUT */}

            <TextField
                fullWidth
                size="small"
                value={searchTerm}
                onChange={handleChange}
                placeholder={placeholder}
                aria-label="Search gatepasses"
                sx={{
                    flex: "1 1 260px",
                    minWidth: 0,
                    "& .MuiOutlinedInput-root": {
                        borderRadius: 2,
                        bgcolor: "background.paper"
                    }
                }}
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <Search color="action" />
                        </InputAdornment>
                    ),

                    endAdornment: searchTerm && (
                        <InputAdornment position="end">
                            <Tooltip title="Clear search">
                                <IconButton
                                    size="small"
                                    onClick={handleClear}
                                    aria-label="Clear gatepass search"
                                    edge="end"
                                >
                                    <Clear fontSize="small" />
                                </IconButton>
                            </Tooltip>
                        </InputAdornment>
                    )
                }}
            />

            {/* SEARCH BUTTON */}

            <Button
                type="submit"
                variant="contained"
                startIcon={<Search />}
                sx={{
                    minWidth: 110,
                    borderRadius: 2,
                    textTransform: "none"
                }}
            >
                Search
            </Button>

            {/* CLEAR BUTTON */}

            <Button
                type="button"
                variant="outlined"
                color="inherit"
                onClick={handleClear}
                disabled={!searchTerm}
                sx={{
                    borderRadius: 2,
                    textTransform: "none"
                }}
            >
                Clear
            </Button>
        </Box>
    );
};

export default GatepassSearch;

