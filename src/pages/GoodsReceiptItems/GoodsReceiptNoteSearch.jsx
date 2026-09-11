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
// GOODS RECEIPT NOTE SEARCH
// ============================================================

const GoodsReceiptNoteSearch = ({
    searchText = "",
    setSearchText
}) => {

    // ========================================================
    // HANDLE SEARCH CHANGE
    // ========================================================

    const handleSearchChange = (event) => {

        const value = event.target.value;

        if (typeof setSearchText === "function") {
            setSearchText(value);
        }
    };


    // ========================================================
    // CLEAR SEARCH
    // ========================================================

    const handleClearSearch = () => {

        if (typeof setSearchText === "function") {
            setSearchText("");
        }
    };


    // ========================================================
    // RENDER
    // ========================================================

    return (

        <Box
            className="goods-receipt-note-search"
            sx={{
                mb: 3,
                width: "100%"
            }}
        >

            <TextField
                fullWidth
                size="small"

                label="Search Goods Receipt Notes"

                placeholder={
                    "Search by GRN Number, GRN ID, " +
                    "Purchase Order ID, Supplier ID, " +
                    "Seller ID, Customer ID, Status..."
                }

                value={searchText}

                onChange={handleSearchChange}

                autoComplete="off"

                InputProps={{

                    startAdornment: (

                        <InputAdornment position="start">

                            <Search
                                fontSize="small"
                                color="action"
                            />

                        </InputAdornment>
                    ),

                    endAdornment: searchText ? (

                        <InputAdornment position="end">

                            <Tooltip title="Clear search">

                                <IconButton
                                    size="small"
                                    edge="end"
                                    onClick={handleClearSearch}
                                    aria-label="clear search"
                                >

                                    <Clear
                                        fontSize="small"
                                    />

                                </IconButton>

                            </Tooltip>

                        </InputAdornment>

                    ) : null
                }}

                sx={{
                    "& .MuiOutlinedInput-root": {
                        borderRadius: 2
                    }
                }}

            />

        </Box>
    );
};


export default GoodsReceiptNoteSearch;
