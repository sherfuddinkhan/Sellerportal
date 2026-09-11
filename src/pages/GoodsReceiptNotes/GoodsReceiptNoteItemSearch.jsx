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
// GOODS RECEIPT NOTE ITEM SEARCH
// ============================================================

const GoodsReceiptNoteItemSearch = ({
    searchText = "",
    setSearchText
}) => {

    // ========================================================
    // SEARCH CHANGE
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
            className="goods-receipt-note-item-search"
            sx={{
                mb: 3,
                width: "100%"
            }}
        >

            <TextField
                fullWidth
                size="small"

                label="Search Goods Receipt Note Items"

                placeholder={
                    "Search by GNI ID, GRN ID, PO Item ID, " +
                    "Seller ID, Customer ID, Supplier ID, Product ID, Status..."
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
                                    onClick={handleClearSearch}
                                    edge="end"
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


export default GoodsReceiptNoteItemSearch;
