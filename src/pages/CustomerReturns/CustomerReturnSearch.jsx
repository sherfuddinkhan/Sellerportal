// =========================================================
// CustomerReturnSearch.jsx
// Customer Return Search
//
// Searches by:
// - Return Number
// - Invoice ID
// - Product ID
// - Reason
// - Status
// =========================================================

import React from "react";

import {
    Paper,
    TextField,
    InputAdornment,
} from "@mui/material";

import {
    Search,
} from "@mui/icons-material";

// =========================================================
// COMPONENT
// =========================================================

const CustomerReturnSearch = ({
    searchText = "",
    setSearchText,
}) => {

    // =====================================================
    // HANDLE SEARCH
    // =====================================================

    const handleSearchChange = (event) => {

        const value =
            event.target.value;

        setSearchText(value);

    };

    // =====================================================
    // RENDER
    // =====================================================

    return (

        <Paper
            elevation={2}
            sx={{
                p: 2,
                mb: 3,
            }}
        >

            <TextField
                fullWidth
                label="Search Customer Returns"
                placeholder={
                    "Search by Return Number, Invoice ID, " +
                    "Product ID, Reason or Status"
                }
                value={searchText}
                onChange={handleSearchChange}
                autoComplete="off"
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">

                            <Search
                                color="action"
                            />

                        </InputAdornment>
                    ),
                }}
            />

        </Paper>

    );

};

// =========================================================
// EXPORT
// =========================================================

export default CustomerReturnSearch;