
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
   GOODS RECEIPT NOTE SEARCH
========================================================= */

const GoodsReceiptNoteSearch = ({
    searchText,
    setSearchText
}) => {

    const handleSearchChange = (event) => {

        const value = event.target.value;

        if (typeof setSearchText === "function") {
            setSearchText(value);
        }
    };


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
                placeholder="Search by GRN Number, Purchase Order ID, Supplier ID, Status..."
                value={searchText ?? ""}
                onChange={handleSearchChange}
                autoComplete="off"
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <Search />
                        </InputAdornment>
                    )
                }}
            />

        </Box>
    );
};


export default GoodsReceiptNoteSearch;

