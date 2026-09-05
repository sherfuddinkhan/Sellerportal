import React from "react";

import {
    Box,
    TextField,
    InputAdornment
} from "@mui/material";

import {
    Search
} from "@mui/icons-material";


/* =========================================================
   GOODS RECEIPT NOTE ITEM SEARCH
========================================================= */

const GoodsReceiptNoteItemSearch = ({
    searchText = "",
    setSearchText
}) => {


    /* =========================================================
       HANDLE SEARCH CHANGE
    ========================================================= */

    const handleSearchChange = (event) => {

        const value = event.target.value;

        if (typeof setSearchText === "function") {
            setSearchText(value);
        }
    };


    /* =========================================================
       CLEAR SEARCH
    ========================================================= */

    const handleClearSearch = () => {

        if (typeof setSearchText === "function") {
            setSearchText("");
        }
    };


    /* =========================================================
       RENDER
    ========================================================= */

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

                placeholder="Search by GRN Item ID, GRN ID, Product ID..."

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
                    )
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
